from collections import defaultdict
import heapq

def dijskstra(n, edges, k):
    graph = defaultdict(list)
    for src, dest, w in  edges:
        graph[src].append((dest, w))
        graph[dest].append((src, w))

    node_cost = {i: float("inf") for i in range(n)}
    node_cost[k] = 0
    q = [(0, k)]
    while q:
        cost, node = heapq.heappop(q)
        for w, c in graph[node]:
            new_cost = w + cost
            if new_cost < node_cost[node]:
                node_cost[c] = new_cost
                heapq.heappush(q, (new_cost, c))
    
    v = max(node_cost.values())
    return -1 if v == float("inf") else v