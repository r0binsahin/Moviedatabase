import * as dotenv from "dotenv";
import { IMovies } from "./models/IMovies";
import { IMovieExtented } from "./models/IMoviesExtended";
import { IOmdbResponse } from "./models/IOmdbResponse";
import { moreAboutMovies, searchMovies } from "./services/moviesService";
dotenv.config();
import axios from "axios";

//--create HTML---------------------------------------------------------
const pageHead: HTMLHeadElement = document.createElement("header");
const pageTitle: HTMLHeadingElement = document.createElement("h1");
const titleDescription: HTMLParagraphElement = document.createElement("p");

const searchForm: HTMLFormElement = document.createElement("form");
const searchInput: HTMLInputElement = document.createElement("input");
const searchButton: HTMLButtonElement = document.createElement("button");

const infoBox: HTMLElement = document.createElement("section");
const descriptionText: HTMLParagraphElement = document.createElement("p");
infoBox.classList.add("infoBox");
descriptionText.classList.add("descriptionText");
descriptionText.innerHTML =
  "Welcome to one of the biggest movie databases. You can search among over 4200 movies from all around the world. Type something in the searching area to find a movie.";

const resultContainer: HTMLElement = document.createElement("main");
const searchResults: HTMLDivElement = document.createElement("div");

searchForm.classList.add("searchForm");
searchInput.classList.add("searchInput");
searchInput.type = "text";
searchInput.placeholder = "type...";
searchButton.classList.add("searchButton");
searchButton.innerHTML = "SEARCH";

resultContainer.classList.add("resultsContainer");
searchResults.classList.add("searchResults", "row");

pageHead.classList.add("pagehead");
pageTitle.classList.add("pagehead__title");
titleDescription.classList.add("pagehead__desc");

pageTitle.innerHTML = "MovieLand";
titleDescription.innerHTML = "movies from all around the world";

document.body.appendChild(pageHead);
pageHead.appendChild(pageTitle);
pageHead.appendChild(titleDescription);

document.body.appendChild(searchForm);
searchForm.appendChild(searchInput);
searchForm.appendChild(searchButton);

document.body.appendChild(infoBox);
infoBox.appendChild(descriptionText);

document.body.appendChild(resultContainer);
resultContainer.appendChild(searchResults);

const prevButton: HTMLButtonElement = document.createElement("button");
prevButton.type = "button";
prevButton.id = "prevPage";
prevButton.innerHTML = `<i class="bi bi-caret-left-fill"></i>`;

const nextButton: HTMLButtonElement = document.createElement("button");
nextButton.type = "button";
nextButton.id = "nextPage";
nextButton.innerHTML = `<i class="bi bi-caret-right-fill"></i>`;

const buttonContainer: HTMLElement = document.createElement("section");
buttonContainer.classList.add("buttonContainer");
document.body.appendChild(buttonContainer);

//---------------------------------------------------
// searching by user input

let currentPage: number = 1;
let searchText: string = "";
/*
searchForm.addEventListener("input", async () => {
  searchResults.innerHTML = "";
  searchText = searchInput.value;

  if (searchText.length > 2) {
    let movies: IMovies[] = await searchMovies(searchText, currentPage);
    movies = movies.sort((a: IMovies, b: IMovies) => {
      if (+a.Year > +b.Year) return 1;
      if (+a.Year < +b.Year) return -1;
      return 0;
    });
    createHtml(movies);
  }
}); */

searchForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  searchResults.innerHTML = "";

  searchText = searchInput.value;

  if (searchText === "") {
    descriptionText.innerHTML = "Type something to search";
  } else {
    disablePrevButton();
    let movies: IMovies[] = await searchMovies(searchText, currentPage);
    createHtml(movies);
  }
});

const createHtml = (movies: IMovies[]) => {
  resultContainer.innerHTML = "";
  infoBox.style.display = "none";

  for (let i = 0; i < movies.length; i++) {
    const movieInfo: HTMLDivElement = document.createElement("div");
    const title: HTMLHeadingElement = document.createElement("h3");
    const poster: HTMLImageElement = document.createElement("img");

    movieInfo.classList.add(
      "searchResults__movie",
      "col-sm-12",
      "col-md-5",
      "col-lg-3"
    );
    title.classList.add("searchResults__movie--title");
    poster.classList.add("searchResults__movie--poster");

    title.innerHTML = movies[i].Title;
    poster.src = movies[i].Poster;

    searchResults.appendChild(movieInfo);
    movieInfo.appendChild(title);
    movieInfo.appendChild(poster);
    resultContainer.appendChild(searchResults);

    movieInfo.addEventListener("click", () => {
      handleClick(movies[i]);
    });

    movieInfo.setAttribute("data-bs-toggle", "modal");
    movieInfo.setAttribute("data-bs-target", "#exampleModal");
  }

  buttonContainer.appendChild(prevButton);
  buttonContainer.appendChild(nextButton);
};

async function handleClick(movie: IMovies) {
  let modalBody: HTMLDivElement = document.getElementById(
    "modal-body"
  ) as HTMLDivElement;
  modalBody.innerHTML = "";
  let moreMovie: IMovieExtented = await moreAboutMovies(movie.imdbID);

  const modalTitle: HTMLHeadingElement = document.getElementById(
    "exampleModalLabel"
  ) as HTMLHeadingElement;

  const poster: HTMLImageElement = document.createElement("img");
  const plot: HTMLParagraphElement = document.createElement("p");
  const release: HTMLParagraphElement = document.createElement("p");
  const director: HTMLHeadingElement = document.createElement("h4");

  poster.src = moreMovie.Poster;
  plot.innerHTML = moreMovie.Plot;
  release.innerHTML = moreMovie.Released;
  director.innerHTML = moreMovie.Director;

  modalTitle.innerHTML = moreMovie.Title;

  modalBody.appendChild(poster);
  modalBody.appendChild(director);
  modalBody.appendChild(release);
  modalBody.appendChild(plot);
}

function disablePrevButton() {
  if (currentPage === 1) {
    prevButton.setAttribute("disabled", "true");
    prevButton.style.opacity = "0.5";
  } else {
    prevButton.removeAttribute("disabled");
    prevButton.style.opacity = "1";
  }
}

//let currentPage: number = 1;

nextButton.addEventListener("click", async () => {
  currentPage++;
  disablePrevButton();

  let movies: IMovies[] = await searchMovies(searchText, currentPage);
  searchResults.innerHTML = "";
  createHtml(movies);
  window.scrollTo(0, 0);
});

prevButton.addEventListener("click", async () => {
  if (currentPage === 1) {
    disablePrevButton();
  } else {
    currentPage--;
    disablePrevButton();
    let movies: IMovies[] = await searchMovies(searchText, currentPage);
    searchResults.innerHTML = "";
    createHtml(movies);
    window.scrollTo(0, 0);
  }
});

//disablePrevButton();
