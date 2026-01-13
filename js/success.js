// Success Page JavaScript

let movie, session, seats, customer, tickets;

document.addEventListener('DOMContentLoaded', () => {
    movie = Storage.get(STORAGE_KEYS.SELECTED_MOVIE);
    session = Storage.get(STORAGE_KEYS.SELECTED_SESSION);
    seats = Storage.get(STORAGE_KEYS.SELECTED_SEATS);
    customer = Storage.get(STORAGE_KEYS.CUSTOMER);
    tickets = Storage.get(STORAGE_KEYS.TICKETS);
    
    if (!movie || !session || !seats || !customer) {
        showToast('Dados da compra não encontrados', 'error');
        setTimeout(() => Navigation.goToHome(), 2000);
        return;
    }
    
    loadTicketInfo();
    generateTicketCode();
});

function loadTicketInfo() {
    const regularTotal = tickets.regular * movie.price.regular;
    const halfTotal = tickets.half * movie.price.half;
    const grandTotal = regularTotal + halfTotal;
    
    const ticketContent = document.getElementById('ticketContent');
    
    ticketContent.innerHTML = `
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-film"></i>
                <span>Filme</span>
            </div>
            <div class="ticket-value highlight">${movie.title}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-calendar"></i>
                <span>Data</span>
            </div>
            <div class="ticket-value">${Format.date(session.date)}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-clock"></i>
                <span>Horário</span>
            </div>
            <div class="ticket-value">${session.time}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-film"></i>
                <span>Tipo</span>
            </div>
            <div class="ticket-value">${session.type} - ${session.room}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-couch"></i>
                <span>Assentos</span>
            </div>
            <div class="ticket-value highlight">${seats.join(', ')}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-ticket-alt"></i>
                <span>Ingressos</span>
            </div>
            <div class="ticket-value">
                ${tickets.regular > 0 ? `${tickets.regular}x Inteira` : ''}
                ${tickets.regular > 0 && tickets.half > 0 ? ' + ' : ''}
                ${tickets.half > 0 ? `${tickets.half}x Meia` : ''}
            </div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-user"></i>
                <span>Cliente</span>
            </div>
            <div class="ticket-value">${customer.name}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-envelope"></i>
                <span>E-mail</span>
            </div>
            <div class="ticket-value">${customer.email}</div>
        </div>
        
        <div class="ticket-detail">
            <div class="ticket-label">
                <i class="fas fa-money-bill-wave"></i>
                <span>Total Pago</span>
            </div>
            <div class="ticket-value highlight">${Format.currency(grandTotal)}</div>
        </div>
    `;
}

function generateTicketCode() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `SL2026-${random}`;
    document.getElementById('ticketCode').textContent = `COD: #${code}`;
}

function sendEmail() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showToast('E-mail reenviado com sucesso!', 'success');
    }, 1500);
}

// Clear all storage after viewing (optional - uncomment if needed)
// window.addEventListener('beforeunload', () => {
//     Storage.clear();
// });
