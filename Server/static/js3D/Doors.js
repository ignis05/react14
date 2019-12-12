class Doors {
    constructor() {
        var container = new THREE.Object3D()
        var part1 = new THREE.Mesh(Settings.hexDoorsGeometry, Settings.hexWallMaterial);
        var part2 = part1.clone()
        part1.position.x = (Settings.radius * 0.35)
        part2.position.x = -(Settings.radius * 0.35)
        container.add(part1)
        container.add(part2)
        container.walls = []
        container.walls.push(part1)
        container.walls.push(part2)
        return container
    }
}