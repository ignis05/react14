class Hex3D {
    constructor(location, ui) {
        // console.log("creating hex");

        var radius = Settings.radius

        var container = new THREE.Object3D() // kontener na obiekty 3D

        container.walls = []

        var wall = new THREE.Mesh(Settings.hexWallGeometry, Settings.hexWallMaterial);

        // console.log(location.dirOut, location.dirIn);
        for (var i = 0; i < 6; i++) {
            if (i == location.dirOut) {
                var side = new Doors()
                //side.castShadow = true;
                container.walls = container.walls.concat(side.walls)
            }
            else if (location.dirIn.includes(i)) {
                // console.log("dirin");
                continue
            }
            else {
                var side = wall.clone()
                container.walls.push(side)
                //side.receiveShadow = true;
            }
            side.position.x = -(radius * Math.sqrt(3) / 2) * Math.sin((Math.PI / 3 * i) + Math.PI)
            side.position.y = 0
            side.position.z = (radius * Math.sqrt(3) / 2) * Math.cos((Math.PI / 3 * i) + Math.PI)
            side.lookAt(container.position) // nakierowanie ścian na środek kontenera 3D  
            container.add(side)
        }
        var floor = new THREE.Mesh(Settings.hexFloorGeometry, Settings.hexWallMaterial)
        floor.name = "floor"
        floor.rotation.y = Math.PI / 2
        floor.position.y = -Settings.height / 2
        //floor.receiveShadow = true;
        container.add(floor)

        if (location.type == "light") {
            let light = new Light()
            container.add(light.container)
            light.container.position.y += 80
            ui.lights.push(light)
        }
        if (location.type == "treasure") {
            let treasure = new Treasure()
            container.add(treasure)
        }

        container.position.y = Settings.height / 2

        container.locationData = location

        return container
    }
}