async function loadTopic() {

    const parameters = new URLSearchParams(window.location.search);
    const topicId = parameters.get("id");

    if (!topicId) {
        showError("Geen onderwerp geselecteerd.");
        return;
    }

    try {

        const response = await fetch("./data/topics.json");

        if (!response.ok) {
            throw new Error("topics.json kon niet geladen worden.");
        }

        const data = await response.json();

        const topic = data.topics.find(item => item.id === topicId);

        if (!topic) {
            showError("Onderwerp niet gevonden.");
            return;
        }

        document.title = `${topic.title} | STEMWORX`;

        document.getElementById("topic-title").textContent =
            topic.title;

        document.getElementById("topic-description").textContent =
            topic.description;

        buildBreadcrumb(data.topics, topic);

        const container =
            document.getElementById("tile-grid");

        container.innerHTML = "";

        topic.children.forEach(child => {

            const tile = document.createElement("article");

            tile.className = "tile";

            tile.innerHTML = `
                <div class="tile-icon">
                    ${child.icon}
                </div>

                <div>
                    <h2>${child.title}</h2>
                    <p>${child.description}</p>
                </div>
            `;

            tile.addEventListener("click", () => {

                if (child.type === "topic") {

                    window.location.href =
                        `./topic.html?id=${encodeURIComponent(child.target)}`;

                }

                if (child.type === "page") {

                    window.location.href =
                        child.target;

                }

            });

            container.appendChild(tile);

        });

    }

    catch (error) {

        console.error(error);

        showError(
            "Het onderwerp kon niet geladen worden."
        );

    }

}


function showError(message) {

    document.getElementById("topic-title").textContent =
        "Oeps";

    document.getElementById("topic-description").textContent =
        message;

}


function buildBreadcrumb(topics, currentTopic) {

    const breadcrumb =
        document.getElementById("breadcrumb");

    breadcrumb.innerHTML = "";

    const path = [];
    let topic = currentTopic;

    while (topic) {

        path.unshift(topic);

        if (!topic.parent) {
            break;
        }

        topic = topics.find(
            item => item.id === topic.parent
        );

    }

    const home = document.createElement("a");

    home.textContent = "STEMWORX";
    home.href = "./index.html";

    breadcrumb.appendChild(home);

    path.forEach(topic => {

        const separator =
            document.createElement("span");

        separator.textContent = " › ";

        breadcrumb.appendChild(separator);

        const link =
            document.createElement("a");

        link.textContent = topic.title;

        link.href =
            `./topic.html?id=${encodeURIComponent(topic.id)}`;

        breadcrumb.appendChild(link);

    });

}


loadTopic();