import nodePath from 'node:path';
import { expect } from 'vitest';
import { Login } from '../../src/domain/types';

export function formatDate(date?: Date) {
  date ??= new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

export const TEST_DB_FOLDER = nodePath.join(__dirname, '../data/');
export const TEST_DB_KEY = `test-${formatDate()}`;

interface ApiFetchInit extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
}

export class TestApiClient {
  private apiKey: string;
  private baseURL: string;
  private session: string;

  constructor (args: {
    apiKey: string;
    baseURL?: string;
    session?: string;
  }) {
    this.apiKey = args.apiKey;
    this.baseURL = args.baseURL ?? 'http://localhost:3333';
    this.session = args.session ?? '';
  }

  async login(email: string, password: string): Promise<Login> {
    this.session = '';
    const loginData = await this.fetchOK('/api/login', {
      method: 'POST',
      body: { email, password },
    });
    expect(typeof loginData.token).toBe('string');
    this.session = loginData.token;
    return loginData;
  }

  async fetch(resource: string, init?: ApiFetchInit): Promise<Response> {
    const { body, headers, ...otherInit } = init ?? {};
    return fetch(new URL(resource, this.baseURL), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...(this.session ? { 'authorization': `Bearer ${this.session}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...otherInit,
    });
  }

  async fetchOK(resource: string, init?: ApiFetchInit, status?: number): Promise<any> {
    const response = await this.fetch(resource, init);
    if (!response.ok) {
      console.error(`Failed to fetch ${init?.method ?? 'GET'} ${resource}: ${
        response.status} ${response.statusText}! ${await response.text()}`);
    }
    expect(`${response.status}`).toMatch(/^2\d{2}$/);
    expect(response.ok).toBe(true);
    if (status !== undefined) {
      expect(response.status).toBe(status);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  }

  async fetchFail(resource: string, init?: ApiFetchInit, status?: number): Promise<any> {
    const response = await this.fetch(resource, init);
    expect(response.ok).toBe(false);
    if (status !== undefined) {
      expect(response.status).toBe(status);
    }
    return await response.json();
  }

  async create(
    resource: string,
    init: ApiFetchInit,
    expectedData?: ApiFetchInit['body'],
  ): Promise<any> {
    const dateBefore = Date.now();
    const data = await this.fetchOK(resource, { method: 'PUT', ...init });
    const { id, dateCreated, dateModified, ...otherData } = data;
    expect(id).toMatch(/^[a-z0-9-]{36}$/); // UUID format
    const parsedDateCreated = Date.parse(dateCreated);
    expect(parsedDateCreated).toBeGreaterThanOrEqual(dateBefore);
    expect(parsedDateCreated).toBeLessThanOrEqual(Date.now());
    expect(dateModified).toBeNull();
    expect(otherData).toEqual(expect.objectContaining(expectedData ?? init.body));
    return data;
  }
} // class TestApiClient
