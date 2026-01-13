// Home Page JavaScript

// Load featured movies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedMovies();
    setupNewsletterForm();
    setupSmoothScroll();
});

// Load and display featured movies
function loadFeaturedMovies() {
    const container = document.getElementById('featuredMovies');
    if (!container) return;
    
    const featured = MovieUtils.getFeatured().slice(0, 6);
    
    container.innerHTML = featured.map(movie => createMovieCard(movie)).join('');
    
    // Add click handlers
    document.querySelectorAll('.movie-card').forEach(card => {
        const movieId = card.getAttribute('data-movie-id');
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the button
            if (!e.target.closest('.btn')) {
                Navigation.goToMovieDetails(movieId);
            }
        });
    });
}

// Create movie card HTML
function createMovieCard(movie) {
    return `
        <div class="movie-card" data-movie-id="${movie.id}">
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="movie-rating">
                    <span class="rating-badge rating-${movie.rating}">${Format.rating(movie.rating)}</span>
                </div>
                <div class="movie-overlay">
                    <p style="color: white; font-size: 0.95rem; line-height: 1.5;">
                        ${movie.synopsis.substring(0, 120)}...
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
                    ${movie.genre.slice(0, 3).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <div class="movie-price">
                    a partir de ${Format.currency(movie.price.half)}
                </div>
            </div>
        </div>
    `;
}

// Handle movie selection
function handleSelectMovie(movieId) {
    event.stopPropagation();
    Navigation.goToMovieDetails(movieId);
}

// Setup newsletter form
function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate newsletter signup
        showToast('✅ Inscrição realizada com sucesso! Verifique seu e-mail.', 'success');
        form.reset();
    });
}

// Setup smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add scroll animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.featured-section, .about-section, .location-section, .newsletter-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
