---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast — learner delegated implementation and will review a concrete working result.

## Slices

- [x] **1. Role-based order tracking works in one browser**
  Becomes usable: Demo accounts can sign in, see only their permitted workspace, and add a valid Warehouse handoff while the order timeline persists after reload.
  Why now: Delivers a real traceability journey and identity/authority before the high-risk receipt control.
  PRD ref: `prd.md > Identity and Authority`, `Order and Process History`, `Warehouse Handoff`
  Spec ref: `spec.md > Login and Session`, `Order Dashboard and Timeline`, `Warehouse Handoff`, `Data Model`
  Build: Create the browser application, seeded order/accounts, local persistence, role guards, timeline, and Warehouse Received/Sent actions.
  Verify (mechanical): Serve the app, run automated browser-free logic tests for role guards, persistence, and duplicate handoff prevention; inspect files for syntax errors.
  Learner check: Sign in as Warehouse, record its handoff, reload, then confirm the timeline remains and Customer Receipt is unavailable.
  Commit: `Build role-based traceability dashboard`

- [x] **2. Customer receipt locks on failed location and recovers through Admin**
  Becomes usable: Incoming Customer can scan DN with camera, validate device location, see a locked abnormality when a required control fails, and retry only after an Admin recovery reason.
  Why now: It proves `scope.md > The Unique Kernel` before secondary reporting work.
  PRD ref: `prd.md > Customer Receipt`, `Receipt Lock and Admin Recovery`, `States and Boundaries`
  Spec ref: `spec.md > Incoming Receipt Controller`, `Lock and Admin Recovery`, `Important Failure Modes`
  Build: Add camera scanner, location capture, receipt validator, lock event, Admin unlock, and success notification with explicit browser-support messages.
  Verify (mechanical): Run deterministic receipt-engine tests for rejected location, lock persistence, denied unlock, valid unlock, valid receipt, and duplicate receipt.
  Learner check: Open Incoming on an Android browser, deny location once, review the lock as Admin, unlock with a reason, then retry using the supported demo path.
  Commit: `Add protected customer receipt workflow`

- [x] **3. Admin can export evidence and reset the POC**
  Becomes usable: Admin downloads a CSV containing successful, rejected, and recovery events; the POC can return to a clean seeded state for recording.
  Why now: Completes the evidence loop used in the demo video.
  PRD ref: `prd.md > Planner Notification and Report`
  Spec ref: `spec.md > Notification and CSV Report`, `What Was Simplified and Why`
  Build: Add CSV serialization, report action, planner notification panel, reset control, README, and final responsive polish.
  Verify (mechanical): Run export tests for required headers/event types; serve the app and check no external runtime dependency is required.
  Learner check: Sign in as Admin, export the report, open the CSV, and confirm rejected and unlock events appear beside receipt events.
  Commit: `Finish report export and demo guide`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after Slice 1, learner checks role dashboard and timeline.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — focused explanation of the receipt guard and its tests
- [ ] Optional edit and transfer reflection addressed — not yet offered
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Pending build completion.
Route and stops: Pending build completion.
Edit outcome: Pending build completion.
Reflection: Pending build completion.
Activity mode: fast mode.

## Revisions
