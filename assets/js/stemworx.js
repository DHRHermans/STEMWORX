console.log("STEMWORX JS - dynamische navigatie geladen");

async function loadNavigation() {

    try {

        const response = await fetch("./data/navigation.json");

        if (!response.ok) {
            throw new Error("navigation.json kon niet geladen worden.");
        }

        const data = await response.json();

        const appName = document.getElementById("app-name");

        if (appName) {
            appName.textContent = data.app.name;
        }

        const container = document.getElementById("tile-grid");

        if (!container) {
            throw new Error("tile-grid werd niet gevonden.");
        }

        container.innerHTML = "";

        data.categories.forEach(category => {

            const tile = document.createElement("article");

            tile.className = "tile";

            tile.innerHTML = `
                <div class="tile-icon">
                    ${category.icon}
                </div>

                <div>
                    <h2>${category.title}</h2>
                    <p>${category.description}</p>
                </div>
            `;

            tile.addEventListener("click", () => {

                console.log("GEKLIKT:", category.id);

                window.location.href =
                    `./topic.html?id=${encodeURIComponent(category.id)}`;

            });

            container.appendChild(tile);

        });

    } catch (error) {

        console.error("Fout bij laden STEMWORX-navigatie:", error);

        const container = document.getElementById("tile-grid");

        if (container) {
            container.innerHTML =
                "<p>De STEMWORX-navigatie kon niet geladen worden.</p>";
        }

    }

}


loadNavigation();