# Stitch export → implementation

Record of what came from the Google Stitch export, what was normalised, and why. Kept so nobody has
to re-derive these decisions from the screenshots later.

The export itself (`stitch_medlink_botswana_emergency_platform/`) is not committed — it is a design
source, not a dependency.

## Screens in the export

| Folder | Assets | Status | Implemented as |
| --- | --- | --- | --- |
| `medlink_logo` | `screen.png` only | Reference | `components/brand/MedLinkLogo.tsx` (redrawn as SVG) |
| `patient_home_sos_button` | png + html | Superseded by V2 | — |
| `patient_home_sos_v2` | png + html | **Primary** | `app/patient/page.tsx` |
| `sos_transmission_state_v2` | png + html | **Primary** | `app/patient/emergency/transmitting/page.tsx` |
| `patient_active_emergency_tracker` | png + html | Superseded by V2 | — |
| `active_emergency_tracker_v2` | png + html | **Primary** | `app/patient/emergency/active/page.tsx` |
| `patient_medical_profile` | png + html | Reference | `app/patient/medical-profile/page.tsx` |
| `emergency_medical_summary_v2` | png + html | **Primary** | `components/emergency/EmergencySummaryCard.tsx` |
| `dispatcher_control_center` | png + html | Superseded by V2 | — |
| `dispatcher_dashboard_v2` | png + html | **Primary** | `app/dispatch/page.tsx` |

## The V1 → V2 safety correction

`dispatcher_control_center` (V1) rendered:

> **Reported Condition:** Seizure / Epilepsy
> **Priority:** P1 — Critical
> **Caller Notes:** "Patient collapsed, shaking violently. Has history of epilepsy. Please hurry."

Nobody reported any of that. The known condition (epilepsy) had been silently promoted into a current
diagnosis (seizure), a priority and a witness account.

`dispatcher_dashboard_v2` corrected it, splitting the panel into **Known Profile Info** chips and a
separate **Current SOS Context** reading *"No symptom info provided."*

That correction is now structural rather than visual: `Emergency.symptomsReported` is
`Sourced<string> | null`, nothing copies from the profile onto the emergency, and
`KnownVsCurrentPanel` renders both columns together. See the README section *Two product rules the
code enforces*.

## Design-system normalisations

Every screen shipped its own copy of an identical ~50-token Material 3 palette inline via
`cdn.tailwindcss.com`, alongside 8 duplicate Inter imports and 18 Material Symbols imports.

| Inconsistency in the export | Resolution |
| --- | --- |
| `"primary": #003164` but `"primary-container": #00478D` | `#00478D` is brand primary |
| `#00478D` / `#00468B` and `#191C20` / `#191C21` near-duplicates | Collapsed to one each |
| **No amber token anywhere**; *"Weak connection"* drawn in emergency red | Added `caution` ramp, `#8A5A00` (AA on white and on its container). Red reads as failure; a weak connection is not a failure |
| Nav "active" green in `patient_home_sos_v2` and `dispatcher_control_center`, blue in `patient_home_sos_button` | Brand blue. Green stays semantic |
| SOS reads `SOS` in V1, `GET HELP` in V2 | `SOS` with `GET EMERGENCY HELP` beneath |
| Bottom nav order Home/Activity/Profile/Settings (V1) vs Home/Profile/Activity/Settings (V2) | Home / Medical Profile / Activity / Settings. Visible label is "Profile" to fit four across at 360px; the accessible name is "Medical profile" |
| Case ID `INC-0842` (V1) vs `BW-ML-1028` (V2) | `BW-ML-1028` |
| Dispatcher sidebar has 6 items, missing AED Network / Emergency History / Reports / Settings; "Analytics" vs "Reports" | Full nine-item navigation |
| Transmission screen shows *"State 2 of 3"* (a Stitch artifact) | Real step counter driven by `TRANSMISSION_STEPS` |
| V2 transmission and summary screenshots render in a serif face | Stitch failed to load Inter. Inter is loaded once via `next/font` |

## Details rescued from V1

Per the brief's instruction to recover anything V2 dropped accidentally:

- **Reassurance copy** from `patient_active_emergency_tracker`: *"Your location and medical profile
  have been shared with the authorized response team. Please remain where you are if it is safe to do
  so."* — restored on the active emergency screen. It answers the question patients actually ask.
- **Map legend with live counts** (*"Available Unit (12) · Active Emergency (1)"*) — `MapLegend`.
- **Count badge on Live Emergencies** in the sidebar — `buildDispatchNav()`.

V2's `Receiving Facility` label was kept over V1's `Dispatch Facility`, which was wrong.

## Technical debt removed

| In the export | Replaced with |
| --- | --- |
| 8 × Google Fonts Inter imports | One `next/font` declaration |
| 18 × Material Symbols imports | `components/ui/Icon.tsx`, ~45 inline SVGs, no network dependency |
| 9 × inline `cdn.tailwindcss.com` configs | One `tailwind.config.ts` |
| 12 × `lh3.googleusercontent.com` generated photographs of people who do not exist | `components/ui/Avatar.tsx` (initials) |
| Static map screenshots, and a control-room photo behind the V1 dispatcher map | `MapProvider` abstraction with a schematic SVG renderer |
| Hard-coded single `Assign MED-04` button | `AmbulanceAssignmentDrawer` with ranked candidates |
| Ten independent HTML documents | Shared shells, primitives and typed domain models |

## Deliberate omissions

- **Emergency Medical ID QR code** (in `patient_medical_profile`). Rendering a QR code captioned
  *"scan this to instantly access critical vital information"* would claim a capability that does not
  exist. Listed in the README as next work.
- **`I CAN'T SPEAK` as a plain toggle** (V2's visual). Kept as a switch, but backed by a real
  communication event with a pending state, because a local toggle would imply dispatch had received
  something it had not.
