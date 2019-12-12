var Settings = {
    radius: 200,
    height: 100,
    create() {
        this.hexWallMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/textures/brick_wall.jpg"),
        })
        this.hexWallGeometry = new THREE.BoxGeometry(this.radius, this.height, this.radius * 0.1)
        this.hexDoorsGeometry = new THREE.BoxGeometry(this.radius * 0.4, this.height, this.radius * 0.1)
        this.hexSpaces = this.radius * Math.sqrt(3) / 2
        this.hexFloorGeometry = new THREE.CylinderGeometry(this.radius , this.radius, 5, 6);
        this.Icosahedron = new THREE.IcosahedronBufferGeometry(25)
        this.yellowWireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            wireframe: true,
        })
        this.TreasureGeometry = new THREE.BoxGeometry(this.radius / 2, this.radius / 2, this.radius / 2);
        this.TreasureMaterial = [];
        this.TreasureMaterial.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/static/textures/emerald_block.png') }));
        this.TreasureMaterial.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/static/textures/emerald_block.png') }));
        this.TreasureMaterial.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/static/textures/emerald_block.png') }));
        this.TreasureMaterial.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/static/textures/emerald_block.png') }));
        this.TreasureMaterial.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/static/textures/emerald_block.png') }));
        this.TreasureMaterial.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('/static/textures/emerald_block.png') }));
    },
    playerMaterial: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
    playerGeometry: new THREE.BoxGeometry(50, 50, 50, 5, 5, 5),
    playerMaterialURL: "/static/models/skeleton/skeleton_blue.png",
    playerGeometryURL: "/static/models/skeleton/skeleton_armed.json",
    allyMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    allyGeometry: new THREE.BoxGeometry(50, 50, 50, 5, 5, 5),
    allyMaterialURL: "/static/models/unit01/unit01.png",
    allyGeometryURL: "/static/models/unit01/unit01.json",
    ringGeometry: new THREE.RingGeometry(25, 35, 8),
    ringMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
}
Settings.create()