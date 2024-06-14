document.addEventListener("DOMContentLoaded", () => {
    drawGraph();
});

const positions = {
    'A': { x: 50, y: 50 },
    'B': { x: 150, y: 150 },
    'C': { x: 50, y: 250 },
    'D': { x: 250, y: 150 },
    'E': { x: 350, y: 50 },
    'F': { x: 450, y: 250 },
    'G': { x: 250, y: 300 },
    'H': { x: 150, y: 350 }
};

const graph = {
    'A': { 'B': 1, 'C': 4, 'E': 3 },
    'B': { 'A': 1, 'C': 2, 'D': 5 },
    'C': { 'A': 4, 'B': 2, 'D': 1, 'F': 4 },
    'D': { 'B': 5, 'C': 1, 'G': 2 },
    'E': { 'A': 3, 'F': 2 },
    'F': { 'C': 4, 'E': 2, 'H': 3 },
    'G': { 'D': 2, 'H': 1 },
    'H': { 'F': 3, 'G': 1 }
};

function drawGraph() {
    const container = document.getElementById("graph-container");

    // Draw edges
    for (let node in graph) {
        for (let neighbor in graph[node]) {
            drawEdge(container, positions[node], positions[neighbor], graph[node][neighbor]);
        }
    }

    // Draw nodes
    for (let node in positions) {
        drawNode(container, node, positions[node]);
    }
}

function drawNode(container, node, position) {
    const div = document.createElement("div");
    div.className = "node";
    div.style.left = position.x + "px";
    div.style.top = position.y + "px";
    div.textContent = node;
    container.appendChild(div);
}

function drawEdge(container, pos1, pos2, weight) {
    const line = document.createElement("div");
    line.className = "edge";
    line.style.left = pos1.x + "px"; // Adjust positioning if necessary
    line.style.top = pos1.y + "px";  // Adjust positioning if necessary
    line.style.width = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)) + "px";
    line.style.transformOrigin = "left";
    line.style.transform = `rotate(${Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)}rad)`;
    container.appendChild(line);
}

function findShortestPath() {
    const startNode = document.getElementById("start-node").value;
    const endNode = document.getElementById("end-node").value;

    fetch('/shortest-path', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start: startNode, end: endNode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            displayPath(data.path);
        }
    });
}

function displayPath(path) {
    const resultContainer = document.getElementById("result-container");
    resultContainer.textContent = "Shortest path: " + path.join(" -> ");
}
