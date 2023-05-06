// Import du module de gestion d'affichage des erreurs :
import { errorDisplay } from "./errordisplay.js";

// Url de l'api :
const apiUrl = "http://localhost:5678/api/";

// On pointe le formulaire du Login :
const loginForm = document.getElementById("loginForm");

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
        console.log("email ou mot de passe incorrect !");
        errorDisplay("logintitle", "email ou mot de passe incorrect !");
      }
    })
    .catch((error) => {
      console.log("l'API n'a pas répondue : " + error);
      errorDisplay(
        "logintitle",
        "Serveur injoignable, veuillez rééssayer plus tard .."
      );
    });
}

//* Events Listeners :

// A l'envoi du formulaire, on appelle authentification() :
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  authentification();
});

// Validation de l'email saisit :
loginForm.addEventListener("input", () => {
  if (!email.validity.valid) {
    errorDisplay("loginemail", "Veuillez saisir une adresse email valide !");
  } else {
    errorDisplay("loginemail", "");
  }
});
// Validation du mot de passe saisit :
loginForm.addEventListener("input", () => {
  if (!password.validity.valid) {
    errorDisplay(
      "loginpassword",
      "Le mot de passe doit contenir entre 4 et 15 caractères !"
    );
  } else {
    errorDisplay("loginpassword", "");
  }
});
