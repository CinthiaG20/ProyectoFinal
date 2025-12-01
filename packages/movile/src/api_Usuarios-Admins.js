
export let token=""

export function useLogin(email,pssword) {
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

fetch(`http://localhost:3000/api/login?email=${email}`, requestOptions)
  .then((response) => response.json())
  .then((result) =>{token = result.token;id=result.userId;console.log(result.token)
  })
  .catch((error) => console.error(error));
}
export function logout(){
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

fetch("http://localhost:3000/api/logout", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
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

  fetch("http://localhost:3000/api/me", requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

export function listarUsuarios(){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:3000/api/users", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

export function crearUsuario(){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const raw = JSON.stringify({
  "email": email,
  "password": pssword,
  "role": role
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/users", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

export function borrarUsuario(email,pssword,role,id){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWQiOiI2MTg0MjBiZi0wNTVlLTRhMmMtYmRlZS1iZTgzOTA0OTFiOGYiLCJ0b2tlblZlcnNpb24iOjgsImlhdCI6MTc2NDQ0NzI3MCwiZXhwIjoxNzY0NDU4MDcwfQ.jSZM8XTjzyPgT-CSoqbyYOqNfb7oPEQGmQfZ6nMVqPA");

const raw = JSON.stringify({
  "email": email,
  "password": pssword,
  "role": role
});

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`http://localhost:3000/api/users/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}