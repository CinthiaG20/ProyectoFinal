export class Backend {
  constructor(config) {
    this.apiKey = config.apiKey;
    if (!this.apiKey) {
      throw new Error('API key is required');
    }
  }
  
  async fetch(url, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
    } = options;

    const input = new URL(url, window.location.origin);
    const request = await globalThis.fetch(input, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!request.ok) {
      throw new Error(`Request failure, ${request.status} ${request.statusText}.`);
    } else {
      return await request.json();
    }
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
