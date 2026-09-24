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

Every stage is performed only by its authorised PIC. The active PIC opens **My Scan Task** and must use camera scan or the clearly marked demo-scan trigger. A mismatched barcode, rejected camera, or failed customer GPS check is recorded as a rejected attempt. Each PIC has three attempts per active stage; only the third failure locks the full flow. Admin can unlock it after entering a recovery reason, but can never create a receipt.

Barcode samples used in the POC:

- Part + Lot: `A-LED-001|LOT-2409-A`
- Delivery Note: `DN-2409-001`

## POC boundary

The app uses browser-local storage and demo accounts. It demonstrates role control, sequential scan evidence, abnormality locks, and CSV reporting; it is not an enterprise authentication, anti-spoofing, or audit system. Google Sheets/App Script is intentionally deferred.


## Judge testing instructions

1. Open the GitHub Pages deployment, or serve this repository using the local command above.
2. Sign in with `planner` / `demo123`, open **My Scan Task**, and use **Run marked demo scan**.
3. Continue with the next authorised account in the order shown in the flow. Only the PIC assigned to the active step can scan it.
4. For a rejection scenario, use a camera barcode that does not match the expected code, deny a browser permission, or attempt the next step using the wrong PIC. The first two rejected scans are recorded and the PIC may retry.
5. The third rejected scan locks the flow. Sign in as `admin`, open **Abnormality Lock**, enter a recovery reason, and unlock it for a new scan.
6. For the final Customer Received step, sign in as `incoming`. The DN scan requires the browser's live location to be within the demo coordinate and 250 m radius configured in `app.js`.

The POC is intentionally browser-local: refresh or use **Reset Demo** to begin a clean walkthrough.
