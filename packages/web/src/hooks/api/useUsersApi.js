import * as UsersApi from '../../api/endpoints/users.js';

export function useUsersApi() {
  return {
    listUsers: UsersApi.apiListUsers,
    getUser: UsersApi.apiGetUser,
    createUser: UsersApi.apiCreateUser,
    updateUser: UsersApi.apiUpdateUser,
    deleteUser: UsersApi.apiDeleteUser,
  };
}
