# Devpost Submission Copy — MSC Traceability

## Project name

MSC Traceability — Verified Manufacturing Handoffs

## Tagline

A scan-to-verify traceability proof of concept that prevents unverified part handoffs from becoming production or delivery records.

## Inspiration

In a manufacturing flow, a part can move from raw material through preparation, multiple machines, final inspection, finished goods, shipment, and customer receipt. A dashboard alone does not prove that these handoffs happened correctly. The risk is a wrong part, wrong lot, skipped process, or premature delivery status creating hidden quality and cost leakage.

## What it does

MSC Traceability tracks one part lot from Plan to Customer Received. Each stage belongs to one PIC role. The active PIC must scan the expected Plan, Part/Lot, or Delivery Note barcode before the next stage is available.

The proof of concept includes:

- role-based scan tasks for Planner, Warehouse, Prepare, MC A, MC B, MC C, Final Inspection, and Customer Incoming;
- sequential process control that rejects skipped steps;
- visible success and rejection popups after each scan;
- three retry opportunities per active step before the transaction is locked;
- an Admin-only recovery path that requires a recorded reason and cannot create a receipt;
- Customer Received validation using DN scan plus live browser location; and
- an auditable CSV report containing successful scans, rejections, locks, unlocks, PIC, role, timestamp, part, lot, and DN.

## How we built it

This is a browser-based HTML, CSS, and JavaScript proof of concept with local demo data. I used the Devpost Learn Skill Pack to create the project scope, PRD, and technical specification, then used an AI coding agent to implement and refine the working flow.

## What we learned

The core product is not a full ERP. Its value is the reusable handoff rule: a transaction must be completed by the responsible PIC and made visible as evidence before the next process can proceed. This keeps the demo focused on preventing traceability gaps rather than copying every ERP module.

## What's next

The next version will move users, roles, transactions, and audit data to Google Sheets with Apps Script or a backend service. That will replace browser-local demo credentials with real authentication, add two-way sender/receiver verification at each handoff, and connect the proof to production reporting.

## Testing instructions

See the repository README section **Judge testing instructions**. Use password `demo123` for each listed demo account.
