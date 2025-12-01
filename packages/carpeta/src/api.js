export let token="";
export let userId = "";

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

return fetch(`http://192.168.43.212:3000/api/login`, requestOptions)

//fetch(`http://localhost:3000/api/login?email=${email}`, requestOptions)
 .then((response) => response.json())
  .then((result) =>{token = result.token;userId=result.userId;console.log(result.token)
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

return fetch("http://192.168.43.212:3000/api/logout", requestOptions)

//fetch("http://localhost:3000/api/logout", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//################# Obtener datos del user #######################################
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

  //fetch("http://localhost:3000/api/me", requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

//############## Crear torneo ###################################3
export function crearTorneo(nombre,desc,inicio,fin){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const raw = JSON.stringify({
  "name": nombre,
  "description": desc,
  "beginning": "10/11/25",
  "ending": "10/11/25"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
}; 

return fetch("http://192.168.43.212:3000/api/tournaments", requestOptions)

//fetch("http://localhost:3000/api/tournaments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }

//######## Listar Todos los torneos ###################################
export function listaTorneos(){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

 return fetch("http://192.168.43.212:3000/api/tournaments", requestOptions)

//fetch("http://localhost:3000/api/tournaments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//######### Borrar torneo por ID ######################3
export function borrarTorneo(id){
const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const raw = "";

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch(`http://192.168.43.212:3000/api/tournaments/${id}`, requestOptions)

//fetch(`http://localhost:3000/api/tournaments/${id}?=`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//######### Mis torneos ###################
export function MyTournaments(){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = "";

  const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/me/tournaments", requestOptions)

//fetch("http://localhost:3000/api/me/tournaments/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//###### Listar Partidos #################################
export function ListarPrtidos(idTorneo){
const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

return fetch(`http://192.168.43.212:3000/api/me/tournaments/${idTorneo}/matches`, requestOptions)

//fetch(`http://localhost:3000/api/me/tournaments/${idTorneo}/matches`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//##### Listar pronosticos ####
export function listarPronosticos(idTorneo){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

return fetch(`http://192.168.43.212:3000/api/me/tournaments/${idTorneo}/gambles`, requestOptions)

//fetch(`http://localhost:3000/api/me/tournaments/${idTorneo}/gambles`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//####### Crear equipo ######
export function crearEquipo(title,desc,url){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const raw = JSON.stringify({
  "title": title,
  "description": desc,
  "logoUrl": url
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/teams", requestOptions)

//fetch("http://localhost:3000/api/teams", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//###### listar los equipos ############
export function listaEquipos(){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/teams", requestOptions)

//fetch("http://localhost:3000/api/teams", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//###### eliminar equipos ################
export function eliminarEquipo(idEquipo){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

return fetch(`http://192.168.43.212:3000/api/teams/${idEquipo}`, requestOptions)

//fetch(`http://localhost:3000/api/teams/${idEquipo}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//#### lista de partidos ############
export function listaPartidos(){
const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/matches", requestOptions)

//fetch("http://localhost:3000/api/matches", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

// ######## Crear un partido ########
export function crearPartido(title,date,idTorneo,idEquipo1,idEquipo2){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

const raw = JSON.stringify({
  "title": title,
  "date": date,
  "tournament": idTorneo,
  "homeTeam": idEquipo1,
  "awayTeam": idEquipo2,
  "homeScore": null,
  "awayScore": null
});

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/matches", requestOptions)

//fetch("http://localhost:3000/api/matches", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//##### Borar partido por id #########
export function borrarPartido(id){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

return fetch(`http://192.168.43.212:3000/api/matches/${id}`, requestOptions)

//fetch(`http://localhost:3000/api/matches/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }

//##### subir resultados #####
export function subirResultado(){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  //myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWQiOiI2MTg0MjBiZi0wNTVlLTRhMmMtYmRlZS1iZTgzOTA0OTFiOGYiLCJ0b2tlblZlcnNpb24iOjgsImlhdCI6MTc2NDQ0NzI3MCwiZXhwIjoxNzY0NDU4MDcwfQ.jSZM8XTjzyPgT-CSoqbyYOqNfb7oPEQGmQfZ6nMVqPA");
  myHeaders.append("Authorization", "Bearer " + token);

  const raw = JSON.stringify({});

  const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/matches/74755dac-b1ee-4d4b-a83b-db6b4ba01c6b/results", requestOptions)

//fetch("http://localhost:3000/api/matches/74755dac-b1ee-4d4b-a83b-db6b4ba01c6b/results", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }

//#### Listar los torneos del usuario #######
export function getTournament() {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/me/tournaments", requestOptions)

  //return fetch("http://localhost:3000/api/me/tournaments", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Torneos:", result);
      return result; })
    .catch((error) => console.error(error));
}

// Listar partidos a los que el usuario tiene acceso
export function getGambleID() {
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/me/matches", requestOptions)

  //return fetch("http://localhost:3000/api/me/:id/matches", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Torneos:", result);
      return result; 
    })
    .catch((error) => console.error(error));
}
