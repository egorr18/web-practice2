"use strict";

console.log("Підключено JavaScript для лабораторної роботи «Фільмова база»");

let allShows = [];
let currentSort = "name";

const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const sortNameBtn = document.getElementById("sortName");
const sortRatingBtn = document.getElementById("sortRating");
const loading = document.getElementById("loading");
const moviesContainer = document.getElementById("moviesContainer");

async function fetchMovies() {
    loading.style.display = "block";
    moviesContainer.innerHTML = "";

    try {
        const response = await fetch("https://api.tvmaze.com/shows");
        
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        allShows = await response.json();
        console.log(`Завантажено ${allShows.length} серіалів`);

        populateGenres();
        applyFiltersAndSort();

    } catch (error) {
        console.error("Помилка завантаження:", error);
        showError("Не вдалося завантажити дані. Перевірте підключення до інтернету.");
    } finally {
        loading.style.display = "none";
    }
}

function populateGenres() {
    const genresSet = new Set();
    allShows.forEach(show => {
        show.genres.forEach(genre => genresSet.add(genre));
    });

    const sortedGenres = Array.from(genresSet).sort();

    genreSelect.innerHTML = `<option value="all">Всі жанри</option>`;
    sortedGenres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

function renderMovies(shows) {
    moviesContainer.innerHTML = "";

    if (shows.length === 0) {
        moviesContainer.innerHTML = `<p class="error">Немає результатів за вашим запитом</p>`;
        return;
    }

    shows.forEach(show => {
        const { id, name, rating, genres, image, summary } = show;

        const ratingValue = rating?.average ?? "N/A";
        const poster = image?.medium ?? "https://placehold.co/210x295?text=Без+зображення";
        const shortSummary = summary 
            ? summary.replace(/<[^>]+>/g, "").substring(0, 130) + "..." 
            : "Опис відсутній";

        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <img src="${poster}" alt="${name}" class="poster">
            <div class="info">
                <h3>${name}</h3>
                <p class="rating">⭐ Рейтинг: ${ratingValue}</p>
                <p class="genres">Жанри: ${genres.join(", ") || "—"}</p>
                <p class="summary">${shortSummary}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            window.open(`https://www.tvmaze.com/shows/${id}`, "_blank");
        });

        moviesContainer.appendChild(card);
    });
}

function applyFiltersAndSort() {
    let filtered = [...allShows];

    const term = searchInput.value.toLowerCase().trim();
    if (term) {
        filtered = filtered.filter(show => 
            show.name.toLowerCase().includes(term)
        );
    }

    const selectedGenre = genreSelect.value;
    if (selectedGenre !== "all") {
        filtered = filtered.filter(show => show.genres.includes(selectedGenre));
    }

    if (currentSort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "rating") {
        filtered.sort((a, b) => {
            const ra = a.rating?.average ?? 0;
            const rb = b.rating?.average ?? 0;
            return rb - ra;
        });
    }

    renderMovies(filtered);
}

searchInput.addEventListener("input", applyFiltersAndSort);
genreSelect.addEventListener("change", applyFiltersAndSort);

sortNameBtn.addEventListener("click", () => {
    currentSort = "name";
    applyFiltersAndSort();
});

sortRatingBtn.addEventListener("click", () => {
    currentSort = "rating";
    applyFiltersAndSort();
});

function showError(message) {
    moviesContainer.innerHTML = `<div class="error">${message}</div>`;
}

document.addEventListener("DOMContentLoaded", fetchMovies);