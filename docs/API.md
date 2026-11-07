# SmartFind API Documentation

## Base URL
`http://localhost:5000/api` (Development)  
`https://YOUR-BACKEND-DOMAIN/api` (Production)

---

## 1. Health Check & Public Endpoints

### `GET /api/health`
Check backend server status.
* **Authentication**: None
* **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "SmartFind API is running",
    "version": "1.0.0 (Phase 7)",
    "timestamp": "2026-09-19T12:00:00.000Z"
  }
  ```

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new user account.
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "secretpassword",
    "phone": "9876543210"
  }
  ```
* **Response** (201 Created):
  ```json
  {
    "success": true,
    "token": "<JWT_TOKEN>",
    "user": {
      "id": "<USER_ID>",
      "name": "User Name",
      "email": "user@example.com",
      "role": "USER",
      "status": "ACTIVE"
    }
  }
  ```

### `POST /api/auth/login`
Authenticate existing user.
* **Authentication**: None
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword"
  }
  ```
* **Response** (200 OK): Returns JWT token and user profile object.

### `GET /api/auth/me`
Fetch authenticated user profile details.
* **Authentication**: `Bearer <JWT_TOKEN>`
* **Response** (200 OK): Returns current user object.

---

## 3. Items System (`/api/items`)

### `GET /api/items`
Fetch list of reported items with search, category/status filters, and server pagination.
* **Query Parameters**: `search`, `status` (`lost`|`found`), `category`, `page`, `limit`
* **Response** (200 OK):
  ```json
  {
    "success": true,
    "count": 10,
    "total": 50,
    "page": 1,
    "pages": 5,
    "data": []
  }
  ```

### `POST /api/items/lost` & `POST /api/items/found`
Report a lost or found item listing.
* **Authentication**: `Bearer <JWT_TOKEN>`
* **Request Body**: `title`, `description`, `category`, `location`, `date`, `time`, `additionalDetails`, `image`

### `GET /api/items/:id`
Fetch detailed item information.

### `PUT /api/items/:id` & `DELETE /api/items/:id`
Update or delete an item listing (Owner or Admin authorization required).

---

## 4. Smart Matching (`/api/matches`)

### `GET /api/matches/:itemId`
Calculate potential matches for a target item based on category, title, description, location, and date.
* **Authentication**: `Bearer <JWT_TOKEN>`
* **Response** (200 OK):
  ```json
  {
    "success": true,
    "item": {},
    "matches": [
      {
        "item": {},
        "matchScore": 85,
        "matchLevel": "Very High Match",
        "matchedFields": ["Category", "Item Name", "Location", "Date"]
      }
    ]
  }
  ```

---

## 5. Recovery Requests (`/api/recovery-requests`)

### `POST /api/recovery-requests`
Submit a recovery claim request for an item.
* **Authentication**: `Bearer <JWT_TOKEN>`

### `GET /api/recovery-requests/my-requests`
Fetch claims submitted by the logged-in user.

### `GET /api/recovery-requests/received`
Fetch claims received for items posted by the logged-in user.

### `PUT /api/recovery-requests/:id/accept` | `reject` | `cancel` | `complete`
Update recovery claim status lifecycle.

---

## 6. Notifications (`/api/notifications`)

### `GET /api/notifications`
Fetch user notifications list.

### `GET /api/notifications/unread-count`
Fetch count of unread notifications.

### `PUT /api/notifications/:id/read` & `PUT /api/notifications/read-all`
Mark notification(s) as read.

---

## 7. Reports / Abuse (`/api/reports`)

### `POST /api/reports`
Flag an item listing for incorrect data, spam, or fake content.
* **Authentication**: `Bearer <JWT_TOKEN>`
* **Request Body**: `reportedItem`, `reason`, `description`

---

## 8. Admin APIs (`/api/admin`)

*All admin endpoints require `Bearer <JWT_TOKEN>` and `role === 'ADMIN'`.*

### `GET /api/admin/dashboard` — Platform Statistics
### `GET /api/admin/users` — User management list with pagination & search
### `PUT /api/admin/users/:id/status` — Activate or suspend user account
### `PUT /api/admin/users/:id/role` — Update user role (`USER` | `ADMIN`)
### `DELETE /api/admin/users/:id` — Delete user account
### `GET /api/admin/items` & `DELETE /api/admin/items/:id` — Manage items
### `GET /api/admin/recovery-requests` — Monitor recovery claims
### `GET /api/admin/reports` & `PUT /api/admin/reports/:id/status` — Moderate flagged listings
### `GET /api/admin/activity` — View admin audit trail logs
