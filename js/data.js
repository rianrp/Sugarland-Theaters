// Mock data for movies - Sugarland Theaters
const moviesData = [
    {
        id: 1,
        title: "Oppenheimer",
        genre: ["Drama", "História", "Thriller"],
        duration: 180,
        rating: "14",
        year: 2023,
        director: "Christopher Nolan",
        cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr.", "Matt Damon"],
        synopsis: "A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial. Uma jornada épica sobre ciência, moralidade e as consequências de nossas escolhas.",
        poster: "assets/filmes/oppenheimer.png",
        trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
        price: { regular: 40, half: 20 },
        featured: true,
        sessions: [
            { date: "2026-01-15", times: ["14:00", "17:30", "21:00"], type: "2D", room: "Sala 1" },
            { date: "2026-01-15", times: ["15:00", "19:00"], type: "IMAX", room: "Sala Premium" },
            { date: "2026-01-16", times: ["14:00", "17:30", "21:00"], type: "2D", room: "Sala 1" },
            { date: "2026-01-17", times: ["16:00", "20:00"], type: "IMAX", room: "Sala Premium" }
        ]
    },
    {
        id: 2,
        title: "Interstellar",
        genre: ["Ficção Científica", "Drama", "Aventura"],
        duration: 169,
        rating: "10",
        year: 2014,
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
        synopsis: "Em um futuro onde a Terra está se tornando inabitável, um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",
        poster: "assets/filmes/interstellar.png",
        trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
        price: { regular: 35, half: 17.50 },
        featured: true,
        sessions: [
            { date: "2026-01-15", times: ["13:00", "18:00", "22:00"], type: "2D", room: "Sala 2" },
            { date: "2026-01-16", times: ["13:00", "18:00", "22:00"], type: "2D", room: "Sala 2" },
            { date: "2026-01-17", times: ["15:00", "20:00"], type: "2D", room: "Sala 2" }
        ]
    },
    {
        id: 3,
        title: "A Origem",
        genre: ["Ação", "Ficção Científica", "Thriller"],
        duration: 148,
        rating: "14",
        year: 2010,
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"],
        synopsis: "Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um CEO.",
        poster: "assets/filmes/aorigem.png",
        trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
        price: { regular: 35, half: 17.50 },
        featured: true,
        sessions: [
            { date: "2026-01-15", times: ["14:30", "19:30"], type: "2D", room: "Sala 3" },
            { date: "2026-01-16", times: ["14:30", "19:30"], type: "2D", room: "Sala 3" },
            { date: "2026-01-17", times: ["16:30", "21:00"], type: "2D", room: "Sala 3" }
        ]
    },
    {
        id: 4,
        title: "Os Infiltrados",
        genre: ["Crime", "Drama", "Thriller"],
        duration: 151,
        rating: "16",
        year: 2006,
        director: "Martin Scorsese",
        cast: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson", "Mark Wahlberg"],
        synopsis: "Um policial infiltrado e um espião da máfia tentam identificar um ao outro enquanto infiltrados em suas respectivas organizações.",
        poster: "assets/filmes/infiltrados.png",
        trailer: "https://www.youtube.com/embed/iojhqm0JTW4",
        price: { regular: 30, half: 15 },
        featured: false,
        sessions: [
            { date: "2026-01-15", times: ["15:00", "20:00"], type: "2D", room: "Sala 4" },
            { date: "2026-01-16", times: ["15:00", "20:00"], type: "2D", room: "Sala 4" },
            { date: "2026-01-17", times: ["17:00", "21:30"], type: "2D", room: "Sala 4" }
        ]
    },
    {
        id: 5,
        title: "Iron Man",
        genre: ["Ação", "Aventura", "Ficção Científica"],
        duration: 126,
        rating: "12",
        year: 2008,
        director: "Jon Favreau",
        cast: ["Robert Downey Jr.", "Gwyneth Paltrow", "Jeff Bridges", "Terrence Howard"],
        synopsis: "Após ser mantido refém em uma caverna afegã, o bilionário engenheiro Tony Stark cria uma armadura única para combater o mal.",
        poster: "assets/filmes/ironmen.png",
        trailer: "https://www.youtube.com/embed/8ugaeA-nMTc",
        price: { regular: 35, half: 17.50 },
        featured: true,
        sessions: [
            { date: "2026-01-15", times: ["13:30", "16:00", "18:30", "21:00"], type: "2D", room: "Sala 5" },
            { date: "2026-01-15", times: ["14:00", "19:00"], type: "3D", room: "Sala 6" },
            { date: "2026-01-16", times: ["13:30", "16:00", "18:30", "21:00"], type: "2D", room: "Sala 5" },
            { date: "2026-01-17", times: ["15:00", "20:00"], type: "3D", room: "Sala 6" }
        ]
    },
    {
        id: 6,
        title: "O Jogo da Imitação",
        genre: ["Drama", "Thriller", "Guerra"],
        duration: 114,
        rating: "12",
        year: 2014,
        director: "Morten Tyldum",
        cast: ["Benedict Cumberbatch", "Keira Knightley", "Matthew Goode", "Charles Dance"],
        synopsis: "A história real de Alan Turing, matemático britânico que decifrou os códigos nazistas da Enigma durante a Segunda Guerra Mundial.",
        poster: "assets/filmes/jogodaimitacao.png",
        trailer: "https://www.youtube.com/embed/nuPZUUED5uk",
        price: { regular: 30, half: 15 },
        featured: false,
        sessions: [
            { date: "2026-01-15", times: ["14:00", "19:00"], type: "2D", room: "Sala 7" },
            { date: "2026-01-16", times: ["14:00", "19:00"], type: "2D", room: "Sala 7" },
            { date: "2026-01-17", times: ["16:00", "20:30"], type: "2D", room: "Sala 7" }
        ]
    },
    {
        id: 7,
        title: "Ilha do Medo",
        genre: ["Mistério", "Thriller", "Drama"],
        duration: 138,
        rating: "14",
        year: 2010,
        director: "Martin Scorsese",
        cast: ["Leonardo DiCaprio", "Mark Ruffalo", "Ben Kingsley", "Michelle Williams"],
        synopsis: "Em 1954, um detetive investiga o desaparecimento de uma paciente de um hospital para criminosos insanos em uma ilha remota.",
        poster: "assets/filmes/ilhadomedo.png",
        trailer: "https://www.youtube.com/embed/5iaYLCiq5RM",
        price: { regular: 30, half: 15 },
        featured: false,
        sessions: [
            { date: "2026-01-15", times: ["15:30", "21:00"], type: "2D", room: "Sala 8" },
            { date: "2026-01-16", times: ["15:30", "21:00"], type: "2D", room: "Sala 8" },
            { date: "2026-01-17", times: ["17:30", "22:00"], type: "2D", room: "Sala 8" }
        ]
    }
];

// Cinema information
const cinemaInfo = {
    name: "Sugarland Theaters",
    slogan: "Onde cada história ganha vida",
    address: {
        street: "Rua das Estrelas, 1001",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zip: "01234-567"
    },
    contact: {
        phone: "(11) 3456-7890",
        whatsapp: "(11) 98765-4321",
        email: "contato@sugarlandtheaters.com.br"
    },
    hours: {
        weekday: "12:00 - 00:00",
        weekend: "10:00 - 01:00"
    },
    social: {
        instagram: "@sugarlandtheaters",
        facebook: "SugarlandTheatersBR",
        twitter: "@sugarland_br"
    }
};

// Available genres for filtering
const genres = [
    "Ação",
    "Aventura",
    "Comédia",
    "Crime",
    "Drama",
    "Ficção Científica",
    "Guerra",
    "História",
    "Mistério",
    "Romance",
    "Thriller"
];

// Rating classifications
const ratings = [
    { value: "L", label: "Livre", color: "#00b894" },
    { value: "10", label: "10 anos", color: "#0984e3" },
    { value: "12", label: "12 anos", color: "#fdcb6e" },
    { value: "14", label: "14 anos", color: "#e17055" },
    { value: "16", label: "16 anos", color: "#d63031" },
    { value: "18", label: "18 anos", color: "#2d3436" }
];

// Session types
const sessionTypes = [
    { value: "2D", label: "2D", icon: "🎬" },
    { value: "3D", label: "3D", icon: "👓" },
    { value: "IMAX", label: "IMAX", icon: "⭐" },
    { value: "4DX", label: "4DX", icon: "🎢" }
];
