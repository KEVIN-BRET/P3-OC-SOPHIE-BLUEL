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

// format d'affichage de la galerie principale :
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

// affichage de la gallery principale :
async function displayMainGallery() {
  const worksFromApi = await getWorks();
  formatWorks(worksFromApi);
}

displayMainGallery();
