// Global utilities and functions for Sugarland Theaters

// LocalStorage keys
const STORAGE_KEYS = {
    SELECTED_MOVIE: 'sugarland_selected_movie',
    SELECTED_SESSION: 'sugarland_selected_session',
    SELECTED_SEATS: 'sugarland_selected_seats',
    TICKETS: 'sugarland_tickets',
    CUSTOMER: 'sugarland_customer'
};

// Storage utilities
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// Navigation utilities
const Navigation = {
    goToHome: () => window.location.href = 'index.html',
    goToMovies: () => window.location.href = 'movies.html',
    goToMovieDetails: (movieId) => window.location.href = `movie-details.html?id=${movieId}`,
    goToSeats: () => window.location.href = 'seats.html',
    goToCheckout: () => window.location.href = 'checkout.html',
    goToSuccess: () => window.location.href = 'success.html',
    
    getQueryParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
};

// Format utilities
const Format = {
    currency: (value) => {
        return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
    },
    
    date: (dateString) => {
        const date = new Date(dateString);
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
    },
    
    time: (timeString) => {
        return timeString;
    },
    
    duration: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    },
    
    rating: (ratingValue) => {
        const rating = ratings.find(r => r.value === ratingValue);
        return rating ? rating.label : ratingValue;
    }
};

// Movie utilities
const MovieUtils = {
    getById: (id) => {
        return moviesData.find(movie => movie.id === parseInt(id));
    },
    
    getFeatured: () => {
        return moviesData.filter(movie => movie.featured);
    },
    
    getAll: () => {
        return moviesData;
    },
    
    filterByGenre: (genre) => {
        return moviesData.filter(movie => movie.genre.includes(genre));
    },
    
    filterByRating: (rating) => {
        return moviesData.filter(movie => movie.rating === rating);
    },
    
    search: (query) => {
        const lowerQuery = query.toLowerCase();
        return moviesData.filter(movie => 
            movie.title.toLowerCase().includes(lowerQuery) ||
            movie.director.toLowerCase().includes(lowerQuery) ||
            movie.cast.some(actor => actor.toLowerCase().includes(lowerQuery))
        );
    },
    
    getSessionsByDate: (movieId, date) => {
        const movie = MovieUtils.getById(movieId);
        if (!movie) return [];
        
        return movie.sessions.filter(session => session.date === date);
    },
    
    getAvailableDates: (movieId) => {
        const movie = MovieUtils.getById(movieId);
        if (!movie) return [];
        
        const dates = [...new Set(movie.sessions.map(s => s.date))];
        return dates.sort();
    }
};

// Smooth scroll utility
const smoothScroll = (target) => {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Show loading spinner
const showLoading = () => {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'global-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Carregando...</p>
    `;
    document.body.appendChild(loader);
};

// Hide loading spinner
const hideLoading = () => {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.remove();
    }
};

// Toast notification
const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Initialize header navigation (if exists)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
});
