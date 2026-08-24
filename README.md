# MedLink Botswana

**One press. Critical information. Faster response.**

MedLink helps people in Botswana request emergency medical assistance while securely providing
authorised responders with the patient's location and the medical information that changes how they
are treated.

This repository is the MVP foundation: a working patient application, a working dispatcher console,
and one shared emergency state machine connecting them.

---

## ⚠️ Safety limitations — read first

This is a **product prototype**. It is not an emergency service and must never be presented as one.

- It does **not** contact any real ambulance, hospital, responder or emergency service.
- It is **not** integrated with Botswana's 997 emergency number, and no such integration is planned
  in this codebase — `EmergencyServiceIntegration` describes the *shape* such an integration would
  take, and the only implementation is a mock.
- **No SMS fallback exists.** It is a future capability. The offline banner says so explicitly
  rather than letting a patient assume there is a backup channel.
- Princess Marina Hospital and every other facility here are **demonstration data**. Nothing implies
  a commercial or technical partnership; facilities carry `connectionStatus: 'demo_only'`.
- No patient record is connected to any live healthcare system. Kagiso Molefe is a fictional person.

In a real emergency, call your local emergency services directly.

---

## Live demo

Published on GitHub Pages: **<https://dondie52.github.io/medtechbw/>**

`.github/workflows/deploy-pages.yml` builds the static export and publishes it on every push to
`main`. Publishing needs one manual, one-time step this workflow cannot do for itself: in the repo's
**Settings → Pages**, set **Source** to **GitHub Actions**. Until that is set, the workflow's build
and upload succeed but there is nowhere configured to publish to.

There is no server behind the live demo — see [Deploying to GitHub Pages](#deploying-to-github-pages)
for what that changes about the architecture.

---

## Install and run

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static production build, written to `out/` |
| `npm start` | Serve that static build locally at <http://localhost:3000> |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint via `next lint` |

No API keys are needed. The map is a self-contained mock renderer — nothing in this repository
requires a paid service to run locally, and no key may ever be committed.

No `package-lock.json` is committed. This project was scaffolded in a sandboxed environment whose
network policy blocked `registry.npmjs.org`, so a lockfile could never be generated there — `npm
install` resolves fresh instead, here and in CI. Commit a lockfile the first time you run `npm
install` somewhere with normal registry access, so builds become reproducible.

---

## Deploying to GitHub Pages

The production build target is `output: 'export'` (`next.config.mjs`) — a directory of static HTML,
CSS and JS with no server. That works cleanly here because nothing in this app needs one: every
screen is client state (the `EmergencyProvider` context) or a demo data import, there are no API
routes, and MedLink Botswana's philosophy is to keep every real integration behind an interface
(`RealtimeTransport`, `EmergencyServiceIntegration`, `RouteEstimator`, `MapProvider`) rather than
wired to a running backend.

That constraint shaped one routing decision. The dispatcher's case detail screen is
`/dispatch/emergencies/current`, not a dynamic `/dispatch/emergencies/[id]` route — a static export
has to pre-render every path at build time, but this prototype's case IDs
(`BW-ML-1028`, `BW-ML-1029`, …) increment with each new demo emergency and can't be known in
advance. The page already reads its emergency from shared session state rather than from the URL, so
dropping the dynamic segment cost nothing and removed a real "404 on the second demo run" bug.

A GitHub Pages **project site** (as opposed to a user/org site) is served from
`https://<owner>.github.io/<repo>/`, so the build needs a `/medtechbw` path prefix. That prefix is
gated behind a `GITHUB_PAGES` environment variable in `next.config.mjs`, set only by the deploy
workflow — local dev and a plain `npm run build` are never prefixed. `next/link` and the router apply
the prefix automatically everywhere in the app; no component needs to know about it.

`.github/workflows/deploy-pages.yml` builds and publishes on every push to `main` (and, for this
prototype's convenience, to `claude/medlink-botswana-mvp-au46ta`). It adds a `.nojekyll` file to the
output — GitHub Pages runs uploaded content through Jekyll by default, which silently drops the
underscore-prefixed `_next` asset folder without it.

The one thing the workflow cannot do for itself: a repository's Pages **Source** has to be set to
**GitHub Actions** once, by a repo admin, under **Settings → Pages**. Until that is set, the workflow
runs and uploads successfully but there is no configured destination to publish to.

To deploy anywhere else that can serve a static directory (Netlify, Vercel, S3, Render, your own
web server): run `npm run build`, then serve the `out/` folder. No `GITHUB_PAGES` env var, no prefix.

---

## The demo workflow

Open `/patient` and `/dispatch` **in two browser tabs**. They share one live emergency over a
`BroadcastChannel`, so acting in one is visible in the other immediately.

1. Open the patient home screen.
2. Press and hold **SOS** for two seconds (mouse, touch, or hold `Space`/`Enter`).
3. Watch the transmission screen: *Sending Emergency Alert* → *Emergency Alert Sent* →
   *Awaiting Dispatch Confirmation*.
4. The emergency appears in the dispatcher console as `BW-ML-1028`.
5. The dispatcher presses **Accept emergency**. The patient now sees *Dispatch Confirmed*.
6. **Assign response** opens the unit drawer; assign `MED-04`.
7. The patient moves to *Response Assigned* and sees the call sign and ETA.
8. **Notify facility** selects Princess Marina Hospital as the receiving facility.
9. **Update status** advances the emergency one legal step at a time: *En route* → *Arriving* →
   *On scene* → *Transporting* → *At facility* → *Completed*.
10. The patient's tracker follows every step.
11. The **Demo controls** panel (bottom right) simulates weak/offline connectivity and resets the demo.

Along the way, try: **I can't speak** on the patient's active screen (dispatch must acknowledge it
before the patient is told it landed), **Cancel emergency** (two-step confirmation), and
`/patient/activity` (which shows the patient who opened their medical information and why).

---

## Implemented screens

### Patient — mobile-first (360 / 390 / 430 px)

| Route | Screen |
| --- | --- |
| `/patient` | Home: greeting, location, SOS, quick actions |
| `/patient/emergency/transmitting` | Transmission states and connectivity |
| `/patient/emergency/active` | Active emergency tracker, map, actions |
| `/patient/medical-profile` | Full medical profile |
| `/patient/location` | What responders would receive |
| `/patient/aeds` | Nearby defibrillators |
| `/patient/activity` | Emergency history and who accessed their data |
| `/patient/settings` | Language, privacy, prototype limitations |

### Dispatcher — desktop-first (1280 / 1440 px and larger), responsive down to tablet

| Route | Screen |
| --- | --- |
| `/dispatch` | Live emergencies: navigation, operational map, case panel |
| `/dispatch/emergencies/current` | Full case with the authorised medical summary |
| `/dispatch/ambulances` | Fleet with live distance and ETA estimates |
| `/dispatch/responders` | Verified non-ambulance responders |
| `/dispatch/facilities` | Receiving facilities and their three statuses |
| `/dispatch/aed-network` | Registered defibrillators |
| `/dispatch/patients`, `/history`, `/reports`, `/settings` | Honest placeholders stating what each needs |

### Role architecture

`/crew`, `/facility`, `/responder` and `/admin` exist as prepared route shells with their
least-privilege data permissions documented. They are deliberately not built yet. **The patient
application never renders dispatcher navigation**, and vice versa.

---

## Architecture

```
src/
├── app/          Next.js App Router: one route per screen, thin
├── components/   brand · ui · emergency · patient · dispatch · map · demo
├── features/     emergency/ — the state machine, events, reducer, transport, provider
├── lib/          formatting, geo, ids, class names, i18n scaffolding
├── types/        domain models
└── data/         centralised Botswana demonstration data
```

### The emergency state machine

`src/features/emergency/states.ts` owns the lifecycle:

```
idle → holding_sos → sending → alert_received → awaiting_dispatch → dispatch_confirmed
     → assigning_response → response_assigned → ambulance_en_route → help_arriving
     → at_patient → transporting → facility_reached → completed        (or cancelled)
```

Transitions are **guarded**. `ALLOWED_TRANSITIONS` lists every legal move and the reducer drops
anything else, so no event can make the patient's screen claim a stage that has not happened. The
dispatcher's *Update status* control only ever offers the machine's next legal state.

Patient and dispatcher both derive everything they display from one `EmergencySession` object.
Neither holds its own copy of the status.

### Realtime transport

`RealtimeTransport` is the seam to a backend:

```ts
interface RealtimeTransport {
  publish(event: EmergencyEvent): void;
  subscribe(handler: (envelope: EmergencyEventEnvelope) => void): () => void;
  close(): void;
}
```

Today it is a `BroadcastChannel` between browser tabs, with a `localStorage` snapshot so a tab opened
later joins the same emergency. Replacing it with a WebSocket means writing one class — the event
payloads are already serialisable and already carry actor attribution and timestamps.

### Emergency service integration

`EmergencyServiceIntegration` (`sendEmergency`, `getStatus`) is the boundary a real dispatch or
emergency-service backend would implement. The only implementation is
`MockMedLinkDispatchService`, whose sole real job is to own **acknowledgement timing** — which is
what lets the patient screen honestly distinguish *Sending* from *Alert Sent* from *Awaiting Dispatch
Confirmation*. A dispatcher accepting a case is a human action and is never simulated.

Every implementation declares `isLiveService`, which is `false` here.

### Map

`MapProvider` is a one-component interface. The shipped `mockMapProvider` draws a schematic Gaborone
canvas in SVG with `requiresApiKey: false`. Swapping in MapLibre with OpenStreetMap tiles, or a
commercial provider, means implementing the same prop shape.

Maps are treated as **secondary to emergency transmission** throughout. A map failure is caught by an
error boundary and replaced with a panel that lists the same entities as text and says plainly:
*"This does not affect your emergency."*

### Mock data

All demonstration data lives in `src/data/` — patient profile, fleet, facilities, responders, AEDs,
dispatchers and Botswana geography. No component contains a hard-coded patient name, call sign or
hospital. Every screen showing this data carries a `DemoNotice` or `DemoBadge`.

---

## Two product rules the code enforces

### 1. Known medical history is never turned into a current emergency

This is the single most important rule in the product, and the correction the V2 designs introduced.

`Emergency.symptomsReported` is `Sourced<string> | null` and is **only** ever populated by an explicit
report event carrying a `DataSource` (`patient_reported`, `dispatcher`, `ambulance_crew`, …). Nothing
copies from the medical profile onto the emergency. Until somebody actually describes what is
happening, responders see:

> **Known medical profile** — Epilepsy, Hypertension
> **Current SOS** — Symptoms: *Not provided*

`KnownVsCurrentPanel` renders both columns together, always. The first control-centre design showed
*"Reported Condition: Seizure / Epilepsy — P1 Critical"* with invented caller notes; that is exactly
what this structure prevents.

### 2. The patient is never told something that has not happened

State copy lives in one place (`STATE_PRESENTATION`) and no string before `dispatch_confirmed` claims
a dispatcher has the emergency. The same applies to the *I can't speak* flag: raising it shows
*"Sending to dispatch"*, and only an acknowledgement from dispatch changes it to
*"Dispatch has been notified that you may be unable to speak."*

---

## Privacy architecture

- **Role-based, least-privilege access.** `ROLE_DATA_PERMISSIONS` defines what each role may read;
  `roleMayRead()` is checked in the components that render medical data, not just used to hide buttons.
- **Two distinct views of a patient.** The full `PatientMedicalProfile` is the patient's own. The
  `EmergencyMedicalSummary` a responder receives is *derived* by `toEmergencyMedicalSummary()`, which
  drops the Omang number, home address, phone and non-emergency-relevant history.
- **Access logging.** `EmergencyDataAccessLog` records emergency, organisation, user, role, the
  data categories opened, timestamp and reason. Rows are written when a dispatcher accepts an
  emergency and when they open a medical summary, and are shown back to the patient under
  `/patient/activity`.
- Authentication is mocked, but no component assumes every signed-in user may read patient data.

---

## Design system

One canonical token set in `tailwind.config.ts`, mirrored as CSS custom properties in `globals.css`.
The Stitch export shipped an identical ~50-token Material 3 palette inline on all ten screens; those
are collapsed into one source of truth.

| Token | Value | Used for |
| --- | --- | --- |
| `brand` | `#00478D` | Primary brand, everyday surfaces |
| `brand-600` | `#005EB8` | Supporting blue |
| `emergency` | `#BA1A1A` | SOS, critical states, serious warnings, allergy alerts |
| `success` | `#1B6D24` | Confirmed, available, completed, verified |
| `caution` | `#8A5A00` | Weak connectivity, awaiting confirmation, pending, warnings |
| `surface-app` | `#F9F9FF` | Calm neutral app background |
| `ink` / `ink-muted` / `ink-subtle` | `#191C20` / `#424751` / `#737782` | Text |

Typography is Inter, loaded once through `next/font`. Spacing is the 4px system; `touch` is the 48px
minimum interaction target. Radii: `control` 8px, `card` 16px, `pill` fully rounded.

**Three deliberate corrections to the export** — see `docs/design-source.md` for the full record:

1. **A caution/amber ramp was added.** The export had no amber at all, so *"Weak connection"* was
   drawn in emergency red. Red reads as failure, which is the exact misinterpretation the low-signal
   requirement exists to prevent. `#8A5A00` clears WCAG AA on both white (5.9:1) and its container (4.7:1).
2. **Navigation "active" states use brand blue, not green.** The export used green in two places and
   blue in a third. Green is reserved for confirmed/available/completed/verified.
3. **Brand primary is `#00478D`.** Stitch labelled that `primary-container` and used `#003164` for
   `primary`.

### Accessibility

Targeting WCAG AA. Semantic controls throughout; visible focus rings that never disappear (including
a white variant for red and dark surfaces); 48px minimum targets on patient controls; every colour
pair above checked to AA; no state carried by colour alone (timeline steps carry shape, colour and a
visually-hidden word); `prefers-reduced-motion` honoured; zoom never blocked.

The SOS button works with mouse, touch and keyboard, reports progress as `aria-valuenow` as well as
visually, announces start/completion/early release through a live region, and vibrates where supported.
The schematic map is unreadable to a screen reader, so it always renders a text list of the same entities.

---

## Future backend integration points

| Seam | File | Replace with |
| --- | --- | --- |
| Realtime events | `features/emergency/transport.ts` | WebSocket / SSE / push |
| Dispatch backend | `features/emergency/dispatch-service.ts` | Real dispatch API |
| Session snapshot | `readSnapshot` / `writeSnapshot` | Fetch of the current case |
| Travel estimates | `lib/geo.ts` → `RouteEstimator` | OSRM, Valhalla or a commercial router |
| Map rendering | `components/map/map-types.ts` → `MapProvider` | MapLibre + OpenStreetMap tiles |
| Patient and fleet data | `src/data/*` | Authenticated API reads |
| Access log | `EmergencyDataAccessLog` | Append-only server-side audit store |
| Authentication | `DEMO_DISPATCHER` and friends | Real sessions with role claims |

---

## What should be built next

1. **Persistence and auth.** Real sessions, a real store, and server-enforced role permissions —
   everything above is currently client-side.
2. **Ambulance crew application.** The one role that closes the loop between dispatcher and patient,
   and the natural place for symptoms to first be recorded by someone who can see the patient.
3. **Setswana.** The scaffolding is in `lib/i18n.ts`; the translation needs a fluent speaker and
   clinical review. Emergency wording is not something to machine-translate.
4. **Real map tiles** behind the existing `MapProvider` interface.
5. **Multiple concurrent emergencies.** The state machine handles one case; the dispatcher console's
   queue, prioritisation and assignment conflicts all follow from supporting many.
6. **Offline queueing.** The connectivity model is honest about being offline but does not yet queue
   and replay an alert — the prerequisite for any future SMS fallback.
7. **Emergency Medical ID.** Present in the Stitch profile as a QR code; left out here because
   rendering one would claim a capability that does not exist yet.

---

*All data in this repository is demonstration data.*
