import { token } from "./api_Usuarios-Admins";

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

return fetch("http://192.168.43.212:3000/api/me/tournaments", requestOptions)  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
<<<<<<< HEAD:packages/carpeta/src/api_Gamblers.js
export function getMyMaches(idTorneo){const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
return fetch(`http://192.168.43.212:3000/api/me/tournaments/${idTorneo}/matches`, requestOptions)
.then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));}
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

  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
export function crear_actualizarPronostico(usuario,match,homeScore,awayScore){//por confirmar
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

fetch("http://192.168.43.212:3000/api/me/gambles", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
export function borrarPronostico(id){//por confirmar
    const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);


const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`http://192.168.43.212:3000/api/me/gambles/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
export function getInvitations(){//por confirmar
      const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  fetch("http://192.168.43.212:3000/api/me/invitations", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    }
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
    
    fetch(`hhttp://192.168.43.212:3000/api/me/invitations/${idInvitacion}/reject`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    }


/*
import { token } from "./api_Usuarios-Admins";

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


return fetch("http://192.168.43.212:3000/api/me/tournaments", requestOptions)  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
=======
>>>>>>> 46319f3e3c0dfa165b944232827ed78115ae6693:packages/movile/src/api_Gamblers.js
export function getGambleID(idTorneo){const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Authorization", "Bearer "+token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
return fetch(`http://192.168.43.212:3000/api/me/tournaments/${idTorneo}/matches`, requestOptions)
.then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));}
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

  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
export function crear_actualizarPronostico(usuario,match,homeScore,awayScore){//por confirmar
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

fetch("http://192.168.43.212:3000/api/me/gambles", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
export function borrarPronostico(id){//por confirmar
    const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+token);


const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`http://192.168.43.212:3000/api/me/gambles/${id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }
export function getInvitations(){//por confirmar
      const myHeaders = new Headers();
  myHeaders.append("x-api-key", "default-db");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  fetch("http://192.168.43.212:3000/api/me/invitations", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    }
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
    
    fetch(`hhttp://192.168.43.212:3000/api/me/invitations/${idInvitacion}/reject`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    }

    */
=======
>>>>>>> 46319f3e3c0dfa165b944232827ed78115ae6693:packages/movile/src/api_Gamblers.js
