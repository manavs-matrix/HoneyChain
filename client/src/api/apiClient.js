/**
 * HoneyChain API Client Wrapper
 * Handles JWT auth token attachment and unified { success, data, error } response format
 */

const API_BASE = '/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('honeychain_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`[apiClient] Fetch error on ${endpoint}:`, err);
    return {
      success: false,
      data: null,
      error: err.message || 'Network request failed'
    };
  }
}

export const authApi = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => apiFetch('/auth/me')
};

export const apiaryApi = {
  list: () => apiFetch('/apiary'),
  create: (name, location) => apiFetch('/apiary', { method: 'POST', body: JSON.stringify({ name, location }) })
};

export const hiveApi = {
  list: (apiaryId) => apiFetch(`/hive${apiaryId ? `?apiaryId=${apiaryId}` : ''}`),
  create: (apiaryId, name, hiveType, installedDate) => apiFetch('/hive', { method: 'POST', body: JSON.stringify({ apiaryId, name, hiveType, installedDate }) })
};

export const inspectionApi = {
  list: (hiveId) => apiFetch(`/inspection?hiveId=${hiveId}`),
  create: (hiveId, healthStatus, queenPresent, honeyStores, notes) => apiFetch('/inspection', { method: 'POST', body: JSON.stringify({ hiveId, healthStatus, queenPresent, honeyStores, notes }) })
};

export const harvestApi = {
  list: () => apiFetch('/harvest'),
  create: (hiveId, yieldKg, floralSource, notes) => apiFetch('/harvest', { method: 'POST', body: JSON.stringify({ hiveId, yieldKg, floralSource, notes }) })
};

export const batchApi = {
  list: () => apiFetch('/batch'),
  get: (batchId) => apiFetch(`/batch/${batchId}`),
  recordQualityTest: (batchId, testData) => apiFetch(`/batch/${batchId}/quality-test`, { method: 'POST', body: JSON.stringify(testData) }),
  packageBatch: (batchId, packageData) => apiFetch(`/batch/${batchId}/package`, { method: 'POST', body: JSON.stringify(packageData) }),
  tamperDemo: (batchId, eventTypeToMutate, forgedPayload) => apiFetch(`/batch/${batchId}/tamper-demo`, { method: 'POST', body: JSON.stringify({ eventTypeToMutate, forgedPayload }) }),
  restoreTamper: (batchId) => apiFetch(`/batch/${batchId}/restore-tamper`, { method: 'POST' })
};

export const consumerApi = {
  getPassport: (batchId) => apiFetch(`/consumer/passport/${batchId}`)
};
