export default class Pathfinding {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
    }
    
    // A* pathfinding algorithm
    findPath(startX, startY, endX, endY, grid) {
        const openSet = [];
        const closedSet = [];
        
        const startNode = {
            x: startX,
            y: startY,
            g: 0,
            h: this.heuristic(startX, startY, endX, endY),
            f: 0,
            parent: null
        };
        startNode.f = startNode.g + startNode.h;
        openSet.push(startNode);
        
        while (openSet.length > 0) {
            // Find node with lowest f score
            let current = openSet[0];
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < current.f) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            // Remove from open set
            openSet.splice(currentIndex, 1);
            closedSet.push(current);
            
            // Check if reached end
            if (current.x === endX && current.y === endY) {
                return this.reconstructPath(current);
            }
            
            // Get neighbors
            const neighbors = this.getNeighbors(current.x, current.y, grid);
            
            for (const neighbor of neighbors) {
                // Skip if in closed set
                if (closedSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    continue;
                }
                
                // Check if walkable
                if (!this.isWalkable(neighbor.x, neighbor.y, grid)) {
                    continue;
                }
                
                const gScore = current.g + 1;
                
                // Check if in open set
                const existingNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
                
                if (!existingNode) {
                    neighbor.g = gScore;
                    neighbor.h = this.heuristic(neighbor.x, neighbor.y, endX, endY);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                    openSet.push(neighbor);
                } else if (gScore < existingNode.g) {
                    existingNode.g = gScore;
                    existingNode.f = existingNode.g + existingNode.h;
                    existingNode.parent = current;
                }
            }
        }
        
        // No path found
        return null;
    }
    
    heuristic(x1, y1, x2, y2) {
        // Manhattan distance
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    
    getNeighbors(x, y, grid) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 1, y: 0 },  // Right
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }  // Left
        ];
        
        for (const dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;
            
            if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
                neighbors.push({ x: nx, y: ny, g: 0, h: 0, f: 0, parent: null });
            }
        }
        
        return neighbors;
    }
    
    isWalkable(x, y, grid) {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
            return false;
        }
        return !grid[x][y].hasTower && !grid[x][y].isPath;
    }
    
    reconstructPath(endNode) {
        const path = [];
        let current = endNode;
        
        while (current !== null) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }
        
        return path;
    }
}
