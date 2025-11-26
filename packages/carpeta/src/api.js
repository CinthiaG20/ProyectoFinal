
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

fetch(`http://localhost:3000/api/login?email=${email}.com`, requestOptions)
  .then((response) => response.json())
  .then((result) =>{token = result.token;console.log(result);
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
