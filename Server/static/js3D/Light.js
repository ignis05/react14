class Light {
    constructor() {
        var container = new THREE.Object3D();
        this.light = new THREE.PointLight(0xffffff, 1, 1000);
        //light.castShadow = true
        container.add(this.light);
        var mesh = new THREE.Mesh(Settings.Icosahedron, Settings.yellowWireframeMaterial)
        container.add(mesh);
        this.container = container
    }
    setIntensity(x) {
        this.light.intensity = x
    }
    setHeight(x) {
        this.container.position.y = x
    }
}