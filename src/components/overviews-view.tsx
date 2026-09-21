import { useLiveQuery } from "dexie-react-hooks";
import { Loader2, Pause, Play, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MindMapView } from "@/components/mind-map";
import { Button } from "@/components/ui/button";
import {
  fetchAudioOverviewScript,
  fetchMindMapData,
  fetchStudioSpeech,
} from "@/lib/ai/server";
import { aiOptsFromPrefs } from "@/lib/manna/ai-opts";
import { getDb } from "@/lib/manna/db";
import { STUDY_MODES } from "@/lib/manna/lenses";
import { useMannaUI } from "@/lib/manna/store";
import type {
  AudioOverviewData,
  MindMapData,
  OverviewRecord,
  SourceRecord,
} from "@/lib/manna/types";
import { toPayloads } from "@/lib/manna/vault";
import { cn, formatDate, uid } from "@/lib/utils";

function SourceMulti({
  sources,
  selected,
  onToggle,
}: {
  sources: SourceRecord[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((s) => {
        const on = selected.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle(s.id)}
            className={cn(
              "h-9 rounded-full px-3 text-xs",
              on ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {s.title}
          </button>
        );
      })}
    </div>
  );
}

function AudioPlayer({ data }: { data: AudioOverviewData }) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [studioBusy, setStudioBusy] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      audioRef.current?.pause();
    };
  }, []);

  function playBrowser() {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    const utter = new SpeechSynthesisUtterance(data.script);
    utter.rate = 0.95;
    utter.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
    setPaused(false);
  }

  function stopAll() {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setSpeaking(false);
    setPaused(false);
  }

  function togglePause() {
    if (!speaking) return;
    if (paused) {
      window.speechSynthesis.resume();
      audioRef.current?.play();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      audioRef.current?.pause();
      setPaused(true);
    }
  }

  async function playStudio() {
    setStudioBusy(true);
    try {
      const res = await fetchStudioSpeech({
        data: { text: data.script.slice(0, 1400) },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const bytes = Uint8Array.from(atob(res.audioBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: res.mime });
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      window.speechSynthesis?.cancel();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeaking(false);
        setPaused(false);
      };
      await audio.play();
      setSpeaking(true);
      setPaused(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Studio voice failed.");
    } finally {
      setStudioBusy(false);
    }
  }

  return (
    <article>
      <h2 className="font-serif text-2xl tracking-tight">{data.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{data.durationHint}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={playBrowser} className="pr-3.5">
          <Play className="size-4" />
          Play script
        </Button>
        <Button variant="outline" onClick={togglePause} disabled={!speaking}>
          <Pause className="size-4" />
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button variant="ghost" onClick={stopAll} disabled={!speaking}>
          <Square className="size-4" />
          Stop
        </Button>
        <Button variant="outline" onClick={() => void playStudio()} disabled={studioBusy}>
          {studioBusy && <Loader2 className="size-4 animate-spin" />}
          Studio voice
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        {data.beats.length
          ? data.beats.map((b, i) => (
              <section key={`${b.heading}-${i}`}>
                <h3 className="font-serif text-lg">{b.heading}</h3>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                  {b.narration}
                </p>
              </section>
            ))
          : (
            <p className="source-prose whitespace-pre-wrap">{data.script}</p>
          )}
      </div>
    </article>
  );
}

export function OverviewsView() {
  const sources = useLiveQuery(
    () => getDb().sources.orderBy("createdAt").reverse().toArray(),
    [],
  );
  const prefs = useLiveQuery(() => getDb().preferences.get("main"), []);
  const history = useLiveQuery(
    () => getDb().overviews.orderBy("createdAt").reverse().toArray(),
    [],
  );
  const studyMode = useMannaUI((s) => s.studyMode);
  const setStudyMode = useMannaUI((s) => s.setStudyMode);
  const sourceA = useMannaUI((s) => s.sourceA);
  const sourceB = useMannaUI((s) => s.sourceB);
  const extraSourceIds = useMannaUI((s) => s.extraSourceIds);
  const focusQuestion = useMannaUI((s) => s.focusQuestion);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState<"map" | "audio" | null>(null);
  const [map, setMap] = useState<MindMapData | null>(null);
  const [audio, setAudio] = useState<AudioOverviewData | null>(null);
  const [length, setLength] = useState<"short" | "standard">("short");

  const list = sources ?? [];

  useEffect(() => {
    if (picked.length === 0) {
      const seed = [sourceA, sourceB, ...extraSourceIds].filter(
        (id): id is string => Boolean(id),
      );
      if (seed.length) setPicked([...new Set(seed)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceA, sourceB]);

  const selected = useMemo(
    () => (picked.length ? picked : list.slice(0, 2).map((s) => s.id)),
    [picked, list],
  );

  function toggle(id: string) {
    setPicked((cur) => {
      const base = cur.length ? cur : selected;
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    });
  }

  async function persist(
    type: OverviewRecord["type"],
    title: string,
    payload: MindMapData | AudioOverviewData,
  ) {
    if (!prefs) return;
    await getDb().overviews.put({
      id: uid(),
      type,
      sourceIds: selected,
      mode: studyMode,
      lens: prefs.activeLens,
      title,
      payload,
      createdAt: Date.now(),
    });
  }

  async function runMap() {
    if (!prefs) return;
    if (selected.length < 1) {
      toast.error("Select at least one source.");
      return;
    }
    setBusy("map");
    try {
      const payloads = await toPayloads(selected);
      const res = await fetchMindMapData({
        data: {
          ...aiOptsFromPrefs(prefs),
          sources: payloads,
          activeLens: prefs.activeLens,
          mode: studyMode,
          focusQuestion: focusQuestion || undefined,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setMap(res.data);
      await persist("mindmap", res.data.topic, res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mind map failed.");
    } finally {
      setBusy(null);
    }
  }

  async function runAudio() {
    if (!prefs) return;
    if (selected.length < 1) {
      toast.error("Select at least one source.");
      return;
    }
    setBusy("audio");
    try {
      const payloads = await toPayloads(selected);
      const res = await fetchAudioOverviewScript({
        data: {
          ...aiOptsFromPrefs(prefs),
          sources: payloads,
          activeLens: prefs.activeLens,
          mode: studyMode,
          length,
          focusQuestion: focusQuestion || undefined,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setAudio(res.data);
      await persist("audio", res.data.title, res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Overview failed.");
    } finally {
      setBusy(null);
    }
  }

  if (list.length < 1) {
    return (
      <div className="rounded-xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]">
        <p className="font-serif text-2xl">Nothing to map yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Add sources in the Vault first. Overviews are built from the texts you hold.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Overviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Concept graphs and spoken scripts that keep traditions distinct.
        </p>
      </div>

      <div className="grid gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4">
        {STUDY_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setStudyMode(m.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              studyMode === m.id
                ? "bg-card font-medium shadow-[var(--shadow-border)]"
                : "text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground">
          Sources in this overview
        </p>
        <SourceMulti sources={list} selected={selected} onToggle={toggle} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void runMap()} disabled={busy !== null}>
          {busy === "map" && <Loader2 className="size-4 animate-spin" />}
          Generate mind map
        </Button>
        <div className="flex rounded-md bg-muted p-0.5">
          {(["short", "standard"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLength(id)}
              className={cn(
                "h-9 rounded px-3 text-xs capitalize",
                length === id ? "bg-card text-foreground" : "text-muted-foreground",
              )}
            >
              {id}
            </button>
          ))}
        </div>
        <Button variant="outline" onClick={() => void runAudio()} disabled={busy !== null}>
          {busy === "audio" && <Loader2 className="size-4 animate-spin" />}
          Audio-style overview
        </Button>
      </div>

      {map && (
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <MindMapView data={map} />
        </section>
      )}

      {audio && (
        <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <AudioPlayer data={audio} />
        </section>
      )}

      {history && history.length > 0 && (
        <section>
          <h2 className="font-serif text-xl">History</h2>
          <ul className="mt-3 space-y-2">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (h.type === "mindmap") {
                      setMap(h.payload as MindMapData);
                    } else {
                      setAudio(h.payload as AudioOverviewData);
                    }
                  }}
                  className="w-full rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-border)]"
                >
                  <p className="font-medium">{h.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {h.type === "mindmap" ? "Mind map" : "Audio overview"} · {h.mode} ·{" "}
                    {formatDate(h.createdAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
