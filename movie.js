// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// this code will do a search for movies and then arrange them in order from A - Z or Z - A 
// it will also, give error message if movie is not found
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

const movieList = document.querySelector(".movieCard");
const searchInput = document.getElementById('search-form');
let currentMovies = [];
const apiKey = '2e325618';

searchInput.addEventListener('submit', async (event) => {
    event.preventDefault();

    
    const searchQuery = searchInput.querySelector('input[name="query"]').value.trim();
    if (!searchQuery) return;

    try {
        currentMovies = await getMovies(searchQuery);
        renderMovies(currentMovies);
    }
    catch (error) {
        currentMovies = [];
        movieList.innerHTML = `<div class="movieError">
            <p>${error.message}</p>
        </div>`;
    }
    
});

async function getMovies(searchQuery) {
    
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        const movieData = await response.json();

        if (movieData.Response === "False") {
            // console.warn(movieData.Error);
            throw new Error(movieData.Error || "No movies found.")

            return [];
        }

        return movieData.Search || [];
    
}



 async function renderMovies(movieData) {

    movieList.innerHTML = movieData
    .map(
        (movie) => `<div class="movieResults">
            <figure class="movie__img--wrapper">
                ${movie.Poster !== 'N/A' ? `<img class="movie__img" src="${movie.Poster}" alt="${movie.Title}">` : 
                ''}
            </figure>
            <div class="movie__title">
                <h3>Title: ${movie.Title}</h3>
            </div>
            <div class="movie__year">
                <h3>Year: ${movie.Year}</h3>
            </div>            
        </div>`
    )
    .join("");//sets the innerHTML
 }



function filterMovies(event) {
// const filter = event.target.value;
if (!currentMovies.length) return;

const filter = event.target.value;
let sortedMovies = currentMovies.slice(); //copy array

     if (filter === 'A to Z') {
        sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    }
    else if (filter === 'Z to A') {
        sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    }

    renderMovies(sortedMovies);
}