import { token } from "./api";

export function misTorneos(){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const raw = "";

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:3000/api/me/tournaments/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

export function ListarPrtidos(idTorneo){const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`http://localhost:3000/api/me/tournaments/${idTorneo}/matches`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));}

export function listarPronosticosTorneo(idTorneo){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`http://localhost:3000/api/me/tournaments/${idTorneo}/gambles`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
  export function listarPronosticos(){
    const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:3000/api/me/gambles", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
  export function crear_actualizarPronostico(usuario,match,homeScore,awayScore){
    const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const raw = JSON.stringify({
  "user": usuario,
  "match": match,
  "homeScore": homeScore,
  "awayScore": awayScore
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/me/gambles", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }

  export function borrarPronostico(id){
    const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);


const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`http://localhost:3000/api/me/gambles/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
   export function listarMisInvitaciones(){
      const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  fetch("http://localhost:3000/api/me/invitations", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    }
    export function aceptarInvitacion(idTorneo,idInvitacion){
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
    
    fetch(`http://localhost:3000 /api/me/invitations/${idInvitacion}/accept`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    }
    export function rechazarInvitacion(idTorneo,idInvitacion){
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
    
    fetch(`http://localhost:3000/api/me/invitations/${idInvitacion}/reject`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    }

