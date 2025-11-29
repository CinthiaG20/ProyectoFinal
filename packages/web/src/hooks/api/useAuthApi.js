import * as AuthApi from '../../api/endpoints/auth.js';

export function useAuthApi() {
  return {
    login: AuthApi.apiLogin,
    me: AuthApi.apiMe,
  };
}
