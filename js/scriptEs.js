const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
};
document.addEventListener('DOMContentLoaded', () => {
    const languageBtn = document.getElementById('change-language-btn');

    languageBtn.addEventListener('click', () => {
        // Redirige al documento en inglés
        window.location.href = '../index.html';
    });

    console.log("Pokedex en español cargado.");
});


// Naturalezas y sus efectos
const naturalezas = {
    Firme: { aumenta: 'attack', reduce: 'special-attack' },
    Osada: { aumenta: 'defense', reduce: 'attack' },
    Audaz: { aumenta: 'attack', reduce: 'speed' },
    Serena: { aumenta: 'special-defense', reduce: 'attack' },
    Modesta: {aumenta: 'special-attack', reduce: 'attack' },
    Timida: {aumenta: 'speed', reduce: 'attack' },
    Fuerte: {aumenta: 'attack', reduce: 'attack'},
    Huraña: {aumenta: 'attack', reduce: 'defense'},
    Dócil: {aumenta: 'defense', reduce: 'defense'},
    Afable: {aumenta: 'special-attack', reduce: 'defense'},
    Amable: {aumenta: 'special-attack', reduce: 'defense'},
    Activa: {aumenta: 'speed', reduce: 'defense'},
};

// Fórmulas para calcular estadísticas totales
function calcularStatsTotales(baseStats, iv, ev, nivel, multiplicador) {
    if (baseStats === 'hp') {
        return Math.floor(((2 * iv + ev / 4) * nivel) / 100 + nivel + 10);
    } else {
        return Math.floor((((2 * iv + ev / 4) * nivel) / 100 + 5) * multiplicador);
    }
}

// Funcion de calcular stats finales
function calcularStatsFinales(baseStats, ivs, evs, nivel, naturaleza) {
    console.log("Base Stats recibidos:", baseStats);
    console.log("IVs antes de llamar a la función:", ivs);
    console.log("EVs antes de llamar a la función:", evs);
    console.log("Naturaleza seleccionada:", naturaleza);
    const stats = { ...baseStats }; // Copiar stats base
    const efecto = naturalezas[naturaleza];

    // Recalcular cada stat
    Object.keys(stats).forEach(stat => {
        const multiplicador = efecto
            ? stat === efecto.aumenta
                ? 1.1
                : stat === efecto.reduce
                ? 0.9
                : 1
            : 1;

        stats[stat] = calcularStatsTotales(baseStats[stat], ivs[stat], evs[stat], nivel, multiplicador);
    });
    console.log("Efecto de la naturaleza:", efecto);

    console.log("Stats calculados dentro de la función:", stats);
    return stats;
}


// Función getMinPoke
function getMinPoke({ foto, nombre, numero, tipos }) {
    const card = document.createElement('div');
    card.className = 'poke-card';
    card.innerHTML = `
        <img src="${foto}" alt="${nombre}" class="poke-img">
        <div class="poke-name">${nombre}</div>
        <div class="poke-id">Nº ${numero}</div>
        <div class="poke-types">
            ${tipos.map(tipo => `<span style="color:${typeColors[tipo]}">${tipo}</span>`).join('')}
        </div>
    `;
    card.addEventListener('click', () => {
        renderPokemonDetails(numero);
    });
    return card;
}

async function getAPoke(pokemon) {
    const { foto, nombre, numero, tipos, habilidades, baseStats } = pokemon;

    
    const ivs = { hp: 31, attack: 31, defense: 31, speed: 31, 'special-attack': 31, 'special-defense': 31 };
    const evs = { hp: 0, attack: 0, defense: 0, speed: 0, 'special-attack': 0, 'special-defense': 0 };
    let nivel = 50;

    const card = document.createElement('div');
    card.className = 'poke-card detailed';

    const habilidadesNormales = habilidades.filter(h => !h.oculta).map(h => h.nombre).join(', ');
    const habilidadOculta = habilidades.find(h => h.oculta)?.nombre || 'Ninguna';

    // Generar las estadísticas base
    const baseStatsHtml = Object.entries(baseStats)
        .map(([stat, value]) => `<p>${stat.toUpperCase()}: ${value}</p>`)
        .join('');

    card.innerHTML = `
        <img src="${foto}" alt="${nombre}" class="poke-img">
        <div class="poke-name">${nombre} (Nº ${numero})</div>
        <div class="poke-types">
            ${tipos}
        </div>
        <h3>Habilidades</h3>
        <p>Normales: ${habilidadesNormales}</p>
        <p>Oculta: ${habilidadOculta}</p>
        <h3>Estadisticas Base</h3>
        <div class="base-stats">
            ${baseStatsHtml}
        </div>
        <h3>IVs y EVs</h3>
        <div class="ivs-container">
            ${Object.keys(ivs).map(stat => `
                <div class="stat">
                    <label>${stat.toUpperCase()}: </label>
                    IV: <input type="number" class="iv-input" data-stat="${stat}" min="0" max="31" value="${ivs[stat]}">
                    EV: <input type="number" class="ev-input" data-stat="${stat}" min="0" max="252" value="${evs[stat]}">
                </div>
            `).join('')}
        </div>
        <h3>Seleccionar naturaleza</h3>
        <select id="naturaleza-select">
            ${Object.keys(naturalezas).map(nat => `<option value="${nat}">${nat}</option>`).join('')}
        </select>
        <h3>Seleccionar nivel</h3>
        <input type="number" id="nivel-input" min="1" max="100" value="${nivel}">
        <div class="final-stats">
            <h3>Estadisticas Finales:</h3>
            <div id="stats-calculation"></div>
        </div>
    `;

    console.log("Stats", baseStats);
    card.style.backgroundColor = typeColors[tipos[0]];

    const statsContainer = card.querySelector('#stats-calculation');
    const selectNaturaleza = card.querySelector('#naturaleza-select');
    const nivelInput = card.querySelector('#nivel-input');
    const ivInputs = card.querySelectorAll('.iv-input');
    const evInputs = card.querySelectorAll('.ev-input');

    // Función para actualizar las estadísticas finales
    function actualizarStats() {
        const naturalezaSeleccionada = selectNaturaleza.value;
        const statsFinales = calcularStatsFinales(baseStats, ivs, evs, nivel, naturalezaSeleccionada);

        console.log("Naturaleza seleccionada:", naturalezaSeleccionada);
        console.log("Nivel seleccionado:", nivel);
        console.log("Stats Finales calculados:", statsFinales);


        // Renderizar estadísticas en el contenedor
        statsContainer.innerHTML = Object.entries(statsFinales).map(([stat, valor]) => `
            <p>${stat.toUpperCase()}: ${valor}</p>
        `).join('');
    }

    // Eventos para capturar cambios en los inputs
    nivelInput.addEventListener('input', (e) => {
        nivel = parseInt(e.target.value) || 1;
        actualizarStats();
    });

    ivInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const stat = e.target.dataset.stat;
            ivs[stat] = parseInt(e.target.value) || 0;
            actualizarStats();
        });
    });

    evInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const stat = e.target.dataset.stat;
            evs[stat] = parseInt(e.target.value) || 0;
            actualizarStats();
        });
    });

    selectNaturaleza.addEventListener('change', actualizarStats);

    // Inicializar estadísticas finales
    actualizarStats();

    return card;
}



// Paginación
let currentPage = 1; // Página inicial
const totalPokemon = 1010; // Número total de Pokémon en la PokeAPI

async function renderPokemonPage() {
    const container = document.querySelector('.pokemon-container');
    container.innerHTML = ''; // Limpiar el contenedor antes de mostrar el nuevo Pokémon

    try {
        // Llamada a la API para obtener el Pokémon correspondiente a la página actual
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPage}`);
        const data = await response.json();

        // Crear la tarjeta del Pokémon
        const card = getMinPoke({
            foto: data.sprites.front_default,
            nombre: data.name,
            numero: data.id,
            tipos: data.types.map(t => t.type.name),
        });

        container.appendChild(card);

        // Actualizar el estado de los botones
        document.querySelector('#prev-btn').disabled = currentPage === 1;
        document.querySelector('#next-btn').disabled = currentPage === totalPokemon;

    } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
        container.innerHTML = '<p>Error al cargar el Pokémon. Inténtalo de nuevo más tarde.</p>';
    }
}

function setupPagination() {
    document.querySelector('#prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPokemonPage();
        }
    });

    document.querySelector('#next-btn').addEventListener('click', () => {
        if (currentPage < totalPokemon) {
            currentPage++;
            renderPokemonPage();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderPokemonPage(); // Mostrar el primer Pokémon
    setupPagination(); // Configurar la paginación
});

// Renderizar detalles de un Pokémon
async function renderPokemonDetails(numero) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${numero}`);
    const data = await response.json();

    // Extraer estadísticas base del Pokémon
    const baseStats = data.stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});

    console.log("Base Stats:", baseStats); // Verificar las estadísticas base


    const card = await getAPoke({
        foto: data.sprites.front_default,
        nombre: data.name,
        numero: data.id,
        tipos: data.types.map(t => t.type.name),
        habilidades: data.abilities.map(abil => ({
            nombre: abil.ability.name,
            oculta: abil.is_hidden,
        })),
        baseStats,
        ivs: data.stats.reduce((acc, stat) => {
            acc[stat.stat.name] = stat.base_stat;
            return acc;
        }, {}),
        naturalezas: Object.keys(naturalezas),
    });

    currentPage = data.id; //Con esta asigancion manual hacemos que si entramos en el pokemos que hemos buscado, la página cambiará a la equivalente a la del numero de ese pokemon.

    const container = document.querySelector('.pokemon-container');
    container.innerHTML = '';
    container.appendChild(card);
}

// Renderizar estadísticas
const renderPokemonStats = (stats) => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount)
        pokeStats.appendChild(statElement);
    })
}

// Buscador
document.querySelector('#search-btn').addEventListener('click', async () => {
    const query = document.querySelector('#search').value.toLowerCase();
    if (query.length >= 3) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (response.ok) {
            const data = await response.json();
            const card = getMinPoke({
                foto: data.sprites.front_default,
                nombre: data.name,
                numero: data.id,
                tipos: data.types.map(t => t.type.name),
            });

            currentPage = data.id;
            const container = document.querySelector('.pokemon-container');
            container.innerHTML = '';
            container.appendChild(card);
        } else {
            const card = getMinPoke({
                foto: './img/poke-shadow.png',
                nombre: 'Pokémon no encontrado',
                numero: 0,
                tipos: [],
            });

            // Una adicion adicional iba a ser que si buscabas algo que no existia, te mandase a la pagina 1 otra vez
            // currentPage = 0;
            const container = document.querySelector('.pokemon-container');
            container.innerHTML = '';
            container.appendChild(card);
        }
    } else {
        alert('Por favor, introduce al menos 3 caracteres.');
    }
});

// Inicializar
renderPokemonPage();