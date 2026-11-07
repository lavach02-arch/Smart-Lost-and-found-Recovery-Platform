// API Service layer for backend communication

const PRIMARY_API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LOCAL_FALLBACK_URL = 'http://localhost:5000/api';
const API_BASE_URL = PRIMARY_API_URL;

/**
 * Resilient fetch wrapper with automatic fallback for local development & clean network error handling
 */
const apiFetch = async (endpoint, options = {}) => {
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const url = endpoint.startsWith('http') ? endpoint : `${PRIMARY_API_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // If running on localhost and primary remote URL failed to connect, attempt fallback to local server
    if (isLocalhost && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      try {
        const fallbackUrl = `${LOCAL_FALLBACK_URL}${endpoint}`;
        console.warn(`[API Service] Remote API connection failed. Falling back to local server (${fallbackUrl}).`);
        const fallbackResponse = await fetch(fallbackUrl, options);
        return fallbackResponse;
      } catch (fallbackError) {
        throw new Error('Unable to connect to SmartFind server. Please verify your backend server is running on port 5000.');
      }
    }
    throw new Error('Unable to connect to SmartFind server. The backend server may be starting up or offline. Please try again in a few seconds.');
  }
};

/**
 * Check Express Backend Health Endpoint
 * GET /api/health
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiFetch('/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error status ${response.status}`);
    }

    const data = await response.json();
    return { connected: true, data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

/**
 * Fetch Items with Search, Filters, and Pagination
 * GET /api/items
 */
export const fetchItems = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.location) query.append('location', params.location);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const url = `${API_BASE_URL}/items?${query.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('[API Service] Backend API request failed.', error.message);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Fetch Single Item by ID
 * GET /api/items/:id
 */
export const getItemById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch item details');
  }
  return data;
};

/**
 * Fetch Matches for a specified item
 * GET /api/matches/:itemId
 */
export const getItemMatches = async (itemId, token) => {
  const response = await fetch(`${API_BASE_URL}/matches/${itemId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch matches for this item');
  }
  return data;
};

/**
 * Fetch My Reports (Authenticated User)
 * GET /api/items/my-reports
 */
export const getMyReports = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/items/my-reports?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch your reports');
  }
  return data;
};

/**
 * Create Lost Item
 * POST /api/items/lost
 */
export const createLostItem = async (itemData, token) => {
  const response = await fetch(`${API_BASE_URL}/items/lost`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create lost item report');
  }
  return data;
};

/**
 * Create Found Item
 * POST /api/items/found
 */
export const createFoundItem = async (itemData, token) => {
  const response = await fetch(`${API_BASE_URL}/items/found`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create found item report');
  }
  return data;
};

/**
 * Update Item (Owner only)
 * PUT /api/items/:id
 */
export const updateItem = async (id, itemData, token) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update item report');
  }
  return data;
};

/**
 * Delete Item (Owner only)
 * DELETE /api/items/:id
 */
export const deleteItem = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete item report');
  }
  return data;
};

/**
 * Register User
 * POST /api/auth/register
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

/**
 * Login User
 * POST /api/auth/login
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

/**
 * Get Current Authenticated User
 * GET /api/auth/me
 */
export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data;
};

/**
 * Get User Profile
 * GET /api/users/profile
 */
export const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }

  return data;
};

/**
 * Update User Profile
 * PUT /api/users/profile
 */
export const updateUserProfile = async (token, profileData) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data;
};

/* ==========================================================================
   NOTIFICATIONS API
   ========================================================================== */

/**
 * Get User Notifications
 * GET /api/notifications
 */
export const getNotifications = async (token) => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch notifications');
  }
  return data;
};

/**
 * Get Unread Notification Count
 * GET /api/notifications/unread-count
 */
export const getUnreadNotificationCount = async (token) => {
  const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch unread notification count');
  }
  return data;
};

/**
 * Mark Notification as Read
 * PUT /api/notifications/:id/read
 */
export const markNotificationAsRead = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark notification as read');
  }
  return data;
};

/**
 * Mark All Notifications as Read
 * PUT /api/notifications/read-all
 */
export const markAllNotificationsAsRead = async (token) => {
  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark all notifications as read');
  }
  return data;
};

/**
 * Delete Notification
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete notification');
  }
  return data;
};

/* ==========================================================================
   RECOVERY REQUESTS API
   ========================================================================== */

/**
 * Create Recovery Claim Request
 * POST /api/recovery-requests
 */
export const createRecoveryRequest = async (requestData, token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create recovery request');
  }
  return data;
};

/**
 * Get My Recovery Requests (Sent)
 * GET /api/recovery-requests/my-requests
 */
export const getMyRecoveryRequests = async (token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/my-requests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch your recovery requests');
  }
  return data;
};

/**
 * Get Received Recovery Requests
 * GET /api/recovery-requests/received
 */
export const getReceivedRecoveryRequests = async (token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/received`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch received recovery requests');
  }
  return data;
};

/**
 * Get Single Recovery Request Details
 * GET /api/recovery-requests/:id
 */
export const getRecoveryRequest = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch recovery request details');
  }
  return data;
};

/**
 * Accept Recovery Request
 * PUT /api/recovery-requests/:id/accept
 */
export const acceptRecoveryRequest = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/${id}/accept`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to accept recovery request');
  }
  return data;
};

/**
 * Reject Recovery Request
 * PUT /api/recovery-requests/:id/reject
 */
export const rejectRecoveryRequest = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/${id}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to reject recovery request');
  }
  return data;
};

/**
 * Cancel Recovery Request
 * PUT /api/recovery-requests/:id/cancel
 */
export const cancelRecoveryRequest = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel recovery request');
  }
  return data;
};

/**
 * Complete Recovery Request
 * PUT /api/recovery-requests/:id/complete
 */
export const completeRecoveryRequest = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/recovery-requests/${id}/complete`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to complete recovery request');
  }
  return data;
};

/* ==========================================================================
   USER REPORTING API
   ========================================================================== */

/**
 * Submit Report for an Item
 * POST /api/reports
 */
export const createReport = async (reportData, token) => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reportData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit report');
  }
  return data;
};

/* ==========================================================================
   ADMIN MANAGEMENT API
   ========================================================================== */

/**
 * Get Admin Dashboard Stats
 * GET /api/admin/dashboard
 */
export const getAdminDashboard = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin dashboard stats');
  }
  return data;
};

/**
 * Get Admin Users List
 * GET /api/admin/users
 */
export const getAdminUsers = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.role) query.append('role', params.role);
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin users');
  }
  return data;
};

/**
 * Update User Status (ACTIVE / SUSPENDED)
 * PUT /api/admin/users/:id/status
 */
export const updateUserStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user status');
  }
  return data;
};

/**
 * Update User Role (USER / ADMIN)
 * PUT /api/admin/users/:id/role
 */
export const updateUserRole = async (id, role, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user role');
  }
  return data;
};

/**
 * Delete User Account
 * DELETE /api/admin/users/:id
 */
export const deleteAdminUser = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }
  return data;
};

/**
 * Get Admin Items List
 * GET /api/admin/items
 */
export const getAdminItems = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/admin/items?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin items');
  }
  return data;
};

/**
 * Delete Item (Admin)
 * DELETE /api/admin/items/:id
 */
export const deleteAdminItem = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete item');
  }
  return data;
};

/**
 * Get Admin Recovery Requests List
 * GET /api/admin/recovery-requests
 */
export const getAdminRecoveryRequests = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/admin/recovery-requests?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch recovery requests');
  }
  return data;
};

/**
 * Get Admin Reports List
 * GET /api/admin/reports
 */
export const getAdminReports = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/admin/reports?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch reports');
  }
  return data;
};

/**
 * Update Report Status (Admin)
 * PUT /api/admin/reports/:id/status
 */
export const updateReportStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE_URL}/admin/reports/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update report status');
  }
  return data;
};

/**
 * Get Admin Audit Activity Logs
 * GET /api/admin/activity
 */
export const getAdminActivity = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/admin/activity?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin activity logs');
  }
  return data;
};
