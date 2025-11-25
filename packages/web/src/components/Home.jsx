import { useApiLogin, useApiMe } from "../hooks/apiHooks";

/** This is an example stub implementation. Please replace with your actual Home
 * component implementation.
 */
export default function Home() {
  const {
    data: loginData,
    isLoading: loginIsLoading,
    error: loginError,
  } = useApiLogin('gambler@example.com', 'gambler'); // FIXME Login test. Remove.
  const {
    data: meData,
    isLoading: meIsLoading,
    error: meError,
  } = useApiMe(loginData?.token); // FIXME Logged user data test. Remove.

  return (
    <div>
      <h1>Desarrollo Web y Mobile - Proyecto 2025 sem 2</h1>
      <p>Por favor, lea el archivo README.md para más información.</p>
      {loginIsLoading || loginError || loginData ? (
        <p>
          {loginIsLoading ? 'Login in ...'
          : loginError ? `Login failed. ${loginError.message}`
          : `Logged in successfully. User id is ${loginData.userId}.`}
        </p>
      ) : null}
      {meIsLoading || meError || meData ? (
        <p>{
          meIsLoading ? 'Fetching user data ...'
          : meError ? `Fetching user data failed. ${meError.message}`
          : `Hello, ${meData.email}`}
        </p>
      ) : null}
      
    </div>
  );
}
