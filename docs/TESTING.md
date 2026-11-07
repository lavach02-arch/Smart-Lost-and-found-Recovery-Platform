# SmartFind Testing Documentation

This document outlines the testing strategy, manual test cases, automated test suite, security verification, and production build checks for the **SmartFind — Smart Lost & Found Recovery Platform**.

---

## 1. Automated Test Suite

SmartFind backend includes an automated test runner built with Node.js `node:test` assertion framework.

### Running Automated Tests
```bash
cd backend
npm test
```

### Test Suite Components (`backend/tests/api.test.js`)
1. **Text Similarity Engine**:
   - `normalizeText()`: Validates lowercasing and punctuation stripping.
   - `tokenize()`: Verifies tokenization into word arrays.
   - `calculateTextSimilarity()`: Tests Jaccard word token similarity ratio calculation.
2. **Smart Matching Engine**:
   - `calculateMatchScore()`: Validates multi-factor weighted scoring algorithm for Lost & Found item pairs.
3. **Role & Permission Constraints**:
   - Validates `role === 'ADMIN'` role checks and access enforcement.

---

## 2. Manual Test Cases Checklist

### User Registration & Login
- [x] **Valid Registration**: Register with new name, email, password, and phone → 201 Created & JWT returned.
- [x] **Duplicate Email**: Register with existing email → 400 Bad Request error response.
- [x] **Weak Password**: Password under 6 characters → Validation error response.
- [x] **Valid Login**: Login with correct email and password → Returns JWT token & user profile.
- [x] **Invalid Login**: Login with wrong password or unregistered email → 401 Unauthorized response.
- [x] **Unauthenticated Access**: Access protected route without token → 401 Unauthorized response.

### Item Reporting System
- [x] **Report Lost Item**: Create lost item with title, category, description, location, date → Item saved with status `lost`.
- [x] **Report Found Item**: Create found item → Item saved with status `found`.
- [x] **Edit Item Report**: Owner updates listing details → Saved successfully.
- [x] **Unauthorized Edit**: Non-owner attempts PUT `/api/items/:id` → 403 Forbidden.
- [x] **Delete Item Report**: Owner deletes listing → Listing removed.

### Smart Matching System
- [x] **Match Calculation**: Open `/matches/:itemId` → Displays matched items sorted by highest match score percentage.
- [x] **Match Alert**: Creating a lost item automatically alerts matching found items.

### Recovery Claims Workflow
- [x] **Submit Claim**: User A submits claim for User B's found item → Claim saved with status `PENDING`.
- [x] **Claim Notification**: Item owner receives `RECOVERY_REQUEST` notification.
- [x] **Accept Claim**: Item owner clicks Accept → Claim status updated to `ACCEPTED`, recovery in progress.
- [x] **Reject / Complete Claim**: Complete claim lifecycle flow updates statuses accurately.

### Abuse & Listing Reports
- [x] **Flag Item**: User clicks "Report Item" on Item Details → Flag saved with reason and description.
- [x] **Admin Review**: Admin views `/admin/reports` and updates status to `REVIEWED` or `RESOLVED`.

### Admin Dashboard & Role Authorization
- [x] **Normal User Admin Access**: Logged in `USER` accesses `/admin` or `/api/admin/*` → Access Denied / `403 Forbidden`.
- [x] **Admin Access**: User with `role === 'ADMIN'` accesses `/admin` → Displays live MongoDB statistics.
- [x] **User Suspension**: Admin suspends user → User status changed to `SUSPENDED`; suspended user blocked from creating items.
- [x] **Admin Audit Logging**: Administrative actions create entry in `AdminActivity`.

---

## 3. Production Build & Deployment Verification

### Frontend Production Build
```bash
cd frontend
npm run build
```
- **Output**: `dist/index.html`, `dist/assets/`
- **Result**: `✓ built in 4.29s` (0 build errors).

### Frontend Production Preview
```bash
cd frontend
npm run preview
```
- Serves built production bundle on `http://localhost:4173`.
