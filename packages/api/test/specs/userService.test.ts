import { describe, expect, test } from 'vitest';
import { User, UserRole } from '../../src/domain/types';
import { TEST_DB_KEY, TestApiClient } from './testUtils';

describe('User Service', async () => {
  const apiUsers = '/api/users';

  const userDataWithoutPassword = {
    email: 'test1@example.com',
    role: UserRole.Gambler,
  } satisfies Partial<User>;
  const userData = {
    ...userDataWithoutPassword,
    password: 'test-password',
  } satisfies Partial<User>;

  test('an admin user can operate with users', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('admin@example.com', 'admin');
    
    const createdUser = await apiClient.create(
      apiUsers, { body: userData }, userDataWithoutPassword,
    );
    const fetchedUser = await apiClient.fetchOK(`${apiUsers}/${createdUser.id}`);
    expect(fetchedUser).toEqual(createdUser);

    const otherEmail = 'test-user2@example.com';
    const updatedUser = await apiClient.fetchOK(`${apiUsers}/${createdUser.id}`, {
      method: 'PATCH',
      body: { email: otherEmail },
    });
    expect(updatedUser).toEqual({ updated: 1 });

    await apiClient.fetchOK(`/api/users/${createdUser.id}`, { method: 'DELETE' });
    await apiClient.fetchFail(`${apiUsers}/${createdUser.id}`, {}, 404);
  });

  test('a manager user can only see the users, but not operate with them', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('manager@example.com', 'manager');
    
    await apiClient.fetchFail(apiUsers, { method: 'PUT', body: userData }, 403);
    await apiClient.fetchOK(apiUsers, { method: 'GET' });
  });

  test('a gambler user cannot operate with users', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('gambler@example.com', 'gambler');
    
    await apiClient.fetchFail(apiUsers, { method: 'PUT', body: userData }, 403);
    await apiClient.fetchFail(apiUsers, { method: 'GET' }, 403);
  });

  test('should not allow many users with the same email', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('admin@example.com', 'admin');

    await apiClient.fetchFail(apiUsers, { method: 'PUT',
      body: {
        email: 'gambler@example.com',
        role: UserRole.Manager,
        password: 'not-a-gambler',
      }
    }, 400);
  });

  test('logout should invalidate the current token', async () => {
    const apiClient = new TestApiClient({ apiKey: TEST_DB_KEY });
    await apiClient.login('gambler@example.com', 'gambler');
    await apiClient.fetchOK('/api/me');

    const logoutResponse = await apiClient.fetchOK('/api/logout', { method: 'POST' });
    expect(logoutResponse.message).toBe('Logged out successfully');
    await apiClient.fetchFail('/api/me', {}, 401);

    await apiClient.login('gambler@example.com', 'gambler');
    await apiClient.fetchOK('/api/me');
  });
});
