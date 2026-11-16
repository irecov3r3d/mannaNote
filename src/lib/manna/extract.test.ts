import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractFromFile, stripMarkup, titleFromText } from "./extract.ts";

describe("stripMarkup", () => {
  it("drops scripts/styles/tags and keeps paragraph breaks", () => {
    const out = stripMarkup(
      "<style>p{}</style><script>alert(1)</script><h1>Psalm 23</h1><p>The LORD is my shepherd;<br>I shall not want.</p><p>Next</p>",
    );
    assert.equal(out, "Psalm 23\n\nThe LORD is my shepherd;\nI shall not want.\n\nNext");
  });

  it("decodes named and numeric entities", () => {
    assert.equal(
      stripMarkup("<p>Faith &amp; works &lt;James 2&gt; &quot;dead&quot; &#39;alone&#39; &#8212; &#x2014;&nbsp;end</p>"),
      "Faith & works <James 2> \"dead\" 'alone' \u2014 \u2014 end",
    );
  });

  it("does not double-decode &amp;lt;", () => {
    assert.equal(stripMarkup("<p>&amp;lt;b&amp;gt;</p>"), "&lt;b&gt;");
  });

  it("ignores out-of-range numeric entities", () => {
    assert.equal(stripMarkup("<p>a&#99999999;b</p>"), "ab");
  });
});

describe("extractFromFile (text/html)", () => {
  it("reads plain text and removes NUL bytes", async () => {
    const file = new File(["Grace\u0000 upon grace\n"], "john1.txt", { type: "text/plain" });
    const doc = await extractFromFile(file);
    assert.deepEqual(doc, {
      title: "john1",
      text: "Grace upon grace",
      mime: "text/plain",
      filename: "john1.txt",
    });
  });

  it("strips HTML files", async () => {
    const file = new File(["<p>Selah &amp; amen</p>"], "note.html", { type: "text/html" });
    const doc = await extractFromFile(file);
    assert.equal(doc.text, "Selah & amen");
  });

  it("rejects empty files", async () => {
    const file = new File(["\u0000  "], "empty.txt", { type: "text/plain" });
    await assert.rejects(extractFromFile(file), /empty/);
  });
});

describe("titleFromText", () => {
  it("uses the first meaningful line or the fallback", () => {
    assert.equal(titleFromText("", "Fallback"), "Fallback");
    assert.ok(titleFromText("The Gospel of John\nIn the beginning").includes("Gospel of John"));
  });
});
