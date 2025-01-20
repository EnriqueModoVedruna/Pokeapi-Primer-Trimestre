# Pokeapi-Primer-Trimestre
Este proyecto consiste en hacer una llamada a la API de Pokémon y obener los datos de los pokémon para así poder hacer una pokedex con algunas funciones extra.

Para utilizar esta aplicacion simplemente tienes que hacer un fork / descartgarlo en tu ordenador y abrir alguno de los 2 **index.html**

## index.html
En este documento tenemos cosas como la implementacion del titulo, barra de busqueda, boton para cambiar el idioma y un contenedor que permite almacenar la informacion de los pokémon.
````html
<main>
        <div class="pokemon-container"></div>
        <div class="pagination">
            <button id="prev-btn" disabled>Anterior</button>
            <button id="next-btn">Siguiente</button>
        </div>
</main>
````
Tambien hay botones para cambiar de pokemon por numero de la pokedex.

## script.js
Aquí es donde pasa todo, se hace la peticion a la api, se crean los contenedores (y los valores) que almacenan a los pokémon... Basicamente todo lo importante de la aplicación.

Algunas cosas a resaltar podrian ser:
Las naturalezas, las cuales son creadas y no vienen de la api:
````js
// Naturalezas y sus efectos
const naturalezas = {
    Adamant: { aumenta: 'attack', reduce: 'special-attack' },
    Bold: { aumenta: 'defense', reduce: 'attack' },
    Brave: { aumenta: 'attack', reduce: 'speed' },
    Calm: { aumenta: 'special-defense', reduce: 'attack' },
    Modest: {aumenta: 'special-attack', reduce: 'attack' },
    Timid: {aumenta: 'speed', reduce: 'attack' },
    Hardy: {aumenta: 'attack', reduce: 'attack'},
    Lonely: {aumenta: 'attack', reduce: 'defense'},
    Docile: {aumenta: 'defense', reduce: 'defense'},
    Mild: {aumenta: 'special-attack', reduce: 'defense'},
    Gentle: {aumenta: 'special-attack', reduce: 'defense'},
    Hasty: {aumenta: 'speed', reduce: 'defense'},
    // Se podrian añadir todas las naturalezas, pero son demasiadas, con estas ya va bien
};
````
Funciones para calcular las estadisticas de los pokémon:
````js
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

    // Recalcular cada stat dependiendo de la naturaleza seleccionada
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
````
