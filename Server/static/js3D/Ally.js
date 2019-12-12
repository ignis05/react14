class Ally {
    constructor() {
        this.follow = false
        this.model = new Model()
        this.container = new THREE.Object3D()
        this.vector = null
        this.directionVect
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
        this.mesh.name = "ally"
        this.mesh.rotation.y = Math.PI / 2
        this.container.add(this.mesh)
        this.ring = new Ring(Settings.ringGeometry, Settings.ringMaterial)
        this.ring.position.y = (Settings.radius * 0.1)
        this.ring.visible = false
        this.container.add(this.ring)
        // this.axes = new THREE.AxesHelper(200)
        // this.axes.rotation.y = -Math.PI / 2
        // this.mesh.add(this.axes)
        this.mesh.position.y = 25 + (Settings.radius * 0.1)
    }

    addTo(scene) {
        scene.add(this.container)
    }
}