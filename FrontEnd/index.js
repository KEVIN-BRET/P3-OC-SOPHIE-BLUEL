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
    boutonFiltrerCategories.addEventListener("click", async () => {
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

// Format d'affichage des catégories dans le formulaire d'ajout :
function formatCategoriesSelect(categories) {
  // on pointe le <select> parent des <option value="categorie"> :
  const addPhotoCatergorie = document.getElementById("categorielist");
  // on vide son contenu pour éviter les doublons à la réouverture :
  addPhotoCatergorie.innerHTML = "";

  // on créé le placeholder "choisissez une catégorie" :
  const categoriePlaceHolder = document.createElement("option");
  categoriePlaceHolder.innerText = "Choisissez une catégorie";
  categoriePlaceHolder.value = "";
  categoriePlaceHolder.setAttribute("disabled", "");
  categoriePlaceHolder.setAttribute("selected", "");
  addPhotoCatergorie.appendChild(categoriePlaceHolder);

  // on injecte toutes les catégories :
  for (let i = 0; i < categories.length; i++) {
    // on récupère le nom & l'id :
    const nomCategorie = categories[i].name;
    const Categorie = categories[i].id;
    // on créé une balise <option> :
    const categorieOption = document.createElement("option");

    categorieOption.innerText = nomCategorie;
    categorieOption.value = `${Categorie}`;
    addPhotoCatergorie.appendChild(categorieOption);
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

// Afficher les catégories dans la modale d'ajout de photo :
async function displayCategoriesSelect() {
  const categoriesFromApi = await getCategories();
  formatCategoriesSelect(categoriesFromApi);
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

    // Fonction de confirmation de suppression :
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
        setTimeout(() => {
          alert(`Le projet "${works[i].title}" à été supprimé`);
        }, 1000);
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

// Fonction d'ajout de photo :
function addPhoto() {
  // on fait disparaitre la premiere modale :
  mainModaleWrapper.style.display = "none";
  // on affiche la fenêtre d'ajout de photo
  addPhotoWindowWrapper.style.display = "flex";
  // on pointe le formulaire :
  const addPhotoForm = document.getElementById("addphotoform");

  // on stock l'état de validation de chaque inputs :
  let titleIsValid = false;
  let imageIsValid = false;
  let categoryIsValid = false;

  //  une fois validés, on stock la valeur des inputs :
  let title, image, category;

  // changement de couleur du bouton envoyer :
  function readyToUpload() {
    // on pointe le bouton submit :
    const submitPhoto = document.getElementById("submitPhoto");
    // si tous les inputs sont validé "true"
    if ((titleIsValid && categoryIsValid && imageIsValid) === true) {
      // le bouton devient vert :
      submitPhoto.style.backgroundColor = "var(--middle-green)";
    } else {
      // sinon il est gris :
      submitPhoto.style.backgroundColor = "var(--invalid-btn-grey)";
    }
  }

  // On injecte les catégories dans le formulaire :
  displayCategoriesSelect();

  // Récupération de l'image pour l'apercu :
  function previewImage(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    // quand le fichier est chargé, on affiche l'apercu :
    fileReader.addEventListener("load", (e) => displayUploadImage(e));
  }

  // Afichage de l'apercu de l'image :
  function displayUploadImage(e) {
    // on fait disparaitre les options de choix d'image :
    uploadPhotoMenu.style.display = "none";
    // on fait apparaitre l'immage ..
    const importedPhoto = document.getElementById("importedPhoto");
    importedPhoto.style.display = "flex";
    importedPhoto.src = e.target.result;
    // et son bouton close ..
    const closeimportedPhoto = document.getElementById("closeimportedPhoto");
    closeimportedPhoto.style.display = "flex";
    closeimportedPhoto.title = "Supprimer cette image";
    // si on clique sur close :
    closeimportedPhoto.addEventListener("click", (e) => {
      // on vide la valeur de l'input
      addPhotoInput.value = "";
      imageIsValid = false;
      readyToUpload();
      // on fait disparaitre l'image et son bouton close
      importedPhoto.style.display = "none";
      closeimportedPhoto.style.display = "none";
      // on fait ré-apparaitre les options de choix d'image :
      uploadPhotoMenu.style.display = "flex";
    });
  }

  // on pointe et valide l'ajout de photo :
  const addPhotoInput = document.querySelector('input[id="addphoto"]');
  // addPhotoInput.addEventListener("change", previewImage);
  addPhotoInput.addEventListener("change", (e) => {
    if (!e.target.value.match(/\.(jpe?g|png)$/i)) {
      errorDisplay("photo", "L'image doit être au format .jpg ou .png");
      imageIsValid = false;
      readyToUpload();
      console.log("mauvais format !!!");
    } else if (e.target.files[0].size > 4 * 1024 * 1024) {
      errorDisplay("photo", "L'image ne doit pas dépasser 4 Mo");
      imageIsValid = false;
      readyToUpload();
      console.log("trop grande !!!");
    } else {
      errorDisplay("photo", "");
      imageIsValid = true;
      readyToUpload();
      // console.log("image valide !");
      previewImage(e);
    }
  });

  // on pointe et valide le titre :
  const titlePhotoInput = document.querySelector('input[id="phototitle"]');
  // on affiche une erreur si la longueur n'est pas bonne :
  titlePhotoInput.addEventListener("input", (e) => {
    if (
      // e.target.value.length > 0 &&
      e.target.value.length < 3 ||
      e.target.value.length > 40
    ) {
      errorDisplay("title", "Le titre doit contenir entre 3 et 40 caractères");
      titleIsValid = false;
      readyToUpload();
    } else {
      errorDisplay("title", "");
      titleIsValid = true;
      readyToUpload();
    }
  });

  // on pointe et valide la liste de catégories :
  const selectCatInput = document.querySelector('select[id="categorielist"]');
  // on affiche une erreur si aucune n'est sélectionnée :
  selectCatInput.addEventListener("change", () => {
    if (selectCatInput.selectedIndex !== 0) {
      errorDisplay("categorie", "");
      categoryIsValid = true;
      readyToUpload();
    } else {
      errorDisplay("categorie", "Vous devez choisir une catégorie");
      categoryIsValid = false;
      readyToUpload();
    }
  });

  // Envoi du formulaire :
  addPhotoForm.addEventListener("submit", (e) => {
    // On evite le rechargement de la page :
    e.preventDefault();
    // On valide les inputs :
    inputsChecker();
    // si tout les inputs sont validé (="true") :
    if (title && image && category) {
      // on passe leur valeur dans l'objet formData :
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("category", category);

      // on envoi la requete POST :
      fetch(`${apiUrl}works`, {
        method: "POST",
        body: formData,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${localStorage.SophieBluelToken}`,
        },
      })
        // on affiche un msg de confirmation si l'envoi à fonctionné :
        .then(() => alert("Le projet a bien été envoyé !"))
        // sinon on affiche un msg d'erreur :
        .catch((error) => alert(`Le projet n'a pas pu être envoyé : ${error}`));

      // une fois que l'image a bien été posté,
      // on fait disparaitre l'aperçu de l'image :
      importedPhoto.style.display = "none";
      closeimportedPhoto.style.display = "none";
      // on fait ré-apparaitre les options de choix d'image :
      uploadPhotoMenu.style.display = "flex";
      // on vide les inputs :
      titlePhotoInput.value = "";
      addPhotoInput.value = "";
      selectCatInput.value = "";
      // on vide les variable :
      title = null;
      image = null;
      category = null;
      // le bouton submit redevient gris :
      submitPhoto.style.backgroundColor = "var(--invalid-btn-grey)";
    } else {
      // si les champs sont mal renseignés on affiche un msg d'erreur :
      console.log("Veuillez renseigner tous les champs");
    }
  });

  // Validation des inputs :
  function inputsChecker() {
    // on teste le titre :
    if (titlePhotoInput.value.length < 3 || titlePhotoInput.value.length > 40) {
      errorDisplay("title", "Le titre doit contenir entre 3 et 40 caractères");
      title = null;
      // on teste la catégoprie :
    } else if (selectCatInput.selectedIndex === 0) {
      errorDisplay("categorie", "Vous devez choisir une catégorie");
      category = null;
    } else if (
      // on verifie qu'une image jpeg ou png est présente :
      !addPhotoInput.value ||
      !addPhotoInput.value.match(/\.(jpe?g|png)$/i)
    ) {
      errorDisplay("photo", "Vous devez choisir une image");
      image = null;
      addPhotoInput.value = "";
    } else {
      // on retire la class .error et on dit valid=true
      errorDisplay("title", "", true);
      errorDisplay("photo", "", true);
      errorDisplay("categorie", "", true);
      // on passe la valeur des inputs (validés) à leur variable :
      title = titlePhotoInput.value;
      category = selectCatInput.value;
      image = addPhotoInput.files[0];
      // l'image doit etre un objet et non une url !
      // (note pour moi-même ..)
      // image = addPhotoInput.value;
    }
  }
}

//** Lancement de la page d'accueil :
// On affiche la gallerie et les catégories :
displayMainGallery();
displayCategoriesButtons();

//*--- EVENTS LISTENERS ---*//

// au click sur "logout" :
logoutlink.addEventListener("click", () => {
  // on supprime le token :
  localStorage.SophieBluelToken = "";
  // on retourne sur index.html :
  window.location.href = "index.html";
});

//**  ouverture / fermeture / navigation des modales :
// la modale s'ouvre au click sur le bouton modifier :
galleryEdition.addEventListener("click", () => {
  modale.style.display = "flex";
  mainModaleWrapper.style.display = "flex";
  addPhotoWindowWrapper.style.display = "none";
  displayGalleryInModale();
});
// la modale se ferme au click sur le bouton fermer (x) :
closeModale.addEventListener("click", () => {
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
  if (e.target == modale) {
    modale.style.display = "none";
    displayMainGallery();
  }
});
// Ouverture de la modale d'ajout photo :
addPhotoBtn.addEventListener("click", () => {
  addPhoto();
});
// Fermeture de la modale d'ajout photo :
closeAddPhotoWindow.addEventListener("click", () => {
  modale.style.display = "none";
  displayMainGallery();
});
// retour à la première modale (gallerie) :
returnToGallery.addEventListener("click", () => {
  addPhotoWindowWrapper.style.display = "none";
  mainModaleWrapper.style.display = "flex";
  displayGalleryInModale();
});
