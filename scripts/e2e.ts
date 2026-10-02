/**
 * End-to-end smoke test against a running server.
 *   BASE_URL=http://localhost:3000 ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run test:e2e
 * Uses an installed Chrome/Edge (E2E_BROWSER=path, or the "msedge"/"chrome" channel).
 * Writes screenshots to E2E_SHOTS (default .e2e-shots/).
 */
import "./env";
import { mkdirSync } from "node:fs";
import { chromium, type Browser, type Page } from "playwright-core";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const SHOTS = process.env.E2E_SHOTS ?? ".e2e-shots";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

let failures = 0;
async function step(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures++;
    console.log(`  ✗ ${name}\n    ${(err as Error).message.split("\n")[0]}`);
  }
}
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function launch(): Promise<Browser> {
  if (process.env.E2E_BROWSER) return chromium.launch({ executablePath: process.env.E2E_BROWSER });
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel });
    } catch {
      // try next
    }
  }
  throw new Error("No browser found. Set E2E_BROWSER to a Chrome/Edge executable.");
}

async function main() {
  mkdirSync(SHOTS, { recursive: true });
  const browser = await launch();
  const page: Page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(15_000);
  const consoleErrors: string[] = [];
  page.on("pageerror", (e) => consoleErrors.push(e.message));

  console.log(`E2E against ${BASE}`);

  await step("home renders with hero and trip types", async () => {
    const res = await page.goto(`${BASE}/`);
    assert(res?.status() === 200, `status ${res?.status()}`);
    await page.getByRole("heading", { name: /planned free/i }).waitFor();
    await page.getByRole("heading", { name: "Browse by trip type" }).waitFor();
    await page.screenshot({ path: `${SHOTS}/home.png`, fullPage: true });
  });

  await step("hero picker opens the chosen plan", async () => {
    await page.getByRole("button", { name: "Desert" }).click();
    await page.getByRole("button", { name: /get my free plan/i }).click();
    await page.waitForURL(/\/destinations\/[a-z-]+\?days=\d/);
    await page.getByRole("heading", { name: /itinerary/i }).waitFor();
  });

  await step("destination page: day switch updates plan and URL", async () => {
    await page.goto(`${BASE}/destinations/darjeeling?days=3`);
    await page.getByRole("heading", { name: "3-day Darjeeling itinerary" }).waitFor();
    await page.getByRole("radio", { name: "5D" }).click();
    await page.getByRole("heading", { name: "5-day Darjeeling itinerary" }).waitFor();
    assert(page.url().includes("days=5"), "URL did not update");
    const dayButtons = await page.locator("#plan ol > li").count();
    assert(dayButtons === 5, `expected 5 days, saw ${dayButtons}`);
    await page.screenshot({ path: `${SHOTS}/destination.png`, fullPage: true });
  });

  await step("save button persists to the Saved page", async () => {
    await page.getByRole("button", { name: "Save this trip" }).click();
    await page.goto(`${BASE}/saved`);
    await page.getByRole("link", { name: /Darjeeling/ }).first().waitFor();
  });

  await step("filters narrow the destination list", async () => {
    await page.goto(`${BASE}/destinations?type=wildlife`);
    const text = await page.locator("main").innerText();
    assert(/Ranthambore/.test(text) && !/Darjeeling/.test(text), "wildlife filter wrong");
  });

  await step("unknown destination returns 404", async () => {
    const res = await page.goto(`${BASE}/destinations/atlantis`);
    assert(res?.status() === 404, `status ${res?.status()}`);
  });

  await step("print page renders", async () => {
    const res = await page.goto(`${BASE}/destinations/goa/print?days=2`);
    assert(res?.status() === 200, `status ${res?.status()}`);
    await page.getByRole("heading", { name: "2-day Goa itinerary" }).waitFor();
  });

  const uniqueName = `E2E Tester ${Date.now().toString().slice(-6)}`;
  await step("enquiry: validation errors then success", async () => {
    await page.goto(`${BASE}/enquire?place=goa&days=4`);
    await page.getByLabel("Your name *").fill(uniqueName);
    await page.getByLabel("Phone / WhatsApp *").fill("+91 98765 43210");
    await page.getByRole("button", { name: "Send enquiry" }).click(); // no consent yet
    await page.getByText("Please check the highlighted fields.").waitFor();
    const kept = await page.getByLabel("Your name *").inputValue();
    assert(kept === uniqueName, `typed name was lost after a validation error (got "${kept}")`);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await page.getByRole("heading", { name: /Thanks, E2E/ }).waitFor();
  });

  await step("admin requires sign-in", async () => {
    await page.goto(`${BASE}/admin/enquiries`);
    await page.waitForURL(/\/admin\/login/);
  });

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("  - admin steps skipped (set ADMIN_EMAIL and ADMIN_PASSWORD)");
  } else {
    await step("wrong password is rejected", async () => {
      await page.getByLabel("Email").fill(ADMIN_EMAIL);
      await page.getByLabel("Password").fill("definitely-wrong-password");
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.getByText("Email or password is incorrect.").waitFor();
      assert((await page.getByLabel("Email").inputValue()) === ADMIN_EMAIL, "email was cleared after a failed sign-in");
    });

    await step("sign in and see the enquiry", async () => {
      await page.getByLabel("Password").fill(ADMIN_PASSWORD);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForURL(/\/admin\/enquiries/);
      await page.getByRole("link", { name: uniqueName }).click();
      await page.getByRole("heading", { name: uniqueName }).waitFor();
      await page.getByLabel("Status").selectOption("contacted");
      await page.getByRole("button", { name: "Save" }).click();
      await page.getByText("Saved", { exact: true }).waitFor();
      await page.screenshot({ path: `${SHOTS}/admin-enquiry.png`, fullPage: true });
    });

    await step("CSV export downloads", async () => {
      const res = await page.request.get(`${BASE}/admin/export/enquiries`);
      assert(res.status() === 200, `status ${res.status()}`);
      assert((await res.text()).includes(uniqueName), "enquiry missing from CSV");
    });

    await step("editing a destination updates the public page", async () => {
      await page.goto(`${BASE}/admin/destinations`);
      await page.getByRole("link", { name: "Goa", exact: true }).click();
      const tagline = page.getByLabel("Tagline");
      const original = await tagline.inputValue();
      await tagline.fill("E2E tagline check");
      await page.getByRole("button", { name: "Save changes" }).click();
      await page.getByText(/Saved\. Changes are live/).waitFor();
      const shownType = await page.getByLabel("Trip type (sets the design theme)").inputValue();
      assert(shownType === "beach", `editor shows trip type "${shownType}" after saving, expected "beach"`);
      await page.screenshot({ path: `${SHOTS}/admin-editor.png`, fullPage: false });

      const pub = await browser.newPage();
      await pub.goto(`${BASE}/destinations/goa`);
      await pub.getByText("E2E tagline check").first().waitFor();
      await pub.close();

      await tagline.fill(original);
      await page.getByRole("button", { name: "Save changes" }).click();
      await page.getByText(/Saved\. Changes are live/).waitFor();
    });

    await step("unpublish hides the page, republish restores it", async () => {
      await page.goto(`${BASE}/admin/destinations`);
      const row = page.locator("tr", { hasText: "Gokarna" });
      await row.getByRole("button", { name: "Unpublish" }).click();
      await row.getByRole("button", { name: "Publish" }).waitFor();
      let res = await page.request.get(`${BASE}/destinations/gokarna`);
      assert(res.status() === 404, `expected 404 after unpublish, got ${res.status()}`);
      await row.getByRole("button", { name: "Publish" }).click();
      await row.getByRole("button", { name: "Unpublish" }).waitFor();
      res = await page.request.get(`${BASE}/destinations/gokarna`);
      assert(res.status() === 200, `expected 200 after publish, got ${res.status()}`);
    });

    await step("sign out", async () => {
      await page.goto(`${BASE}/admin`);
      await page.getByRole("button", { name: "Sign out" }).click();
      await page.waitForURL(/\/admin\/login/);
    });
  }

  await step("mobile layout has no horizontal scroll", async () => {
    const mobile = await browser.newPage({ viewport: { width: 375, height: 800 } });
    for (const path of ["/", "/destinations/leh-ladakh", "/destinations", "/enquire"]) {
      await mobile.goto(`${BASE}${path}`);
      const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(overflow <= 1, `${path} overflows by ${overflow}px`);
    }
    await mobile.goto(`${BASE}/destinations/leh-ladakh`);
    await mobile.waitForTimeout(1200); // let the entrance animations finish
    await mobile.screenshot({ path: `${SHOTS}/mobile-destination.png`, fullPage: true });
    await mobile.close();
  });

  await step("no uncaught page errors", async () => {
    assert(consoleErrors.length === 0, consoleErrors.join(" | "));
  });

  await browser.close();
  console.log(failures ? `\n${failures} step(s) failed` : "\nAll steps passed");
  process.exit(failures ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
