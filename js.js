const apiKeyMovie = "0b1be0b0c816c32d2e31a0e9c0a8ad5f";
const apiKeyYt = "AIzaSyC3m7jc2gDFaR0tmhC63EXIVVjnUgWtl7g";
const data = "/trending/{media_type}/{time_window}";
const naziv = document.querySelector(".naziv");
const filmovi = document.querySelector(".filmovi");
const searchBtn = document.querySelector(".search-btn");
const inputField = document.querySelector(".search-bar");
const currentMovies = document.querySelector(".trenutno-prikazuje");
const trailerWnd = document.querySelector(".display-trailer");
const hideWndBtn = document.querySelector(".hide-overlay");
const showTrailer = document.querySelector(".yt-box");
const appName = document.querySelector(".ime");
//dinamicko dodavanje filmova nakon pretrage
function createFilm(title, vote_average, poster_path, overview) {
  let finalImage = "https://image.tmdb.org/t/p/w500" + poster_path;

  var divElement = `
  <div style="
  background-image: url('${finalImage}');
" class="film" id="${title}">
    <div class="info">
      <div class="naziv">${title}</div>
      <div class="rating">${vote_average}</div>
    </div>
    <div class="overview">
      ${overview}
    </div>
  </div>
  `;

  filmovi.insertAdjacentHTML("afterbegin", divElement);
}

//youtube API
function ytApi(movieName) {
  fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${movieName} trailer%20trailer&key=${apiKeyYt}`
  )
    .then((response) => response.json())
    .then((data) => {
      const nizFilmova = [...data.items];
      const idFilma = nizFilmova[0].id.videoId;
      const konacanURL = `https://www.youtube.com/embed/${idFilma}`;
      showTrailer.src = konacanURL;
    });
}
//yt trailer
function popUpTrailer(title) {
  document.getElementById(title).addEventListener("click", () => {
    trailerWnd.style.display = "block";
    ytApi(`${title} trailer`);
  });
}

//function display top20 weekly movies
function topMovies() {
  currentMovies.textContent = "";
  fetch(
    "https://api.themoviedb.org/3/trending/movie/week?api_key=0b1be0b0c816c32d2e31a0e9c0a8ad5f"
  )
    .then((response) => response.json())
    .then((data) => {
      filmovi.innerHTML = "";
      const topTwenty = data.results;
      topTwenty.forEach((movie, index) => {
        const { title, vote_average, poster_path, overview } = movie;
        createFilm(title, vote_average, poster_path, overview);

        popUpTrailer(title);
      });
    });
}

topMovies();

//seaching movies
function searchMovie() {
  if (inputField.value != "") {
    const searchText = inputField.value;
    inputField.value = "";

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=0b1be0b0c816c32d2e31a0e9c0a8ad5f&language=en-US&query=${searchText}&page=1&include_adult=false`
    )
      .then((response) => response.json())
      .then((data2) => {
        filmovi.innerHTML = "";
        const searchResult = data2.results;
        let numberOfResults = searchResult.length;
        searchResult.forEach((movie) => {
          const { title, vote_average, poster_path, overview } = movie;
          if (poster_path != null && vote_average != 0) {
            createFilm(title, vote_average, poster_path, overview);
            popUpTrailer(title);
          } else {
            numberOfResults--;
          }
        });

        currentMovies.textContent = `Searching: ${searchText} (${numberOfResults} results)`;
      });
  } else {
    filmovi.innerHTML = "";
    topMovies();
  }
}

searchBtn.addEventListener("click", (e) => {
  searchMovie();
});
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMovie();
});

hideWndBtn.addEventListener("click", () => {
  trailerWnd.style.display = "none";
  showTrailer.src = "";
});
appName.addEventListener("click", () => {
  topMovies();
});
