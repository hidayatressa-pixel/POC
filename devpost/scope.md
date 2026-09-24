---
doc: scope
status: approved
---

# MSC Traceability

A manufacturing traceability proof of concept that follows a part from production plan to verified customer receipt.

## The Unique Kernel
The final `Customer Received` transaction is accepted only when the Delivery Note barcode is scanned by the customer incoming PIC from the expected customer location. A scan from an internal or incorrect location is rejected and recorded as an abnormality, preventing a false completion from hiding cost leakage.

## Who It's For
The primary user is the PPIC/incoming PIC at the customer who receives a shipment and needs proof that it followed the agreed process. Internal planning and departmental PICs use the resulting transaction history to confirm plan execution and investigate abnormalities.

## The Core Loop
A PIC advances one shipment through its agreed traceability stages. At the customer, the incoming PIC opens the receiving page, scans the Delivery Note barcode, and submits the receipt. The system checks the transaction context and location, then either completes the shipment and notifies planning or rejects the attempt and records the reason.

## Inspiration & Identity
The application should feel like a focused manufacturing system: clear statuses, visible accountability, and evidence that can be understood quickly during an operational review. It grows from the learner's MSC/mini-ERP concept and real factory flow.

## Why This Matters to the Learner
The learner wants real tracking and real transaction evidence that production followed the plan without manipulation or fraud. Detecting a false receipt before it is treated as complete can expose abnormalities that would otherwise create cost leakage.

## What "Working" Looks Like
The demo shows one planned shipment moving through its traceability stages to Delivery Note release and shipment. A false `Customer Received` attempt from an incorrect location is blocked and appears in the event history as an abnormality. A valid scan by the customer incoming PIC at the expected location changes the shipment to `Customer Received`, sends a visible notification to planning, and gives the customer a complete transaction history as proof.

## The POC Boundary
- One planned order, one part, one Delivery Note, and one customer.
- A compact end-to-end part/shipment timeline from plan to customer receipt.
- Department/PIC ownership shown on each recorded event.
- Delivery Note barcode scanning at the customer-receipt stage.
- Location verification for the receipt transaction.
- Rejected false-receipt attempt recorded as an abnormality.
- Successful receipt status, planning notification, and customer-visible history.
- Named sign-in accounts with basic Planner, Warehouse, Customer Incoming, and Admin permissions.
- A receipt lock when required camera/location checks fail, with an Admin-only recovery menu and a recorded reason.
- Downloadable transaction reports.

## Later
- Multiple orders, parts, customers, routes, and sites.
- Detailed raw-material request and preparation transactions in pcs/kg.
- Full MC A → MC B → MC C and final-inspection operational inputs.
- Part-image/sample verification for wrong-part prevention.
- Production account administration, stronger identity assurance, notification, audit, and integration controls.
- Google Sheets and Apps Script integration after the self-contained POC.
- Analytics for plan-versus-actual performance and cost leakage.

## Explicitly Cut
- Full inventory, BOM, purchasing, production planning, and accounting modules: they are not required to prove trustworthy final receipt.
- Full account lifecycle administration and enterprise identity integration: basic named sign-in and role enforcement are included following the learner's later requirement.
- Real ERP, warehouse, carrier, or customer-system integrations: the proof can be demonstrated with one self-contained transaction journey.
- Production-ready anti-tampering infrastructure: the POC demonstrates the control concept, not enterprise security certification.
- Deployment: optional for this hackathon; the working local demo and public source repository are sufficient.

## Amendments After Scope Approval
The learner explicitly added role/auth, downloadable reports, and an Admin-only menu to reopen blocked receipts during the PRD discussion. Warehouse sees orders from Plan and only its Sent/Received operations; customer receipt remains an Incoming Customer action. Detailed design is delegated to the agent for later learner review. These additions supersede the earlier authentication exclusion; they do not expand this POC into a full ERP.
