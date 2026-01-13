// Seats Page JavaScript - Updated for integration

// Configuration
const ROWS = 12;
const SEATS_PER_ROW = 10;
const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Sector configuration for mobile view
const SECTORS = {
    front: { rows: [0, 1, 2, 3], label: 'Frontal' },
    middle: { rows: [4, 5, 6, 7], label: 'Central' },
    back: { rows: [8, 9, 10, 11], label: 'Traseira' }
};

// State
let selectedSeats = [];
let occupiedSeats = [];
let ticketPrice = 180;
let currentMovie = null;
let currentSession = null;
let currentSector = null;
let isMobileView = false;

// DOM Elements
const seatsContainer = document.getElementById('seatsContainer');
const selectedSeatsCount = document.getElementById('selectedSeats');
const totalPriceElement = document.getElementById('totalPrice');
const seatsListElement = document.getElementById('seatsList');
const clearBtn = document.getElementById('clearBtn');
const confirmBtn = document.getElementById('confirmBtn');
const cinemaContainer = document.querySelector('.cinema-container');
const sectorView = document.querySelector('.sector-view');
const backToSectorsBtn = document.querySelector('.back-to-sectors');

// Initialize
function init() {
    // Check if we have movie and session data
    currentMovie = Storage.get(STORAGE_KEYS.SELECTED_MOVIE);
    currentSession = Storage.get(STORAGE_KEYS.SELECTED_SESSION);
    
    if (!currentMovie || !currentSession) {
        showToast('Selecione um filme primeiro', 'error');
        setTimeout(() => Navigation.goToMovies(), 2000);
        return;
    }
    
    ticketPrice = currentMovie.price.regular;
    
    loadSessionInfo();
    generateRandomOccupiedSeats();
    renderSeats();
    attachEventListeners();
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Load session info card
function loadSessionInfo() {
    const breadcrumb = document.getElementById('breadcrumbMovie');
    if (breadcrumb) {
        breadcrumb.textContent = currentMovie.title;
    }
    
    document.title = `Seleção de Assentos - ${currentMovie.title} - Sugarland Theaters`;
    
    const infoCard = document.getElementById('sessionInfoCard');
    if (infoCard) {
        infoCard.innerHTML = `
            <img src="${currentMovie.poster}" alt="${currentMovie.title}" class="session-movie-poster">
            <div class="session-details">
                <h3>${currentMovie.title}</h3>
                <div class="session-meta">
                    <span><i class="fas fa-calendar"></i> ${Format.date(currentSession.date)}</span>
                    <span><i class="fas fa-clock"></i> ${currentSession.time}</span>
                    <span><i class="fas fa-film"></i> ${currentSession.type}</span>
                    <span><i class="fas fa-door-open"></i> ${currentSession.room}</span>
                </div>
            </div>
            <div class="session-price-info">
                <p>Preço por ingresso</p>
                <div class="price">${Format.currency(ticketPrice)}</div>
            </div>
        `;
    }
}

// Generate random occupied seats
function generateRandomOccupiedSeats() {
    const numberOfOccupiedSeats = Math.floor(Math.random() * 30) + 20;
    occupiedSeats = [];
    
    while (occupiedSeats.length < numberOfOccupiedSeats) {
        const row = Math.floor(Math.random() * ROWS);
        const seat = Math.floor(Math.random() * SEATS_PER_ROW);
        const seatId = `${row}-${seat}`;
        
        if (!occupiedSeats.includes(seatId)) {
            occupiedSeats.push(seatId);
        }
    }
}

// Render seats
function renderSeats() {
    seatsContainer.innerHTML = '';
    
    for (let row = 0; row < ROWS; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';
        rowElement.setAttribute('data-row', row);
        
        // Add row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = ROW_LABELS[row];
        rowElement.appendChild(rowLabel);
        
        // Create seats container
        const seatsWrapper = document.createElement('div');
        seatsWrapper.className = 'seats';
        
        for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
            const seatElement = document.createElement('div');
            seatElement.className = 'seat';
            const seatId = `${row}-${seat}`;
            seatElement.setAttribute('data-seat', seatId);
            
            // Check if occupied
            if (occupiedSeats.includes(seatId)) {
                seatElement.classList.add('occupied');
            }
            
            // Check if selected
            if (selectedSeats.includes(seatId)) {
                seatElement.classList.add('selected');
            }
            
            // Add click event
            seatElement.addEventListener('click', () => handleSeatClick(seatId));
            
            seatsWrapper.appendChild(seatElement);
        }
        
        rowElement.appendChild(seatsWrapper);
        seatsContainer.appendChild(rowElement);
    }
}

// Handle seat click
function handleSeatClick(seatId) {
    if (occupiedSeats.includes(seatId)) {
        return; // Can't select occupied seat
    }
    
    const seatElement = document.querySelector(`[data-seat="${seatId}"]`);
    
    if (selectedSeats.includes(seatId)) {
        // Deselect
        selectedSeats = selectedSeats.filter(id => id !== seatId);
        seatElement.classList.remove('selected');
    } else {
        // Select
        selectedSeats.push(seatId);
        seatElement.classList.add('selected');
    }
    
    updateUI();
}

// Update UI with selected seats info
function updateUI() {
    const count = selectedSeats.length;
    const total = count * ticketPrice;
    
    selectedSeatsCount.textContent = count;
    totalPriceElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    if (count > 0) {
        const seatLabels = selectedSeats.map(seatId => {
            const [row, seat] = seatId.split('-');
            return `${ROW_LABELS[row]}${parseInt(seat) + 1}`;
        }).sort();
        seatsListElement.textContent = seatLabels.join(', ');
    } else {
        seatsListElement.textContent = 'Nenhum';
    }
}

// Clear selection
function clearSelection() {
    selectedSeats = [];
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    updateUI();
}

// Confirm booking and proceed to checkout
function confirmBooking() {
    if (selectedSeats.length === 0) {
        showToast('Por favor, selecione pelo menos um assento.', 'warning');
        return;
    }
    
    const seatLabels = selectedSeats.map(seatId => {
        const [row, seat] = seatId.split('-');
        return `${ROW_LABELS[row]}${parseInt(seat) + 1}`;
    }).sort();
    
    // Save selected seats to localStorage
    Storage.set(STORAGE_KEYS.SELECTED_SEATS, seatLabels);
    
    // Navigate to checkout
    showToast(`${selectedSeats.length} assento(s) selecionado(s)!`, 'success');
    setTimeout(() => Navigation.goToCheckout(), 1000);
}

// Check screen size and handle mobile view
function checkScreenSize() {
    const width = window.innerWidth;
    const wasMobile = isMobileView;
    isMobileView = width <= 767;
    
    if (isMobileView && !wasMobile) {
        // Switched to mobile
        enterSectorMode();
    } else if (!isMobileView && wasMobile) {
        // Switched from mobile
        exitSectorMode();
    }
}

// Enter sector mode (mobile)
function enterSectorMode() {
    cinemaContainer.classList.add('sector-mode');
    currentSector = null;
    
    // Attach sector button events
    document.querySelectorAll('.sector-btn').forEach(btn => {
        btn.addEventListener('click', handleSectorClick);
    });
}

// Exit sector mode
function exitSectorMode() {
    cinemaContainer.classList.remove('sector-mode');
    cinemaContainer.classList.remove('detail-mode');
    backToSectorsBtn.style.display = 'none';
    
    // Show all rows
    document.querySelectorAll('.row').forEach(row => {
        row.classList.remove('active-sector');
    });
}

// Handle sector click
function handleSectorClick(event) {
    const sectorBtn = event.currentTarget;
    const sector = sectorBtn.getAttribute('data-sector');
    currentSector = sector;
    
    // Hide sector view, show cinema
    cinemaContainer.classList.remove('sector-mode');
    cinemaContainer.classList.add('detail-mode');
    backToSectorsBtn.style.display = 'block';
    
    // Show only selected sector rows
    const sectorRows = SECTORS[sector].rows;
    document.querySelectorAll('.row').forEach((row, index) => {
        if (sectorRows.includes(index)) {
            row.classList.add('active-sector');
        } else {
            row.classList.remove('active-sector');
        }
    });
    
    // Scroll to cinema
    cinemaContainer.scrollIntoView({ behavior: 'smooth' });
}

// Back to sectors
function backToSectors() {
    cinemaContainer.classList.add('sector-mode');
    cinemaContainer.classList.remove('detail-mode');
    backToSectorsBtn.style.display = 'none';
    currentSector = null;
    
    // Remove active sector class
    document.querySelectorAll('.row').forEach(row => {
        row.classList.remove('active-sector');
    });
}

// Attach event listeners
function attachEventListeners() {
    clearBtn.addEventListener('click', clearSelection);
    confirmBtn.addEventListener('click', confirmBooking);
    backToSectorsBtn.addEventListener('click', backToSectors);
}

// Start the app
init();
