// on importe l'url de l'api :
import { apiUrl } from "./index.js";
// console.log(apiUrl);

async function authentification() {
  return fetch(`${apiUrl}users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // On inclu le mail et le password saisi dans le formulaire :
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Si les données de réponses contiennent un token ...
      if (data.token) {
        // loginerror.innerText = "";
        // .. on l'enregistre dans le Local Storage ..
        localStorage.setItem("SophieBluelToken", data.token);
        // .. puis on redirige l'utilisateurs vers la page d'accueil :
        window.location.href = "index.html";
      } else {
        // Si les données ne contiennent pas de token, on affiche une erreur :
        // loginerror.innerText = "email ou mot de passe incorrect !";
        console.log("email ou mot de passe incorrect !");
      }
    })
    .catch((error) => {
      console.log("l'API n'a pas répondue : " + error);
      // loginerror.innerText =
      //   "Serveur injoignable, veuillez rééssayer plus tard ..";
    });
}

// A l'envoi du formulaire, on appelle authentification() :
loginform.addEventListener("submit", (e) => {
  e.preventDefault();
  authentification();
});
