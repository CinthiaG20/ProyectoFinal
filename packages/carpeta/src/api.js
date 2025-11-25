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
  .then((result) =>console.log(result))
  .catch((error) => console.error(error));
}
export function logout(){
  const myHeaders = new Headers();
myHeaders.append("x-api-key", "default-db");
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWQiOiI2MTg0MjBiZi0wNTVlLTRhMmMtYmRlZS1iZTgzOTA0OTFiOGYiLCJ0b2tlblZlcnNpb24iOjAsImlhdCI6MTc2NDA5ODAzNCwiZXhwIjoxNzY0MTA4ODM0fQ.EK6GLOWQmVVonbr6jif-6ja6SKz_cfDyns0rNvm1WfQ\",\n    \"email\": \"admin@example.com");

const raw = "{}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/logout", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}