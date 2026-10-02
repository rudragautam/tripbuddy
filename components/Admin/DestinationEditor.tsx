"use client";

import { startTransition, useActionState, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { saveDestination, type SaveDestinationState } from "@/app/admin/actions/destinations";
import { MONTHS } from "@/lib/site";
import { themes } from "@/lib/themes";
import { EXPERIENCE_ICONS, MAX_DAYS, MIN_DAYS, TOUR_TYPES, type DayPlan, type Destination, type Stop } from "@/lib/types";
import { buttonClass, ghostButtonClass, inputClass } from "./ui";

export type DestinationForm = Omit<Destination, "featured" | "published"> & { featured: boolean; published: boolean };
type Form = DestinationForm;

function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`grid content-start gap-1.5 text-sm font-medium ${className}`}>
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs font-normal text-t-muted">{hint}</span>}
    </label>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-t-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-8 place-items-center rounded-full border border-black/10 bg-white text-t-muted hover:text-t-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const blankStop: Stop = { name: "", lat: 0, lng: 0 };
const blankDay: DayPlan = { title: "", morning: "", afternoon: "", evening: "", stay: "", tip: "", stops: [blankStop] };

export default function DestinationEditor({ id, initial }: { id?: number; initial: Form }) {
  const [form, setForm] = useState<Form>(initial);
  const [initialJson] = useState(() => JSON.stringify(initial));
  const [state, action, pending] = useActionState<SaveDestinationState, FormData>(saveDestination, {});
  // Dispatch manually: a plain <form action> would reset the fields after saving, so they would
  // show stale defaults (e.g. the first option of a select) even though the data is saved.
  function submitWithoutReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }
  const payload = JSON.stringify(form);
  // Unsaved = differs from what the server last accepted (or from the loaded version).
  const dirty = payload !== (state.savedPayload ?? initialJson);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(patch: Partial<Form>) {
    setForm((f) => ({ ...f, ...patch }));
  }
  function updateDay(i: number, patch: Partial<DayPlan>) {
    update({ days: form.days.map((d, j) => (j === i ? { ...d, ...patch } : d)) });
  }
  function updateStop(di: number, si: number, patch: Partial<Stop>) {
    updateDay(di, { stops: form.days[di].stops.map((s, j) => (j === si ? { ...s, ...patch } : s)) });
  }

  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <form onSubmit={submitWithoutReset} className="grid gap-6 pb-24">
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="payload" value={payload} />

      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Name">
            <input value={form.name} onChange={(e) => update({ name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="URL slug" hint="Lowercase and hyphens, e.g. leh-ladakh. Changing it changes the page address.">
            <input
              value={form.slug}
              onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              className={inputClass}
            />
          </Field>
          <Field label="State">
            <input value={form.state} onChange={(e) => update({ state: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Tagline" hint="2–5 words, shown under the name.">
            <input value={form.tagline} onChange={(e) => update({ tagline: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Trip type (sets the design theme)">
            <select
              value={form.tourType}
              onChange={(e) => update({ tourType: e.target.value as Form["tourType"] })}
              className={inputClass}
            >
              {TOUR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {themes[t].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Last checked" hint="Update whenever you verify the plan.">
            <input
              type="date"
              value={form.lastChecked}
              onChange={(e) => update({ lastChecked: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Summary" hint="One sentence for cards and search results." className="sm:col-span-2 lg:col-span-3">
            <textarea rows={2} value={form.summary} onChange={(e) => update({ summary: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Map centre latitude">
            <input type="number" step="any" value={form.lat || ""} onChange={(e) => update({ lat: num(e.target.value) })} className={inputClass} />
          </Field>
          <Field label="Map centre longitude" hint="In Google Maps, right-click a spot to copy its coordinates.">
            <input type="number" step="any" value={form.lng || ""} onChange={(e) => update({ lng: num(e.target.value) })} className={inputClass} />
          </Field>
          <Field label="3D scene image (optional)" hint="/scenes/name.png or https:// URL. Empty uses the illustrated scene.">
            <input value={form.sceneImage ?? ""} onChange={(e) => update({ sceneImage: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm font-medium">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => update({ published: e.target.checked })} className="size-4" />
            Published (visible on the site)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => update({ featured: e.target.checked })} className="size-4" />
            Featured on the home page
          </label>
        </div>
      </Section>

      <Section
        title="Hero photo"
        description="Shown on the 3D slab, cards and when the page is shared. Use photos you have the right to use and always credit them."
      >
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/5">
            {form.heroImage?.src ? (
              // eslint-disable-next-line @next/next/no-img-element -- preview of an arbitrary admin-entered URL
              <img src={form.heroImage.src} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <span className="absolute inset-0 grid place-items-center text-xs text-t-muted">No photo</span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["src", "Image URL", "/images/places/… or https://…"],
                ["alt", "Description (alt text)", "What the photo shows"],
                ["author", "Photographer / credit", "Name as the licence requires"],
                ["license", "Licence", "CC BY-SA 4.0, own photo…"],
                ["sourceUrl", "Source page", "https://commons.wikimedia.org/…"],
                ["licenseUrl", "Licence URL (optional)", "https://creativecommons.org/…"],
              ] as const
            ).map(([key, label, placeholder]) => (
              <Field key={key} label={label}>
                <input
                  value={form.heroImage?.[key] ?? ""}
                  placeholder={placeholder}
                  onChange={(e) => {
                    const base = form.heroImage ?? { src: "", alt: form.name, width: 1280, height: 960, author: "", license: "" };
                    const next = { ...base, [key]: e.target.value };
                    update({ heroImage: next.src ? next : undefined });
                  }}
                  className={inputClass}
                />
              </Field>
            ))}
          </div>
        </div>
      </Section>

      <Section title="When to go and practical info">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Best time (text)" hint='e.g. "Oct – Mar"'>
            <input
              value={form.bestTime.months}
              onChange={(e) => update({ bestTime: { ...form.bestTime, months: e.target.value } })}
              className={inputClass}
            />
          </Field>
          <Field label="Best time note">
            <input
              value={form.bestTime.note}
              onChange={(e) => update({ bestTime: { ...form.bestTime, note: e.target.value } })}
              className={inputClass}
            />
          </Field>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-medium">Good months (used by the “where to go in…” filter)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MONTHS.map((m, i) => {
              const month = i + 1;
              const on = form.bestMonths.includes(month);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    update({ bestMonths: on ? form.bestMonths.filter((x) => x !== month) : [...form.bestMonths, month] })
                  }
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${on ? "bg-t-accent text-t-accent-ink" : "border border-black/10 bg-white"}`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Budget per day (budget)">
            <input
              value={form.budgetPerDay.budget}
              placeholder="₹1,500–2,500"
              onChange={(e) => update({ budgetPerDay: { ...form.budgetPerDay, budget: e.target.value } })}
              className={inputClass}
            />
          </Field>
          <Field label="Mid">
            <input
              value={form.budgetPerDay.mid}
              placeholder="₹3,500–6,000"
              onChange={(e) => update({ budgetPerDay: { ...form.budgetPerDay, mid: e.target.value } })}
              className={inputClass}
            />
          </Field>
          <Field label="Premium">
            <input
              value={form.budgetPerDay.premium}
              placeholder="₹10,000+"
              onChange={(e) => update({ budgetPerDay: { ...form.budgetPerDay, premium: e.target.value } })}
              className={inputClass}
            />
          </Field>
          <Field label="How to reach" className="sm:col-span-3">
            <textarea rows={2} value={form.howToReach} onChange={(e) => update({ howToReach: e.target.value })} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Quick facts" description="Up to 4, shown in the facts bar.">
        <div className="grid gap-3 sm:grid-cols-2">
          {form.facts.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                aria-label={`Fact ${i + 1} label`}
                value={f.label}
                placeholder="Label"
                onChange={(e) => update({ facts: form.facts.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                className={inputClass}
              />
              <input
                aria-label={`Fact ${i + 1} value`}
                value={f.value}
                placeholder="Value"
                onChange={(e) => update({ facts: form.facts.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
                className={inputClass}
              />
              <IconButton label="Remove fact" onClick={() => update({ facts: form.facts.filter((_, j) => j !== i) })}>
                <Trash2 className="size-4" />
              </IconButton>
            </div>
          ))}
        </div>
        {form.facts.length < 4 && (
          <button type="button" onClick={() => update({ facts: [...form.facts, { label: "", value: "" }] })} className={`${ghostButtonClass} mt-3`}>
            <Plus className="size-4" /> Add fact
          </button>
        )}
      </Section>

      <Section title="Top experiences">
        <div className="grid gap-3">
          {form.experiences.map((x, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <input
                aria-label="Experience name"
                value={x.name}
                placeholder="Name"
                onChange={(e) => update({ experiences: form.experiences.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) })}
                className={inputClass}
              />
              <input
                aria-label="Duration"
                value={x.duration}
                placeholder="2–3 hrs"
                onChange={(e) => update({ experiences: form.experiences.map((y, j) => (j === i ? { ...y, duration: e.target.value } : y)) })}
                className={inputClass}
              />
              <select
                aria-label="Icon"
                value={x.icon}
                onChange={(e) =>
                  update({
                    experiences: form.experiences.map((y, j) =>
                      j === i ? { ...y, icon: e.target.value as (typeof EXPERIENCE_ICONS)[number] } : y,
                    ),
                  })
                }
                className={inputClass}
              >
                {EXPERIENCE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
              <IconButton label="Remove experience" onClick={() => update({ experiences: form.experiences.filter((_, j) => j !== i) })}>
                <Trash2 className="size-4" />
              </IconButton>
            </div>
          ))}
        </div>
        {form.experiences.length < 6 && (
          <button
            type="button"
            onClick={() => update({ experiences: [...form.experiences, { name: "", duration: "", icon: "camera" }] })}
            className={`${ghostButtonClass} mt-3`}
          >
            <Plus className="size-4" /> Add experience
          </button>
        )}
      </Section>

      <Section
        title="Day-by-day plan"
        description={`Order matters: an N-day trip shows the first N days. Write ${MIN_DAYS}–${MAX_DAYS} days.`}
      >
        <Field label="Shortest trip offered (days)" className="mb-4 max-w-xs">
          <select value={form.minDays} onChange={(e) => update({ minDays: Number(e.target.value) })} className={inputClass}>
            {Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i).map((n) => (
              <option key={n} value={n}>
                {n} days
              </option>
            ))}
          </select>
        </Field>

        <ol className="grid gap-4">
          {form.days.map((day, di) => (
            <li key={di} className="rounded-xl border border-black/10 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-t-accent">Day {di + 1}</p>
                <div className="flex gap-1">
                  <IconButton label="Move day up" disabled={di === 0} onClick={() => update({ days: move(form.days, di, di - 1) })}>
                    <ArrowUp className="size-4" />
                  </IconButton>
                  <IconButton
                    label="Move day down"
                    disabled={di === form.days.length - 1}
                    onClick={() => update({ days: move(form.days, di, di + 1) })}
                  >
                    <ArrowDown className="size-4" />
                  </IconButton>
                  <IconButton
                    label="Remove day"
                    disabled={form.days.length <= MIN_DAYS}
                    onClick={() => update({ days: form.days.filter((_, j) => j !== di) })}
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title">
                  <input value={day.title} onChange={(e) => updateDay(di, { title: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Stay">
                  <input value={day.stay} onChange={(e) => updateDay(di, { stay: e.target.value })} className={inputClass} />
                </Field>
                {(["morning", "afternoon", "evening"] as const).map((part) => (
                  <Field key={part} label={part[0].toUpperCase() + part.slice(1)} className="sm:col-span-2">
                    <textarea rows={2} value={day[part]} onChange={(e) => updateDay(di, { [part]: e.target.value })} className={inputClass} />
                  </Field>
                ))}
                <Field label="Tip (optional)" className="sm:col-span-2">
                  <input value={day.tip ?? ""} onChange={(e) => updateDay(di, { tip: e.target.value })} className={inputClass} />
                </Field>
              </div>

              <fieldset className="mt-3">
                <legend className="text-sm font-medium">Stops on the map</legend>
                <div className="mt-2 grid gap-2">
                  {day.stops.map((s, si) => (
                    <div key={si} className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
                      <input
                        aria-label="Stop name"
                        value={s.name}
                        placeholder="Stop name"
                        onChange={(e) => updateStop(di, si, { name: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        aria-label="Latitude"
                        type="number"
                        step="any"
                        value={s.lat || ""}
                        placeholder="Lat"
                        onChange={(e) => updateStop(di, si, { lat: num(e.target.value) })}
                        className={inputClass}
                      />
                      <input
                        aria-label="Longitude"
                        type="number"
                        step="any"
                        value={s.lng || ""}
                        placeholder="Lng"
                        onChange={(e) => updateStop(di, si, { lng: num(e.target.value) })}
                        className={inputClass}
                      />
                      <IconButton
                        label="Remove stop"
                        disabled={day.stops.length <= 1}
                        onClick={() => updateDay(di, { stops: day.stops.filter((_, j) => j !== si) })}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  ))}
                </div>
                {day.stops.length < 6 && (
                  <button type="button" onClick={() => updateDay(di, { stops: [...day.stops, blankStop] })} className="mt-2 text-sm font-semibold text-t-accent">
                    + Add stop
                  </button>
                )}
              </fieldset>
            </li>
          ))}
        </ol>
        {form.days.length < MAX_DAYS && (
          <button type="button" onClick={() => update({ days: [...form.days, blankDay] })} className={`${ghostButtonClass} mt-4`}>
            <Plus className="size-4" /> Add day {form.days.length + 1}
          </button>
        )}
      </Section>

      {/* sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div aria-live="polite" className="min-w-0 text-sm">
            {state.errors && state.errors.length > 0 ? (
              <details className="text-red-700">
                <summary className="cursor-pointer font-semibold">
                  {state.errors.length} {state.errors.length === 1 ? "problem" : "problems"} to fix
                </summary>
                <ul className="mt-2 max-h-40 list-disc overflow-auto pl-5">
                  {state.errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </details>
            ) : state.ok && !dirty ? (
              <span className="text-emerald-700">Saved. Changes are live{form.published ? "" : " (draft, not public)"}.</span>
            ) : dirty ? (
              <span className="text-t-muted">Unsaved changes</span>
            ) : null}
          </div>
          <button type="submit" disabled={pending} className={buttonClass}>
            {pending ? "Saving…" : id ? "Save changes" : "Create destination"}
          </button>
        </div>
      </div>
    </form>
  );
}
