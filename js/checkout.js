// Checkout Page JavaScript

let movie, session, seats;
let ticketCounts = { regular: 0, half: 0 };

document.addEventListener('DOMContentLoaded', () => {
    movie = Storage.get(STORAGE_KEYS.SELECTED_MOVIE);
    session = Storage.get(STORAGE_KEYS.SELECTED_SESSION);
    seats = Storage.get(STORAGE_KEYS.SELECTED_SEATS);
    
    if (!movie || !session || !seats) {
        showToast('Dados da reserva não encontrados', 'error');
        setTimeout(() => Navigation.goToMovies(), 2000);
        return;
    }
    
    // Initialize with all regular tickets
    ticketCounts.regular = seats.length;
    
    loadTicketTypes();
    loadOrderSummary();
    attachEventListeners();
});

function loadTicketTypes() {
    const container = document.getElementById('ticketTypes');
    
    container.innerHTML = `
        <div class="ticket-type-selector">
            <div class="ticket-type-item">
                <div class="ticket-info">
                    <h4>Inteira</h4>
                    <p>Ingresso padrão</p>
                </div>
                <div class="ticket-controls">
                    <button class="quantity-btn" onclick="changeTicketCount('regular', -1)">-</button>
                    <span class="quantity-display" id="regularCount">0</span>
                    <button class="quantity-btn" onclick="changeTicketCount('regular', 1)">+</button>
                </div>
                <div class="ticket-price">${Format.currency(movie.price.regular)}</div>
            </div>
            
            <div class="ticket-type-item">
                <div class="ticket-info">
                    <h4>Meia-Entrada</h4>
                    <p>Estudantes, idosos, etc.</p>
                </div>
                <div class="ticket-controls">
                    <button class="quantity-btn" onclick="changeTicketCount('half', -1)">-</button>
                    <span class="quantity-display" id="halfCount">0</span>
                    <button class="quantity-btn" onclick="changeTicketCount('half', 1)">+</button>
                </div>
                <div class="ticket-price">${Format.currency(movie.price.half)}</div>
            </div>
        </div>
        <p style="margin-top: 15px; color: var(--text-light); font-size: 0.9rem;">
            <i class="fas fa-info-circle"></i> Total de ${seats.length} assento(s) selecionado(s)
        </p>
    `;
    
    updateTicketDisplay();
}

function changeTicketCount(type, delta) {
    const totalSeats = seats.length;
    const newCount = ticketCounts[type] + delta;
    const otherType = type === 'regular' ? 'half' : 'regular';
    const totalTickets = newCount + ticketCounts[otherType];
    
    if (newCount < 0 || totalTickets > totalSeats) return;
    
    ticketCounts[type] = newCount;
    updateTicketDisplay();
    loadOrderSummary();
}

function updateTicketDisplay() {
    document.getElementById('regularCount').textContent = ticketCounts.regular;
    document.getElementById('halfCount').textContent = ticketCounts.half;
}

function loadOrderSummary() {
    const container = document.getElementById('orderSummary');
    
    const regularTotal = ticketCounts.regular * movie.price.regular;
    const halfTotal = ticketCounts.half * movie.price.half;
    const grandTotal = regularTotal + halfTotal;
    
    container.innerHTML = `
        <div class="summary-item">
            <h4>${movie.title}</h4>
            <div class="summary-details">
                <span><i class="fas fa-calendar"></i> ${Format.date(session.date)}</span>
                <span>${session.time}</span>
            </div>
            <div class="summary-details">
                <span><i class="fas fa-film"></i> ${session.type}</span>
                <span>${session.room}</span>
            </div>
        </div>
        
        <div class="summary-item">
            <h4><i class="fas fa-couch"></i> Assentos</h4>
            <p style="color: var(--text-dark); margin-top: 5px;">${seats.join(', ')}</p>
        </div>
        
        <div class="summary-item">
            <h4><i class="fas fa-ticket-alt"></i> Ingressos</h4>
            ${ticketCounts.regular > 0 ? `
                <div class="summary-details">
                    <span>${ticketCounts.regular}x Inteira</span>
                    <span>${Format.currency(regularTotal)}</span>
                </div>
            ` : ''}
            ${ticketCounts.half > 0 ? `
                <div class="summary-details">
                    <span>${ticketCounts.half}x Meia</span>
                    <span>${Format.currency(halfTotal)}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('grandTotal').textContent = Format.currency(grandTotal);
}

function attachEventListeners() {
    document.getElementById('finishBtn').addEventListener('click', finishPurchase);
    
    // CPF mask
    document.getElementById('cpf').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
}

function finishPurchase() {
    const form = document.getElementById('checkoutForm');
    const termsCheckbox = document.getElementById('termsCheckbox');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    if (!termsCheckbox.checked) {
        showToast('Aceite os termos e condições', 'warning');
        return;
    }
    
    const totalTickets = ticketCounts.regular + ticketCounts.half;
    if (totalTickets !== seats.length) {
        showToast('Selecione o tipo de ingresso para todos os assentos', 'warning');
        return;
    }
    
    // Save customer data
    const customer = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        cpf: document.getElementById('cpf').value
    };
    
    Storage.set(STORAGE_KEYS.CUSTOMER, customer);
    Storage.set(STORAGE_KEYS.TICKETS, ticketCounts);
    
    showLoading();
    setTimeout(() => {
        hideLoading();
        Navigation.goToSuccess();
    }, 2000);
}
