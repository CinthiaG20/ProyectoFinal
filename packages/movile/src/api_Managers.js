import { token } from "./api_Usuarios-Admins";

//funcion para crear un torneo con nombre, decripcion inicio y finalizaciongfzcx 
export function crearTorneo(nombre,desc,inicio,fin){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
    "name": nombre,
    "description": desc,
    "beginning": inicio,
    "ending": fin
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/tournaments", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para listar todos los torneos   
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
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para borrar un torneo teniendo el id
export function borrarTorneo(id){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/tournaments/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para crear un nuevo equipo
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
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/teams", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion obtener y listar los equipos
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
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para eliminar un equipo
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
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion listar los partidos
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
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para crear un nuevo partido
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
    "awayTeam": idEquipo2
  });

  const requestOptions = {
    method: "post",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/matches", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion borrar el partido
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
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion cargar resultados del partido
export function cargarResultadoPartido(id,homeScore,awayScore){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
    "homeScore": homeScore,
    "awayScore": awayScore
  });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/matches/${id}/result`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para borrar el resultado
export function BorrarResultadoPartido(id){ //por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
    "homeScore": null,
    "awayScore": null
  });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/matches/${id}/result`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion listar las invitaciones del usuario
export function listarInvitaciones(){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/invitations", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Invitaciones recibidas:", result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion para crear una invitacion
export function crearInvitacion(email,idTorneo){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
    "invitedGamblerEmail": email
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/invitations", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}

//funcion eliminar una invitacion
export function eliminarInvitacion(id){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/invitations/${id}/revoke`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => console.error(error));
}
