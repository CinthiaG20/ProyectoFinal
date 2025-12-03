export let token = "";
export let userId = "";

//funcion para loguarse
export function useLogin(email, pssword) {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "email": email,
    "password": pssword
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/login`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      token = result.token;
      userId = result.userId;
      console.log(result); // mantengo console.log
      return result;       // ahora retorna los datos
    })
    .catch((error) => console.error(error));
}

//funcion para desloguearse
export function logout() {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({}),
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/logout", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      token = "";
      userId = "";
      console.log(result); // console.log
      return result;       // devuelve respuesta
    })
    .catch((error) => console.error(error));
}

//funcion para obtener los datos de un usuario
export function getUser() {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/me", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; // retorna datos
    })
    .catch((error) => console.error(error));
}

//funcion para listar todos los usuarios
export function listarUsuarios() {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/users", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; // retorna datos
    })
    .catch((error) => console.error(error));
}

//funcion crear un usuario
export function crearUsuario(email, pssword, role) { //por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const raw = JSON.stringify({
    "email": email,
    "password": pssword,
    "role": role
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/users", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; // retorna datos
    })
    .catch((error) => console.error(error));
}

//funcion para borrar un usuario
export function borrarUsuario(id) { //por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const raw = JSON.stringify({});

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/users/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; // retorna datos
    })
    .catch((error) => console.error(error));
}
