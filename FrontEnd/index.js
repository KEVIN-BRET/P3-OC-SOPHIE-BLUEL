// Import du module de gestion d'affichage des erreurs :
import { errorDisplay } from "./errordisplay.js";

// Url de l'api :
const apiUrl = "http://localhost:5678/api/";

//*--- Affichage en mode édition :
// Si le token est présent ..
if (localStorage.SophieBluelToken) {
  // on affiche tout les éléments de la class .edition-on :
  document.querySelectorAll(".edition-on").forEach((element) => {
    element.style.display = "flex";
  });
  // on fait disparaitre tout les éléments de la class .edition-off :
  document.querySelectorAll(".edition-off").forEach((element) => {
    element.style.display = "none";
  });
  // on ajoute du margin-top pour compenser la banniere :
  header.style.marginTop = "100px";
}

// Récupération des travaux :
async function getWorks() {
  return await fetch(`${apiUrl}works`)
    .then((response) => response.json())
    .catch((error) => {
      console.log(`L'API works n'a pas répondue : ${error}`);
      errorDisplay("apiWorkError", "Impossible de charger les projets");
    });
}

// Récupération des catégories :
async function getCategories() {
  return fetch(`${apiUrl}categories`)
    .then((response) => response.json())
    .catch((error) => {
      console.log(`L'API categories n'a pas répondue : ${error}`);
      errorDisplay("apiCatError", "Impossible de charger les catégories");
    });
}

// Format d'affichage des catégories :
function formatCategories(categories) {
  // on pointe la balise dans laquelle vont s'afficher les "filtres"
  const filtres = document.querySelector(".filtres");

  // Création du bouton de filtrage "Tous" :
  const boutonFilterTout = document.createElement("button");
  boutonFilterTout.innerText = `Tous`;
  boutonFilterTout.className = "btn btn-filter";
  boutonFilterTout.id = "filter-btn-all";
  // on lui attribu son parent :
  filtres.appendChild(boutonFilterTout);

  // au premier chargement, le bouton "tous" est "actif"
  boutonFilterTout.classList.add("btn-filter-active");
  // au click, il affiche "tous" les projets et change le style du bouton :
  boutonFilterTout.addEventListener("click", () => {
    displayMainGallery(), boutonFiltreActif(boutonFilterTout);
  });

  // Création des boutons de filtrage avec les catégories récupérée par l'api :
  for (let i = 0; i < categories.length; i++) {
    const nomCategorie = categories[i].name;
    const Categorie = categories[i].id;

    const boutonFiltrerCategories = document.createElement("button");
    boutonFiltrerCategories.innerText = nomCategorie;
    boutonFiltrerCategories.className = `btn btn-filter`;
    boutonFiltrerCategories.id = `filter-btn-${Categorie}`;
    // on leur attribu leur parent :
    filtres.appendChild(boutonFiltrerCategories);

    // au click, il affiche les projets de sa catégorie,
    // et le bouton change de style ("btn-clicked") :
    document
      .getElementById(`filter-btn-${Categorie}`)
      .addEventListener("click", async () => {
        const worksFromApi = await getWorks();
        formatWorks(worksFromApi, Categorie);
        boutonFiltreActif(boutonFiltrerCategories);
      });
  }
  // changer le style d'un bouton de filtre actif :
  function boutonFiltreActif(bouton) {
    document.querySelectorAll(".btn-filter-active").forEach((btn) => {
      btn.classList.remove("btn-filter-active");
    });
    bouton.classList.add("btn-filter-active");
  }
}

// Format d'affichage de la galerie principale :
function formatWorks(works, categoryId = null) {
  // on pointe la balise dans laquelle vont s'afficher les "projets"
  const gallery = document.querySelector(".gallery");
  // on efface les élément présent dans la gallery
  gallery.innerHTML = "";

  // Si un categoryId est fourni, on filtre les éléments
  if (categoryId) {
    works = works.filter((work) => work.categoryId === categoryId);
  }

  // on affiche chaque projets (filtrés ou non), avec une boucle for
  for (let i = 0; i < works.length; i++) {
    // chaque projet sera contenu dans une <figure> ..
    const projetCard = document.createElement("figure");
    projetCard.dataset.id = `categorie${works[i].categoryId}`;
    gallery.appendChild(projetCard);
    // qui contiendra une image ..
    const projetImage = document.createElement("img");
    projetImage.src = works[i].imageUrl;
    projetImage.alt = works[i].title;
    projetCard.appendChild(projetImage);
    // .. et un sous titre
    const projetSousTitre = document.createElement("figcaption");
    projetSousTitre.innerText = works[i].title;
    projetCard.appendChild(projetSousTitre);
  }
}

// Affichage de la gallery principale :
async function displayMainGallery() {
  const worksFromApi = await getWorks();
  formatWorks(worksFromApi);
}

// Affichage des boutons catégories :
async function displayCategoriesButtons() {
  const categoriesFromApi = await getCategories();
  formatCategories(categoriesFromApi);
}

// Format d'affichage de la gallerie de la modale :
function formatWorksInModale(works) {
  // on pointe la balise dans laquelle vont s'afficher les "projets" :
  const mainModaleGallery = document.getElementById("mainModaleGallery");

  // on efface les élément présent dans la gallery
  mainModaleGallery.innerHTML = "";

  // on affiche chaque projets avec une boucle for
  for (let i = 0; i < works.length; i++) {
    // Création d'une carte par projet (preview + soustitre) :
    const projetCard = document.createElement("figure");
    projetCard.dataset.id = `${works[i].id}`;
    mainModaleGallery.appendChild(projetCard);
    // projetPreview va contenir : img + trash + view :
    const projetPreview = document.createElement("div");
    projetPreview.dataset.id = `projetpreview-${works[i].id}`;
    projetPreview.classList.add("projetpreview");
    projetCard.appendChild(projetPreview);
    // img = l'image :
    const projetImage = document.createElement("img");
    projetImage.src = works[i].imageUrl;
    projetImage.alt = works[i].title;
    projetImage.title = works[i].title;
    projetPreview.appendChild(projetImage);
    // trash = bouton de suppression :
    const projetDelete = document.createElement("i");
    projetDelete.id = `deleteProjet-${works[i].id}`;
    projetDelete.classList.add("delete-btn", "fa-solid", "fa-trash-can");
    projetDelete.title = "Supprimer ce projet";
    projetPreview.appendChild(projetDelete);
    // view = bouton agrandir :
    const projetLargeView = document.createElement("i");
    projetLargeView.id = `largeviewprojet-${works[i].id}`;
    projetLargeView.classList.add(
      "largeview-btn",
      "fa-solid",
      "fa-arrows-up-down-left-right"
    );
    projetLargeView.title = "Agrandir";
    projetPreview.appendChild(projetLargeView);
    // Soustitres :
    const projetSousTitre = document.createElement("figcaption");
    projetSousTitre.innerText = "éditer";
    projetSousTitre.dataset.id = `editerprojet-${works[i].id}`;
    projetCard.appendChild(projetSousTitre);

    // Suppression d'un projet au click sur la corbeille :
    projetDelete.onclick = (id) => deleteConfirm(id);

    // ** Fonction de confirmation de suppression ** //
    function deleteConfirm() {
      const deleteConfirmationContainer = document.getElementById(
        "deleteConfirmationContainer"
      );
      // on affiche la fenêtre de confirmation :
      deleteConfirmationContainer.style.display = "flex";
      // on récupère le nom du projet :
      workNameToDelete.innerText = `${works[i].title}`;
      // on récupère l'image & ses attibuts :
      workImageToDelete.src = works[i].imageUrl;
      workImageToDelete.alt = works[i].title;
      workImageToDelete.title = works[i].title;
      workImageToDelete.width = 150;
      workImageToDelete.style.margin = "0 auto";
      // évènement au click sur "Annuler" :
      annulersuppression.onclick = () => {
        console.log("Suppression annulée");
        deleteConfirmationContainer.style.display = "none";
      };
      // évènement au click sur "Supprimer" :
      confirmersuppression.onclick = () => {
        console.log(`Projet n°${works[i].id} supprimé !`);
        deleteWork(works[i].id);
        displayGalleryInModale();
        deleteConfirmationContainer.style.display = "none";
      };
    }
  }
}

// Fonction de suppression de projet(s) :
function deleteWork(id) {
  fetch(`${apiUrl}works/${id}`, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      accept: "*/*",
      Authorization: `Bearer ${localStorage.SophieBluelToken}`,
    },
  }).catch((error) => console.log(`L'API Works n'a pas répondue : ${error}`));
}

// Affichage de la gallery dans la modale :
async function displayGalleryInModale() {
  const worksFromApi = await getWorks();
  formatWorksInModale(worksFromApi);
}

//** Lancement de la page d'accueil :
// On affiche la gallerie et les catégories :
displayMainGallery();
displayCategoriesButtons();

//*--- EVENTS LISTENERS ---*//

// au click sur "logout" ..
logoutlink.addEventListener("click", () => {
  // on supprime le token :
  localStorage.SophieBluelToken = "";
  // on retourne sur index.html :
  window.location.href = "index.html";
});

//** ----- ouverture / fermeture de la modale ----- **//

// la modale s'ouvre au click sur le bouton modifier :
galleryEdition.addEventListener("click", (e) => {
  modale.style.display = "flex";
  displayGalleryInModale();
});
// la modale se ferme au click sur le bouton fermer (x) :
closeModale.addEventListener("click", (e) => {
  modale.style.display = "none";
  displayMainGallery();
});
// ou en appuyant sur Esc, on ferme la modale
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    modale.style.display = "none";
    displayMainGallery();
  }
});
// ou en cliaquant à coté de la modale :
window.addEventListener("click", (e) => {
  // console.log(e);
  if (e.target == modale) {
    modale.style.display = "none";
    displayMainGallery();
  }
});
