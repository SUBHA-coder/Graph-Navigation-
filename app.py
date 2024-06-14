from flask import Flask, request, jsonify, render_template
import heapq

app = Flask(__name__)

# Define the graph with nodes and edges
graph = {
    'A': {'B': 1, 'C': 4},
    'B': {'A': 1, 'C': 2, 'D': 5},
    'C': {'A': 4, 'B': 2, 'D': 1},
    'D': {'B': 5, 'C': 1}
}

# Dijkstra's algorithm to find the shortest path
def dijkstra(graph, start):
    queue = []
    heapq.heappush(queue, (0, start))
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    shortest_path = {}

    while queue:
        current_distance, current_node = heapq.heappop(queue)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(queue, (distance, neighbor))
                shortest_path[neighbor] = current_node

    return distances, shortest_path

# Function to reconstruct the shortest path
def reconstruct_path(shortest_path, start, end):
    path = []
    current_node = end

    while current_node != start:
        path.append(current_node)
        current_node = shortest_path[current_node]

    path.append(start)
    path.reverse()
    return path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/shortest-path', methods=['POST'])
def shortest_path():
    data = request.get_json()
    start = data['start']
    end = data['end']
    if start not in graph or end not in graph:
        return jsonify({'error': 'Invalid nodes entered.'}), 400
    distances, shortest_path = dijkstra(graph, start)
    path = reconstruct_path(shortest_path, start, end)
    return jsonify({'path': path})

if __name__ == '__main__':
    app.run(debug=True)
