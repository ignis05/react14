var scene;
var render;
$(document).ready(function () {

    // #region initial
    $(window).on("resize", () => {
        camera.aspect = $(window).width() / $(window).height()
        camera.updateProjectionMatrix()
        renderer.setSize($(window).width(), $(window).height())
    })

    scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
        $(window).width() / $(window).height(),   // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1,    // minimalna renderowana odległość
        10000    // maxymalna renderowana odległość od kamery 
    );
    camera.position.set(500, 500, 500)
    camera.lookAt(scene.position)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize($(window).width(), $(window).height());
    //shadows
    //renderer.shadowMap.enabled = true
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // raycaster
    var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D

    // wektory
    var clickedVect = new THREE.Vector3(0, 0, 0); // wektor określający PUNKT kliknięcia
    var directionVect = new THREE.Vector3(0, 0, 0); // wektor określający KIERUNEK ruchu playera

    $("#root").append(renderer.domElement);
    // #endregion initial

    let grid = new Grid(2500, 0xffff00, false)
    grid.addTo(scene)

    // var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControl.addEventListener('change', function () {
    //     renderer.render(scene, camera)
    // });

    var player = new Player();
    player.create(new THREE.Mesh(Settings.playerGeometry, Settings.playerMaterial))
    player.addTo(scene)

    var allies = []
    for (let i = 0; i < 5; i++) { // ally spawns
        let ally = new Ally();
        ally.create(new THREE.Mesh(Settings.allyGeometry, Settings.allyMaterial))
        ally.addTo(scene)
        let x = ~~(Math.random() * 500)
        let z = ~~(Math.random() * 500)
        ally.container.position.set(x, 0, z)
        allies.push(ally)
    }

    function render() {
        movePlayer()
        moveAllies()

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    } render()

    function movePlayer() {
        // console.log(~~player.container.position.clone().distanceTo(clickedVect))
        if (~~player.container.position.clone().distanceTo(clickedVect) > 10) {
            player.container.translateOnAxis(directionVect, 5)
            player.container.position.y = 0

            camera.position.x = player.container.position.x + 500
            camera.position.z = player.container.position.z + 500
            camera.lookAt(player.container.position)
        }
    }

    function movePlayerEnable(event) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        raycaster.setFromCamera(mouseVector, camera);

        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            clickedVect = intersects[0].point
            // console.log(clickedVect)
            directionVect = clickedVect.clone().sub(player.container.position).normalize()
            // console.log(directionVect)
            //funkcja normalize() przelicza współrzędne x,y,z wektora na zakres 0-1
            //jest to wymagane przez kolejne funkcje
            var angle = Math.atan2(
                player.container.position.clone().x - clickedVect.x,
                player.container.position.clone().z - clickedVect.z
            )
            player.mesh.rotation.y = Math.PI + angle
        }
    }

    function activateAlly(event) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        raycaster.setFromCamera(mouseVector, camera);

        var intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            if (intersects[0].object.name == "ally") {
                console.log("clicked ally");
                let ally = allies.find(ally => ally.mesh.uuid == intersects[0].object.uuid)
                console.log(ally);
                if (true) { // placeholder for range check
                    ally.follow = true
                    player.allies.push(ally)
                }
            }
        }
    }

    function moveAllies() {
        player.allies.forEach((ally, iterator) => {
            ally.vector = player.container.position
            ally.directionVect = ally.vector.clone().sub(ally.container.position).normalize()
            let angle = Math.atan2(
                ally.container.position.clone().x - ally.vector.x,
                ally.container.position.clone().z - ally.vector.z
            )
            ally.mesh.rotation.y = Math.PI + angle
            if (~~ally.container.position.clone().distanceTo(ally.vector) > (100 * (iterator + 1))) {
                ally.container.translateOnAxis(ally.directionVect, 5)
                ally.container.position.y = 0
            }
        })
    }

    $(document).mousedown(event => {
        activateAlly(event)
        movePlayerEnable(event)
        $(document).on("mousemove", event => {
            movePlayerEnable(event)
        })
        $(document).mouseup(event => {
            $(document).off("mousemove")
        })
    })
})