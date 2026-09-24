# MSC Traceability POC

Browser-only proof of concept for part traceability from plan to verified customer receipt.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| Planner | `planner` | `demo123` |
| Warehouse PIC | `warehouse` | `demo123` |
| Customer Incoming | `incoming` | `demo123` |
| Admin | `admin` | `demo123` |

## Demo flow

1. Sign in as **Incoming** and open **Incoming DN**.
2. Deny location or scan a wrong barcode to create a locked abnormality.
3. Sign in as **Admin**, open **Abnormality & Recovery**, write a reason, then unlock.
4. Sign in as Incoming and scan the DN again. For a successful demo, the browser location must fall inside the seeded customer area; the marked demo scan only simulates barcode recognition and still requires live location.
5. Sign in as **Planner** for receipt notification, or **Admin** to download CSV.

## POC boundary

The app uses local browser storage and demo accounts. It demonstrates workflow and control logic; it is not an enterprise authentication, anti-spoofing, or audit system. Google Sheets/App Script is intentionally deferred.
