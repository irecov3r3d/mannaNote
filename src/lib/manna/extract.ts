function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/"/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

export function stripMarkup(html: string): string {
  const without = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(without)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url"))
    .default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  const limit = Math.min(doc.numPages, 80);
  for (let i = 1; i <= limit; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(line);
  }
  if (doc.numPages > 80) {
    pages.push(
      `\n\n[Truncated: ${doc.numPages - 80} further pages were not imported.]`,
    );
  }
  return pages.join("\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

async function extractEpub(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const container = await zip.file("META-INF/container.xml")?.async("string");
  if (!container) {
    const htmlFiles = Object.keys(zip.files).filter((n) =>
      /\.(x?html|htm|xml)$/i.test(n),
    );
    const parts: string[] = [];
    for (const name of htmlFiles.slice(0, 40)) {
      const xml = await zip.file(name)?.async("string");
      if (xml) parts.push(stripMarkup(xml));
    }
    return parts.filter(Boolean).join("\n\n");
  }
  const opfHref =
    container.match(/full-path="([^"]+)"/)?.[1] ??
    container.match(/full-path='([^']+)'/)?.[1];
  if (!opfHref) throw new Error("EPUB container has no package document.");
  const opfDir = opfHref.includes("/")
    ? opfHref.slice(0, opfHref.lastIndexOf("/") + 1)
    : "";
  const opf = await zip.file(opfHref)?.async("string");
  if (!opf) throw new Error("Could not read the EPUB package document.");

  const manifest = new Map<string, string>();
  const itemRe =
    /<item\b[^>]*id="([^"]+)"[^>]*href="([^"]+)"[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(opf))) {
    manifest.set(m[1], m[2]);
  }
  const hrefIdRe =
    /<item\b[^>]*href="([^"]+)"[^>]*id="([^"]+)"[^>]*>/gi;
  while ((m = hrefIdRe.exec(opf))) {
    if (!manifest.has(m[2])) manifest.set(m[2], m[1]);
  }

  const spineIds: string[] = [];
  const spineRe = /<itemref\b[^>]*idref="([^"]+)"[^>]*>/gi;
  while ((m = spineRe.exec(opf))) spineIds.push(m[1]);

  const parts: string[] = [];
  for (const id of spineIds.slice(0, 50)) {
    const href = manifest.get(id);
    if (!href) continue;
    const path = `${opfDir}${href}`.replace(/\/{2,}/g, "/");
    const xml = await zip.file(path)?.async("string");
    if (xml) {
      const text = stripMarkup(xml);
      if (text) parts.push(text);
    }
  }
  return parts.join("\n\n").trim();
}

export type ExtractedDoc = {
  title: string;
  text: string;
  mime: string;
  filename: string;
};

export async function extractFromFile(file: File): Promise<ExtractedDoc> {
  const filename = file.name;
  const title = filename.replace(/\.[^.]+$/, "") || "Untitled source";
  const mime = file.type || "application/octet-stream";
  const lower = filename.toLowerCase();

  if (lower.endsWith(".pdf") || mime.includes("pdf")) {
    const text = await extractPdf(file);
    if (!text) throw new Error("No extractable text in this PDF.");
    return { title, text, mime: "application/pdf", filename };
  }
  if (lower.endsWith(".epub") || mime.includes("epub")) {
    const text = await extractEpub(file);
    if (!text) throw new Error("No extractable text in this EPUB.");
    return { title, text, mime: "application/epub+zip", filename };
  }

  const raw = await file.text();
  const text =
    lower.endsWith(".html") || lower.endsWith(".htm") || mime.includes("html")
      ? stripMarkup(raw)
      : raw.replace(/\u0000/g, "").trim();
  if (!text) throw new Error("That file appears to be empty.");
  return { title, text, mime, filename };
}

export function titleFromText(text: string, fallback = "Untitled source"): string {
  const line = text
    .split(/\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 2 && l.length < 90);
  return line || fallback;
}
