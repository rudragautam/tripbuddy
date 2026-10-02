/**
 * Downloads real, freely licensed photos from Wikimedia Commons for every seed destination:
 *   - one landscape hero photo per destination (from a curated list of landmark articles)
 *   - one photo per named stop, when Wikipedia has a matching article with a Commons image
 * Files go to public/images/places/<slug>/, attribution to lib/seed/images.json (committed).
 *
 *   npm run images:fetch                 fetch what's missing
 *   npm run images:fetch -- --refresh    re-fetch everything
 *   npm run images:fetch -- jaipur goa   only these destinations
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { seedContent as seedDestinations } from "../lib/seed";
import type { Photo } from "../lib/types";

const UA = "TripBuddyImageFetcher/1.0 (https://github.com/; travel itinerary site; image attribution kept)";
const OUT_JSON = "lib/seed/images.json";
const HERO_WIDTH = 1280;
const STOP_WIDTH = 640;

/** Landmark articles to try, best first. The first with a usable landscape Commons photo wins. */
const HERO_CANDIDATES: Record<string, string[]> = {
  darjeeling: ["search:Darjeeling tea garden Kanchenjunga", "Darjeeling Himalayan Railway", "Kangchenjunga"],
  jaisalmer: ["Jaisalmer Fort", "Thar Desert", "Jaisalmer"],
  goa: ["Palolem", "Calangute", "Basilica of Bom Jesus"],
  shimla: ["The Ridge, Shimla", "Christ Church, Shimla", "Shimla"],
  manali: ["Solang Valley", "Hidimba Devi Temple", "Manali, Himachal Pradesh"],
  "leh-ladakh": ["Thiksey Monastery", "search:Pangong lake Ladakh", "Leh Palace"],
  "spiti-valley": ["Key Monastery", "Chandra Taal", "Spiti Valley"],
  gulmarg: ["Gulmarg", "Gulmarg Gondola", "Khilanmarg"],
  auli: ["Auli, India", "Nanda Devi", "Joshimath"],
  munnar: ["search:Munnar tea plantation hills", "Munnar", "Eravikulam National Park"],
  ooty: ["Nilgiri Mountain Railway", "Ooty Lake", "Ooty"],
  alleppey: ["search:Alleppey houseboat backwaters", "search:Alappuzha houseboat", "Kerala backwaters"],
  gokarna: ["Om Beach", "Kudle Beach", "Gokarna Beach", "Gokarna, Karnataka", "Yana, Karnataka"],
  pondicherry: ["Promenade Beach", "Pondicherry", "Auroville"],
  hampi: ["Vittala Temple", "Group of Monuments at Hampi", "Virupaksha Temple, Hampi"],
  jaipur: ["Hawa Mahal", "Amer Fort", "Jaipur"],
  udaipur: ["Lake Pichola", "City Palace, Udaipur", "Udaipur"],
  varanasi: ["Ghats in Varanasi", "Dashashwamedh Ghat", "Varanasi"],
  agra: ["Taj Mahal", "Agra Fort"],
  "rann-of-kutch": ["search:White Rann Kutch salt desert", "search:Great Rann of Kutch salt", "Great Rann of Kutch"],
  ranthambore: ["Ranthambore National Park", "Ranthambore Fort"],
  gangtok: ["Tsomgo Lake", "Rumtek Monastery", "Gangtok"],
  andaman: ["Radhanagar Beach", "Swaraj Dweep", "Cellular Jail"],
  kaziranga: ["Kaziranga National Park", "Indian rhinoceros"],
  "jim-corbett": ["Jim Corbett National Park", "Ramganga River"],
  rishikesh: ["Lakshman Jhula", "Ram Jhula", "Rishikesh"],
  coorg: ["Abbey Falls", "Namdroling Monastery", "Kodagu district"],
  meghalaya: ["Living root bridge", "Nohkalikai Falls", "Umngot River"],
  nainital: ["Naini Lake", "Nainital"],
  mussoorie: ["Mussoorie", "Kempty Falls"],
  kodaikanal: ["Kodaikanal Lake", "Kodaikanal"],
  tawang: ["Tawang Monastery", "Sela Pass", "Tawang"],
  kasol: ["Parvati Valley", "Kasol", "Kheerganga"],
  amritsar: ["Golden Temple"],
  jodhpur: ["Mehrangarh", "Jodhpur"],
  mysuru: ["Mysore Palace", "Mysore"],
  khajuraho: ["Kandariya Mahadeva Temple", "Khajuraho Group of Monuments"],
  kochi: ["Chinese fishing nets", "Fort Kochi"],
  madurai: ["Meenakshi Temple", "Madurai"],
  varkala: ["Varkala Beach", "Varkala"],
  puri: ["Konark Sun Temple", "Jagannath Temple, Puri", "Puri"],
  kumarakom: ["Kumarakom", "Vembanad"],
  "munroe-island": ["Munroe Island", "Ashtamudi Lake"],
  sundarbans: ["Sundarbans National Park", "Sundarbans"],
  bandhavgarh: ["Bandhavgarh National Park"],
};

/** Stop photos rejected on visual review (archive prints, signboards, wrong subject). Format: "slug/Stop name". */
const EXCLUDED_STOPS = new Set([
  "darjeeling/Chowrasta",
  "darjeeling/Ropeway",
  "jaisalmer/Longewala",
  "jaisalmer/Bada Bagh",
  "goa/Cabo de Rama",
  "shimla/Shimla station",
  "manali/Manikaran",
  "leh-ladakh/Pangong Tso",
  "gulmarg/Khilanmarg",
  "ooty/Sim's Park, Coonoor",
  "udaipur/Eklingji",
  "varanasi/Chunar Fort",
  "kaziranga/Kohora",
  "jim-corbett/Kaladhungi",
  "nainital/Kathgodam station",
  "mysuru/Chamundi Hill",
  "kumarakom/Kumarakom",
  "sundarbans/Gosaba",
]);

type Images = Record<string, { hero?: Photo; stops: Record<string, Photo> }>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api(host: string, params: Record<string, string>) {
  const url = `https://${host}/w/api.php?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    await sleep(1000 * (attempt + 1));
  }
  throw new Error(`API failed: ${url}`);
}

function stripHtml(s: string) {
  const t = s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // Commons sometimes repeats the author (visible name + hidden vcard): keep one copy.
  const m = t.match(/^(.+?)\s*\1$/);
  return m ? m[1] : t;
}

/** Commons file info + attribution. Returns null for files not on Commons (e.g. non-free local uploads). */
async function commonsFile(fileName: string, width: number) {
  const data = await api("commons.wikimedia.org", {
    action: "query",
    titles: `File:${fileName}`,
    prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime",
    iiurlwidth: String(width),
  });
  const page = data.query?.pages?.[0];
  const info = page?.imageinfo?.[0];
  if (!info || page.missing) return null;
  if (!/^image\/(jpeg|png|webp)$/.test(info.mime)) return null;
  const meta = info.extmetadata ?? {};
  const license = stripHtml(meta.LicenseShortName?.value ?? "");
  if (!license || /fair use|non-free/i.test(license)) return null;
  return {
    thumb: info.thumburl as string,
    width: info.width as number,
    height: info.height as number,
    author: stripHtml(meta.Artist?.value ?? "Unknown").slice(0, 120) || "Unknown",
    license,
    licenseUrl: meta.LicenseUrl?.value as string | undefined,
    sourceUrl: info.descriptionurl as string,
  };
}

/** Lead image file name of a Wikipedia article. */
async function leadImage(title: string): Promise<{ title: string; file: string } | null> {
  const data = await api("en.wikipedia.org", {
    action: "query",
    titles: title,
    prop: "pageimages",
    piprop: "name",
    redirects: "1",
  });
  const page = data.query?.pages?.[0];
  return page?.pageimage ? { title: page.title, file: page.pageimage } : null;
}

/** Best-matching article for a stop name, accepted only when the titles clearly agree. */
async function articleForStop(stop: string, place: string, state: string) {
  const data = await api("en.wikipedia.org", {
    action: "query",
    list: "search",
    srsearch: `${stop} ${place} ${state}`,
    srlimit: "3",
  });
  const generic = new Set(["the", "of", "and", "a", "road", "market", "beach", "lake", "temple", "fort", "village", "view", "point", "camp", "town"]);
  const words = stop
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !generic.has(w));
  if (words.length === 0) return null;
  for (const hit of data.query?.search ?? []) {
    const t = String(hit.title).toLowerCase();
    if (words.every((w) => t.includes(w))) return String(hit.title);
  }
  return null;
}

/** Downloads and re-encodes as a compact progressive JPEG (next/image resizes further per device). */
async function download(url: string, path: string) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
    .rotate()
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toBuffer();
  writeFileSync(path, jpeg);
}

const fileSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

async function main() {
  const args = process.argv.slice(2);
  const refresh = args.includes("--refresh");
  const only = new Set(args.filter((a) => !a.startsWith("--")));
  const images: Images = existsSync(OUT_JSON) ? JSON.parse(readFileSync(OUT_JSON, "utf8")) : {};

  for (const d of seedDestinations) {
    if (only.size && !only.has(d.slug)) continue;
    const entry = (images[d.slug] ??= { stops: {} });
    const dir = `public/images/places/${d.slug}`;
    mkdirSync(dir, { recursive: true });

    if (refresh || !entry.hero) {
      entry.hero = undefined;
      // Wikipedia lead images first; then a direct Commons file search as a fallback.
      const leads: { title: string; file: string }[] = [];
      for (const title of HERO_CANDIDATES[d.slug] ?? [d.name]) {
        // "search:<terms>" = pick from a Commons file search instead of an article's lead image.
        if (title.startsWith("search:")) {
          const found = await api("commons.wikimedia.org", {
            action: "query",
            list: "search",
            srnamespace: "6",
            srsearch: `${title.slice(7)} filetype:bitmap`,
            srlimit: "10",
          });
          for (const hit of found.query?.search ?? []) {
            leads.push({ title: d.name, file: String(hit.title).replace(/^File:/, "") });
          }
          continue;
        }
        const lead = await leadImage(title);
        if (lead) leads.push(lead);
      }
      const search = await api("commons.wikimedia.org", {
        action: "query",
        list: "search",
        srnamespace: "6",
        srsearch: `${HERO_CANDIDATES[d.slug]?.[0] ?? d.name} ${d.state} filetype:bitmap`,
        srlimit: "8",
      });
      for (const hit of search.query?.search ?? []) {
        leads.push({ title: HERO_CANDIDATES[d.slug]?.[0] ?? d.name, file: String(hit.title).replace(/^File:/, "") });
      }
      for (const lead of leads) {
        const file = await commonsFile(lead.file, HERO_WIDTH);
        if (!file || file.width / file.height < 1.2 || file.width < 1000) continue; // landscape, big enough
        const path = `${dir}/hero.jpg`;
        await download(file.thumb, path);
        const scale = Math.min(1, HERO_WIDTH / file.width);
        entry.hero = {
          src: `/images/places/${d.slug}/hero.jpg`,
          alt: lead.title,
          width: Math.round(file.width * scale),
          height: Math.round(file.height * scale),
          author: file.author,
          license: file.license,
          licenseUrl: file.licenseUrl,
          sourceUrl: file.sourceUrl,
        };
        break;
      }
      console.log(`${d.slug}: hero ${entry.hero ? `✓ ${entry.hero.alt}` : "✗ none found"}`);
    }

    const stopNames = [...new Set(d.days.flatMap((day) => day.stops.map((s) => s.name)))];
    let got = 0;
    for (const name of stopNames) {
      if (EXCLUDED_STOPS.has(`${d.slug}/${name}`)) {
        delete entry.stops[name];
        continue;
      }
      if (!refresh && entry.stops[name]) {
        got++;
        continue;
      }
      const title = await articleForStop(name, d.name, d.state);
      if (!title) continue;
      const lead = await leadImage(title);
      if (!lead) continue;
      const file = await commonsFile(lead.file, STOP_WIDTH);
      if (!file || file.width < 400) continue;
      const path = `${dir}/${fileSlug(name)}.jpg`;
      await download(file.thumb, path);
      const scale = Math.min(1, STOP_WIDTH / file.width);
      entry.stops[name] = {
        src: `/images/places/${d.slug}/${fileSlug(name)}.jpg`,
        alt: lead.title,
        width: Math.round(file.width * scale),
        height: Math.round(file.height * scale),
        author: file.author,
        license: file.license,
        licenseUrl: file.licenseUrl,
        sourceUrl: file.sourceUrl,
      };
      got++;
      await sleep(150);
    }
    console.log(`${d.slug}: ${got}/${stopNames.length} stop photos`);
    writeFileSync(OUT_JSON, JSON.stringify(images, null, 2) + "\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
