/** Contact sheet of every hero photo, for a quick visual check:  npm run images:review -- sheet.png */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const out = process.argv[2];
const imgs = JSON.parse(readFileSync("lib/seed/images.json", "utf8")) as Record<string, { hero?: { src: string; alt: string } }>;
const cells = Object.entries(imgs)
  .map(([slug, v]) => {
    const src = v.hero ? pathToFileURL(resolve("public" + v.hero.src)).href : "";
    return `<figure><img src="${src}"><figcaption>${slug}: ${v.hero?.alt ?? "NONE"}</figcaption></figure>`;
  })
  .join("");
const html = `<html><body style="margin:0;font:13px sans-serif;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding:6px">${cells}<style>img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}figure{margin:0}</style></body></html>`;
const htmlPath = resolve(out.replace(/\.png$/, ".html"));
writeFileSync(htmlPath, html);

(async () => {
  const b = await chromium.launch({ channel: "msedge", args: ["--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
  await p.goto(pathToFileURL(htmlPath).href);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
