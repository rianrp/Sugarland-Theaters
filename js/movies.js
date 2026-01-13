// Movies Page JavaScript

let allMovies = [];
let filteredMovies = [];
let selectedGenres = [];
let selectedRatings = [];
let searchQuery = '';
let sortBy = 'title';

document.addEventListener('DOMContentLoaded', () => {
    allMovies = MovieUtils.getAll();
    filteredMovies = [...allMovies];
    
    initializeFilters();
    renderMovies();
    attachEventListeners();
});

function initializeFilters() {
    // Generate genre filters
    const genreFilters = document.getElementById('genreFilters');
    genres.forEach(genre => {
        const div = document.createElement('div');
        div.className = 'filter-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="genre-${genre}" value="${genre}">
            <label for="genre-${genre}">${genre}</label>
        `;
        genreFilters.appendChild(div);
    });
    
    // Generate rating filters
    const ratingFilters = document.getElementById('ratingFilters');
    ratings.forEach(rating => {
        const div = document.createElement('div');
        div.className = 'filter-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="rating-${rating.value}" value="${rating.value}">
            <label for="rating-${rating.value}">${rating.label}</label>
        `;
        ratingFilters.appendChild(div);
    });
}

function attachEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        applyFilters();
    });
    
    // Genre checkboxes
    document.querySelectorAll('#genreFilters input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedGenres.push(e.target.value);
            } else {
                selectedGenres = selectedGenres.filter(g => g !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Rating checkboxes
    document.querySelectorAll('#ratingFilters input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedRatings.push(e.target.value);
            } else {
                selectedRatings = selectedRatings.filter(r => r !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Sort select
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortBy = e.target.value;
        sortMovies();
        renderMovies();
    });
    
    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

function applyFilters() {
    filteredMovies = allMovies.filter(movie => {
        // Search filter
        if (searchQuery) {
            const matchesSearch = 
                movie.title.toLowerCase().includes(searchQuery) ||
                movie.director.toLowerCase().includes(searchQuery) ||
                movie.cast.some(actor => actor.toLowerCase().includes(searchQuery));
            
            if (!matchesSearch) return false;
        }
        
        // Genre filter
        if (selectedGenres.length > 0) {
            const hasGenre = movie.genre.some(g => selectedGenres.includes(g));
            if (!hasGenre) return false;
        }
        
        // Rating filter
        if (selectedRatings.length > 0) {
            if (!selectedRatings.includes(movie.rating)) return false;
        }
        
        return true;
    });
    
    sortMovies();
    renderMovies();
}

function sortMovies() {
    filteredMovies.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'year':
                return b.year - a.year;
            case 'price-asc':
                return a.price.regular - b.price.regular;
            case 'price-desc':
                return b.price.regular - a.price.regular;
            default:
                return 0;
        }
    });
}

function renderMovies() {
    const grid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = `Mostrando ${filteredMovies.length} filme${filteredMovies.length !== 1 ? 's' : ''}`;
    
    if (filteredMovies.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = filteredMovies.map(movie => createMovieCard(movie)).join('');
    
    // Add click handlers
    document.querySelectorAll('.movie-card').forEach(card => {
        const movieId = card.getAttribute('data-movie-id');
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                Navigation.goToMovieDetails(movieId);
            }
        });
    });
}

function createMovieCard(movie) {
    return `
        <div class="movie-card" data-movie-id="${movie.id}">
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="movie-rating">
                    <span class="rating-badge rating-${movie.rating}">${Format.rating(movie.rating)}</span>
                </div>
                <div class="movie-overlay">
                    <p style="color: white; font-size: 0.9rem; line-height: 1.5;">
                        ${movie.synopsis.substring(0, 100)}...
                    </p>
                    <button class="btn btn-primary" onclick="handleSelectMovie(${movie.id})">
                        <i class="fas fa-ticket-alt"></i> Comprar Ingresso
                    </button>
                </div>
            </div>
            <div class="movie-info-card">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span><i class="fas fa-clock"></i> ${Format.duration(movie.duration)}</span>
                    <span><i class="fas fa-calendar"></i> ${movie.year}</span>
                </div>
                <div class="movie-genres">
                    ${movie.genre.slice(0, 2).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <div class="movie-price">
                    ${Format.currency(movie.price.regular)}
                </div>
            </div>
        </div>
    `;
}

function handleSelectMovie(movieId) {
    event.stopPropagation();
    Navigation.goToMovieDetails(movieId);
}

function clearAllFilters() {
    // Clear search
    document.getElementById('searchInput').value = '';
    searchQuery = '';
    
    // Clear genre checkboxes
    document.querySelectorAll('#genreFilters input').forEach(cb => cb.checked = false);
    selectedGenres = [];
    
    // Clear rating checkboxes
    document.querySelectorAll('#ratingFilters input').forEach(cb => cb.checked = false);
    selectedRatings = [];
    
    // Reset sort
    document.getElementById('sortSelect').value = 'title';
    sortBy = 'title';
    
    applyFilters();
}
