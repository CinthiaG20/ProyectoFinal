import { token } from "./api_Usuarios-Admins";
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
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/tournaments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
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
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
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
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

}

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
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
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
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

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
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
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
.then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));}

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
  "awayScore": null,
  "dateModified":true
});

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch("http://192.168.43.212:3000/api/matches", requestOptions)
.then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));}

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
 .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
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

fetch(`http://192.168.43.212:3000/api/matches/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
    }
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

fetch(`http://192.168.43.212:3000/api/matches/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
    }
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
  .then((response) => response.text())
  .then((result) => {
      console.log("Invitaciones recibidas:", result);
      return result; 
    })
  .catch((error) => console.error(error));
}
export function crearInvitacion(email,idTorneo){//por confirmar
    const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);

const raw = JSON.stringify({
  "invitedGambler": email,
  "tournament": idTorneo
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://192.168.43.212:3000/invitations", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));}
  
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

fetch(`http://192.168.43.212:3000/api/invitations/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}