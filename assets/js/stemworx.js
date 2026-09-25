async function loadNavigation() {
    try {
        const response = await fetch("./data/navigation.json");

        if (!response.ok) {
            throw new Error("navigation.json kon niet geladen worden.");
        }

        const data = await response.json();

        document.getElementById("app-name").textContent = data.app.name;

        const container = document.getElementById("tile-grid");

        data.categories.forEach(category => {
            const tile = document.createElement("article");
            tile.className = "tile";

            tile.innerHTML = `
                <div class="tile-icon">${category.icon}</div>

                <div>
                    <h2>${category.title}</h2>
                    <p>${category.description}</p>
                </div>
            `;

            tile.addEventListener("click", () => {
                console.log("Open:", category.path);
            });

            container.appendChild(tile);
        });

    } catch (error) {
        console.error(error);

        document.getElementById("tile-grid").innerHTML =
            "<p>De STEMWORX-navigatie kon niet geladen worden.</p>";
    }
}

loadNavigation();