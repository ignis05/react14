class Ring extends THREE.Mesh {
    constructor(geometry, material) {
        super(geometry, material) // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.rotation.x = Math.PI / 2
        // console.log(this)
    }
}