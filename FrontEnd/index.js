// Url de l'api :
const apiUrl = "http://localhost:5678/api/";

// Récpèration des travaux :
async function getWorks() {
  return fetch(`${apiUrl}works`)
    .then((response) => response.json())
    .catch((error) => {
      console.log(`L'API works n'a pas répondue : ${error}`);
      galleryerror.innerText = "Impossible d'afficher les projets !";
    });
}

// Récpèration des catégories :
async function getCategories() {
  return fetch(`${apiUrl}categories`)
    .then((response) => response.json())
    .catch((error) => {
      console.log(`L'API categories n'a pas répondue : ${error}`);
      galleryerror.innerText = "Impossible d'afficher les categories !";
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

displayMainGallery();
displayCategoriesButtons();