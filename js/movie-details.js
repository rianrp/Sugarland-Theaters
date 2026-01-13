// Movie Details Page JavaScript

let currentMovie = null;
let selectedDate = null;
let selectedSession = null;

document.addEventListener('DOMContentLoaded', () => {
    const movieId = Navigation.getQueryParam('id');
    
    if (!movieId) {
        showToast('Filme não encontrado', 'error');
        setTimeout(() => Navigation.goToMovies(), 2000);
        return;
    }
    
    currentMovie = MovieUtils.getById(movieId);
    
    if (!currentMovie) {
        showToast('Filme não encontrado', 'error');
        setTimeout(() => Navigation.goToMovies(), 2000);
        return;
    }
    
    loadMovieDetails();
    loadDates();
});

function loadMovieDetails() {
    // Update breadcrumb
    document.getElementById('breadcrumbTitle').textContent = currentMovie.title;
    
    // Update page title
    document.title = `${currentMovie.title} - Sugarland Theaters`;
    
    // Load movie hero
    const heroHTML = `
        <div class="movie-poster-large">
            <img src="${currentMovie.poster}" alt="${currentMovie.title}">
        </div>
        
        <div class="movie-info-details">
            <div class="movie-header">
                <h1 class="movie-title-large">${currentMovie.title}</h1>
                <div class="movie-meta-large">
                    <span class="rating-badge rating-${currentMovie.rating}">${Format.rating(currentMovie.rating)}</span>
                    <span><i class="fas fa-clock"></i> ${Format.duration(currentMovie.duration)}</span>
                    <span><i class="fas fa-calendar"></i> ${currentMovie.year}</span>
                </div>
                <div class="movie-genres-large">
                    ${currentMovie.genre.map(g => `<span class="genre-tag-large">${g}</span>`).join('')}
                </div>
            </div>
            
            <div class="movie-synopsis">
                <h3><i class="fas fa-align-left"></i> Sinopse</h3>
                <p>${currentMovie.synopsis}</p>
            </div>
            
            <div class="movie-credits">
                <div class="credit-item">
                    <h4>Diretor</h4>
                    <p>${currentMovie.director}</p>
                </div>
                <div class="credit-item">
                    <h4>Elenco Principal</h4>
                    <p>${currentMovie.cast.slice(0, 3).join(', ')}</p>
                </div>
            </div>
            
            <div class="movie-trailer">
                <h3><i class="fas fa-play-circle"></i> Trailer</h3>
                <div class="trailer-wrapper">
                    <iframe src="${currentMovie.trailer}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
            
            <div class="movie-pricing">
                <h3><i class="fas fa-ticket-alt"></i> Preços dos Ingressos</h3>
                <div class="pricing-info">
                    <div class="price-item">
                        <h4>Inteira</h4>
                        <p>${Format.currency(currentMovie.price.regular)}</p>
                    </div>
                    <div class="price-item">
                        <h4>Meia-Entrada</h4>
                        <p>${Format.currency(currentMovie.price.half)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('movieHero').innerHTML = heroHTML;
}

function loadDates() {
    const dates = MovieUtils.getAvailableDates(currentMovie.id);
    const container = document.getElementById('dateSelector');
    
    container.innerHTML = dates.map((dateStr, index) => {
        const date = new Date(dateStr);
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        return `
            <button class="date-btn" data-date="${dateStr}">
                <div class="day">${dayNames[date.getDay()]}</div>
                <div class="date">${date.getDate()} ${monthNames[date.getMonth()]}</div>
            </button>
        `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDate = btn.getAttribute('data-date');
            loadSessions();
        });
    });
}

function loadSessions() {
    const sessions = MovieUtils.getSessionsByDate(currentMovie.id, selectedDate);
    const container = document.getElementById('sessionsContainer');
    
    if (sessions.length === 0) {
        container.innerHTML = '<p class="select-date-msg">Nenhuma sessão disponível para esta data</p>';
        return;
    }
    
    // Group sessions by type
    const groupedSessions = {};
    sessions.forEach(session => {
        if (!groupedSessions[session.type]) {
            groupedSessions[session.type] = [];
        }
        groupedSessions[session.type].push(session);
    });
    
    const html = Object.entries(groupedSessions).map(([type, sessionList]) => {
        const typeInfo = sessionTypes.find(t => t.value === type) || { label: type, icon: '🎬' };
        
        return `
            <div class="session-type-group">
                <h4>
                    <span>${typeInfo.icon}</span>
                    <span>${typeInfo.label}</span>
                    <span class="session-type-badge">${sessionList.length} sessões</span>
                </h4>
                <div class="session-times">
                    ${sessionList.map(session => 
                        session.times.map(time => `
                            <button class="session-btn" 
                                    data-type="${session.type}" 
                                    data-time="${time}" 
                                    data-room="${session.room}">
                                <span class="time">${time}</span>
                                <span class="room">${session.room}</span>
                            </button>
                        `).join('')
                    ).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `<div class="sessions-grid">${html}</div>`;
    
    // Add click handlers
    document.querySelectorAll('.session-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.session-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            selectedSession = {
                date: selectedDate,
                time: btn.getAttribute('data-time'),
                type: btn.getAttribute('data-type'),
                room: btn.getAttribute('data-room')
            };
            
            proceedToSeats();
        });
    });
}

function proceedToSeats() {
    // Save to localStorage
    Storage.set(STORAGE_KEYS.SELECTED_MOVIE, {
        id: currentMovie.id,
        title: currentMovie.title,
        poster: currentMovie.poster,
        price: currentMovie.price,
        rating: currentMovie.rating,
        duration: currentMovie.duration
    });
    
    Storage.set(STORAGE_KEYS.SELECTED_SESSION, selectedSession);
    
    // Navigate to seats page
    showToast('Sessão selecionada! Escolha seus assentos.', 'success');
    setTimeout(() => Navigation.goToSeats(), 1000);
}
