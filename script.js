const resultsNav = document.getElementById("resultsNav");
const favouritesNav = document.getElementById("favouritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const apiKey = "LRpLAZc8uzl4dcZscvTX3icarHx3Mfln4v8B5WHG";
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favouritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favouritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favourites);
  console.log("current array:", page, currentArray);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Add to Favourites
    const addFav = document.createElement("p");
    addFav.classList.add("clickable");

    if (page === "results") {
      addFav.textContent = "Add to Favourites";
      addFav.setAttribute("onclick", `saveFavourite('${result.url}')`);
    } else {
      addFav.textContent = "Remove from Favourites";
      addFav.setAttribute("onclick", `deleteFavourite('${result.url}')`);
    }

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyright = document.createElement("span");
    if (result.copyright) {
      copyright.textContent = ` ${result.copyright}`;
    }

    footer.append(date, copyright);
    cardBody.append(cardTitle, addFav, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
    console.log(card);
  });
}

function updateDOM(page) {
  console.log(page);
  // Get Favourites from local Storage
  if (localStorage.getItem("nasaFavourites")) {
    favourites = JSON.parse(localStorage.getItem("nasaFavourites"));
    console.log("fav from local storage", favourites);
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// Get 10 Images from NASA API
async function getNasaPictures() {
  // Show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (err) {
    console.log(err);
  }
}
// Add result to Favourites
function saveFavourite(itemUrl) {
  // Loop through Results Array to select Favourite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item;
      //   console.log(favourites);
      // Show save Confirmation for 2 Seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favourites in local storage
      localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
    }
  });
}

// Delete from favourite
function deleteFavourite(url) {
  if (favourites[url]) {
    delete favourites[url];
    localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
    updateDOM("favourites");
  }
}

// On Load
getNasaPictures();
