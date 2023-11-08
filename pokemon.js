/*
 * Name: Yen Ton
 * Date: November 07, 2023
 * This is the JS to implement the UI for Pokemon project
 */

"use strict";

(function() {
    const BASE_API_URL = "https://pokeapi.co/api/v2/pokemon/";
    const TOTAL_POKEMON = 898; // Total number of Pokémon as of Generation VIII

    function statusCheck(response) {
        if (!response.ok) {
            if (response.status === 404) {
                throw Error("This is not a Pokémon. Please type in a Pokémon.");
            }
            throw Error("Error in request: " + response.statusText);
        }
        return response;
    }

    function handleError(error) {
        const infoSection = document.getElementById("pokemon-info");
        infoSection.innerHTML = ""; // Clear any previous content
        infoSection.textContent = error.message || "An unexpected error occurred.";
    }

    function displayPokemon(data) {
        const infoSection = document.getElementById("pokemon-info");
        infoSection.innerHTML = ""; // Clear previous data

        // Name
        const name = document.createElement("h2");
        name.textContent = "Name: " + data.name.charAt(0).toUpperCase() + data.name.slice(1);
        infoSection.appendChild(name);

        console.log(data);
        console.log(data.sprites);

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
        if (data.game_indices.length > 0) {
            games.textContent = "Games: " + data.game_indices.map(g => g.version.name).join(", ");
        } else {
            games.textContent = "The Pokémon is not in any games.";
        }
        infoSection.appendChild(games);
    }

    function fetchPokemonData(pokemonName) {
        fetch(BASE_API_URL + pokemonName.toLowerCase())
            .then(statusCheck)
            .then(response => response.json())
            .then(displayPokemon)
            .catch(handleError);
    }

    function searchPokemon() {
        const pokemonName = document.getElementById("pokemon-search-input").value.trim();
        if (pokemonName) {
            fetchPokemonData(pokemonName);
        } else {
            handleError(new Error("Please type in a Pokémon name."));
        }
    }

    function fetchRandomPokemon() {
        const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
        fetchPokemonData(randomId.toString());
    }

    window.addEventListener("load", function() {
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", searchPokemon);

        const randomButton = document.getElementById("random-button");
        randomButton.addEventListener("click", fetchRandomPokemon);

        // Also trigger search on enter key press in the input field
        const searchInput = document.getElementById("pokemon-search-input");
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchPokemon();
            }
        });
    });
})();
