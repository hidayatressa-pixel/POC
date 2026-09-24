# MSC Traceability POC

Browser-only proof of concept for part traceability from Plan through verified Customer Received.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Demo accounts

All passwords are `demo123`.

| PIC role | Username |
| --- | --- |
| Planner / PPIC | `planner` |
| Warehouse PIC | `warehouse` |
| Material Prepare | `prepare` |
| Operator MC A | `mca` |
| Operator MC B | `mcb` |
| Operator MC C | `mcc` |
| Final Inspection | `quality` |
| Customer Incoming | `incoming` |
| Admin | `admin` |

## End-to-end transaction flow

`Plan → Material Request → Raw Material Received → Prepare → MC A → MC B → MC C → Final Inspection → Finished Good → DN → Shipment → Customer Received`

Every stage is performed only by its authorised PIC. The active PIC opens **My Scan Task** and must use camera scan or the clearly marked demo-scan trigger. A mismatched barcode, rejected camera, or failed customer GPS check locks the full flow. Only Admin can unlock it after entering a recovery reason; the Admin can never create a receipt.

Barcode samples used in the POC:

- Part + Lot: `A-LED-001|LOT-2409-A`
- Delivery Note: `DN-2409-001`

## POC boundary

The app uses browser-local storage and demo accounts. It demonstrates role control, sequential scan evidence, abnormality locks, and CSV reporting; it is not an enterprise authentication, anti-spoofing, or audit system. Google Sheets/App Script is intentionally deferred.
