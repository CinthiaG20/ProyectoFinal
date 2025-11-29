export class Backend {
  constructor(config) {
    this.apiKey = config.apiKey;           // puede ser un valor fijo
    this.baseUrl = config.baseUrl ?? '';   // URL base del backend
    this.sessionToken = null;
  }

<<<<<<< HEAD
  setSessionToken(token) {
    this.sessionToken = token || null;
  }

  async fetch(url, options = {}) {
    const { method = 'GET', body = null, headers = {} } = options;

    const input = new URL(url, this.baseUrl || window.location.origin);

    const finalHeaders = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,         // tu API no usa api key, pero debe existir
      ...headers,
    };

    if (this.sessionToken) {
      finalHeaders.Authorization = `Bearer ${this.sessionToken}`;
    }

    const response = await globalThis.fetch(input, {
=======
    const input = new URL(url, import.meta.env.VITE_API_BASE_URL ?? window.location.origin);
    const request = await globalThis.fetch(input, {
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const message = `Request failure: ${response.status} ${response.statusText}`;
      let error;
      try {
        const payload = await response.json();
        error = new Error(payload.error || message);
        error.payload = payload;
      } catch {
        error = new Error(message);
      }
      throw error;
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async get(url, options = {}) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post(url, body = {}, options = {}) {
    return this.fetch(url, { ...options, method: 'POST', body });
  }

  async put(url, body = {}, options = {}) {
    return this.fetch(url, { ...options, method: 'PUT', body });
  }

  async patch(url, body = {}, options = {}) {
    return this.fetch(url, { ...options, method: 'PATCH', body });
  }

  async delete(url, options = {}) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }
}
