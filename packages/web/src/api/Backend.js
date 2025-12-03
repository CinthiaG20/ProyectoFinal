export class Backend {
  constructor(config) {
    this.apiKey = config.apiKey;           
    this.baseUrl = config.baseUrl ?? '';   
    this.sessionToken = null;
  }

  setSessionToken(token) {
    this.sessionToken = token || null;
  }

  async fetch(url, options = {}) {
    const { method = 'GET', body = null, headers = {} } = options;

    const input = new URL(url, this.baseUrl || window.location.origin);

    const finalHeaders = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,         
      ...headers,
    };

    if (this.sessionToken) {
      finalHeaders.Authorization = `Bearer ${this.sessionToken}`;
    }

    const response = await globalThis.fetch(input, {
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
