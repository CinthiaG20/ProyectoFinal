import { token } from "./api_Usuarios-Admins";

//funcion para obtener los torneos
export function MyTournaments(){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/me/tournaments", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion para obtener los partidos del user
export function getMyMaches(idTorneo){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/me/tournaments/${idTorneo}/matches`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion 
export function getMyGambles(idTorneo){
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/me/tournaments/${idTorneo}/gambles`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion ... pronosticos
export function crear_actualizarPronostico(match,homeScore,awayScore,idEquipo1,idEquipo2){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
    match: match,
    /*
    "homeScore": homeScore,
    "awayScore": awayScore
    */
    score: { [idEquipo1]: homeScore, [idEquipo2]: awayScore }
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/me/gambles", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion para borrar un pronostico
export function borrarPronostico(id){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/me/gambles/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion para obtener las invitaciones del usuario
export function getInvitations(){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Authorization", "Bearer "+token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch("http://192.168.43.212:3000/api/me/invitations", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion para aceptar invitaciones
export function acceptInvitation(idInvitacion){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
   // tournament: idTorneo
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/me/invitations/${idInvitacion}/accept`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}

//funcion para rechazar una invitacion
export function rejectInvitation(idInvitacion){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);

  const raw = JSON.stringify({
    //tournament: idTorneo
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  return fetch(`http://192.168.43.212:3000/api/me/invitations/${idInvitacion}/reject`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result; 
    })
    .catch((error) => console.error(error));
}


 


/*
//funcion para aceptar invitaciones
export function acceptInvitation(idTorneo,idInvitacion){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);
    
  const raw = JSON.stringify({
    "invitedGambler": email,
    "tournament": idTorneo
  });
    
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
    
fetch(`http://192.168.43.212:3000/api/me/invitations/${idInvitacion}/accept`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//funcion para rechazar una invitacion
export function rejectInvitation(idTorneo,idInvitacion){//por confirmar
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);
    
  const raw = JSON.stringify({
    "invitedGambler": email,
    "tournament": idTorneo
  });
    
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
    
fetch(`http://192.168.43.212:3000/api/me/invitations/${idInvitacion}/reject`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
} 
*/