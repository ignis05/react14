class Player {
    constructor() {
        this.model = new Model()
        this.container = new THREE.Object3D()
        this.allies = []
    }

    loadModel(geometryURL, materialURL) {
        return new Promise(async resolve => {
            let mesh = await this.model.loadModel(geometryURL, materialURL)
            this.create(mesh)
            resolve()
        })
    }

    create(mesh) {
        this.mesh = mesh
        this.mesh.name = "player"
        this.mesh.rotation.y = Math.PI / 2
        this.container.add(this.mesh)
        this.axes = new THREE.AxesHelper(30)
        this.axes.rotation.y = -Math.PI / 2
        this.mesh.add(this.axes)
        this.mesh.position.y = 25 + (Settings.radius * 0.1)
    }

    addTo(scene) {
        scene.add(this.container)
    }
}