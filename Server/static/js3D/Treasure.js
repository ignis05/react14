class Treasure {
    constructor() {
        this.cube = new THREE.Mesh(Settings.TreasureGeometry, Settings.TreasureMaterial)
        //shadow:
        //cube.castShadow = true
        return this.cube
    }
}