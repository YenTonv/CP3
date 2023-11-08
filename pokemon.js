/*
 * Name: Yen Ton
 * Date: November 07, 2023
 * This JavaScript file implements the user interface for a Pokémon project.
 * It allows users to search for details on Pokémon by name or display a random Pokémon.
 */

"use strict";

(function() {
    /** Base URL for the Pokémon API */
    const BASE_API_URL = "https://pokeapi.co/api/v2/pokemon/";
    /** Total number of Pokémon as of Generation VIII */
    const TOTAL_POKEMON = 898;

    /**
     * Checks the response status and throws an error for non-OK statuses.
     * @param {Response} response - The fetch response object.
     * @returns {Response} The response object if the request was successful.
     * @throws Will throw an error if the response is not ok.
     */
    function statusCheck(response) {
        if (!response.ok) {
            if (response.status === 404) {
                throw Error("This is not a Pokémon. Please type in a Pokémon.");
            }
            throw Error("Error in request: " + response.statusText);
        }
        return response;
    }

    /**
     * Handles errors by displaying an error message in the info section.
     * @param {Error} error - The error object to handle.
     */
    function handleError(error) {
        const infoSection = document.getElementById("pokemon-info");
        infoSection.innerHTML = ""; // Clear any previous content
        infoSection.textContent = error.message || "An unexpected error occurred.";
    }

    /**
     * Displays Pokémon data in the UI.
     * @param {Object} data - The Pokémon data object to display.
     */
    function displayPokemon(data) {
        const infoSection = document.getElementById("pokemon-info");
        infoSection.innerHTML = ""; // Clear previous data

        // Name
        const name = document.createElement("h2");
        name.textContent = "Name: " + data.name.charAt(0).toUpperCase() + data.name.slice(1);
        infoSection.appendChild(name);

        // Image or Placeholder
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        img.src = data.sprites.front_default || "";
        img.alt = "Image of " + data.name;
        img.onerror = () => {
            imgContainer.textContent = "No image available";
        };
        imgContainer.appendChild(img);
        infoSection.appendChild(imgContainer);

        // Height
        const height = document.createElement("p");
        height.textContent = "Height: " + data.height;
        infoSection.appendChild(height);

        // Weight
        const weight = document.createElement("p");
        weight.textContent = "Weight: " + data.weight;
        infoSection.appendChild(weight);

        // Abilities
        const abilities = document.createElement("p");
        abilities.textContent = "Abilities: " + data.abilities.map(a => a.ability.name).join(", ");
        infoSection.appendChild(abilities);

        // Games
        const games = document.createElement("p");
        games.textContent = data.game_indices.length > 0 ? 
            "Games: " + data.game_indices.map(g => g.version.name).join(", ") :
            "The Pokémon is not in any games.";
        infoSection.appendChild(games);
    }

    /**
     * Fetches data for a given Pokémon name and displays it.
     * @param {string} pokemonName - The name of the Pokémon to fetch data for.
     */
    function fetchPokemonData(pokemonName) {
        fetch(BASE_API_URL + pokemonName.toLowerCase())
            .then(statusCheck)
            .then(response => response.json())
            .then(displayPokemon)
            .catch(handleError);
    }

    /**
     * Initiates a search for the Pokémon entered in the search input.
     */
    function searchPokemon() {
        const pokemonName = document.getElementById("pokemon-search-input").value.trim();
        if (pokemonName) {
            fetchPokemonData(pokemonName);
        } else {
            handleError(new Error("Please type in a Pokémon name."));
        }
    }

    /**
     * Fetches and displays data for a random Pokémon.
     */
    function fetchRandomPokemon() {
        const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
        fetchPokemonData(randomId.toString());
    }

    // Sets up event listeners once the window has loaded
    window.addEventListener("load", function() {
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", searchPokemon);

        const randomButton = document.getElementById("random-button");
        randomButton.addEventListener("click", fetchRandomPokemon);

        const searchInput = document.getElementById("pokemon-search-input");
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchPokemon();
            }
        });
    });
})();
