const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const store = new Map();
const appNode = { innerHTML: '' };
const document = {
  getElementById: () => appNode,
  addEventListener: () => {},
  querySelector: () => null,
  createElement: () => ({ click: () => {} })
};
const sandbox = {
  console,
  document,
  window: {},
  localStorage: { getItem: key => store.get(key) || null, setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) },
  crypto: { randomUUID: () => 'test-id' },
  Date,
  Intl,
  setTimeout: () => {},
  confirm: () => true,
  Blob: class {},
  URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('app.js', 'utf8'), sandbox);
const { MSC_TEST } = sandbox;

assert.strictEqual(MSC_TEST.roleCan('WAREHOUSE', 'warehouse'), true);
assert.strictEqual(MSC_TEST.roleCan('WAREHOUSE', 'admin'), false);
assert.strictEqual(MSC_TEST.roleCan('CUSTOMER_INCOMING', 'incoming'), true);
assert.strictEqual(MSC_TEST.roleCan('CUSTOMER_INCOMING', 'report'), false);

const atCustomer = { latitude: -6.2146, longitude: 106.8451, accuracy: 10 };
assert.strictEqual(MSC_TEST.validateReceipt({ role: 'CUSTOMER_INCOMING', customerId: 'cus-01', barcode: 'DN-2409-001', location: atCustomer }), 'PASS');
assert.strictEqual(MSC_TEST.validateReceipt({ role: 'WAREHOUSE', customerId: 'cus-01', barcode: 'DN-2409-001', location: atCustomer }), 'ROLE_REJECT');
assert.strictEqual(MSC_TEST.validateReceipt({ role: 'CUSTOMER_INCOMING', customerId: 'cus-01', barcode: 'WRONG-DN', location: atCustomer }), 'BARCODE_REJECT');
assert.strictEqual(MSC_TEST.validateReceipt({ role: 'CUSTOMER_INCOMING', customerId: 'cus-01', barcode: 'DN-2409-001', location: { latitude: -6.1, longitude: 106.9, accuracy: 10 } }), 'LOCATION_REJECT');
assert.strictEqual(MSC_TEST.validateReceipt({ role: 'CUSTOMER_INCOMING', customerId: 'cus-01', barcode: 'DN-2409-001', location: { ...atCustomer, accuracy: 300 } }), 'LOCATION_REJECT');
const reportData = MSC_TEST.seed();
reportData.events.push({ id: 'lock-1', at: '2026-09-24T00:00:00.000Z', type: 'ABNORMALITY_LOCK', actorName: 'Maya Incoming', role: 'CUSTOMER_INCOMING', department: 'Customer Incoming', reason: 'Location "outside" geofence', quantity: 120 });
const csv = MSC_TEST.csvContent(reportData.events, reportData.order);
assert.ok(csv.startsWith('"event_id","time","event_type"'));
assert.ok(csv.includes('"ABNORMALITY_LOCK"'));
assert.ok(csv.includes('Location ""outside"" geofence'));
console.log('PASS: role guards and receipt validation outcomes');
