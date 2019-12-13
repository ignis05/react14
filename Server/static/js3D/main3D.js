var scene
var render
$(document).ready(async function() {
	// #region initial
	$(window).on('resize', () => {
		camera.aspect = $(window).width() / $(window).height()
		camera.updateProjectionMatrix()
		renderer.setSize($(window).width(), $(window).height())
	})

	scene = new THREE.Scene()

	var camera = new THREE.PerspectiveCamera(
		45, // kąt patrzenia kamery (FOV - field of view)
		$(window).width() / $(window).height(), // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
		0.1, // minimalna renderowana odległość
		10000 // maxymalna renderowana odległość od kamery
	)
	// camera.position.set(300, 100, 300)
	camera.position.set(0, 600, 0)
	camera.lookAt(scene.position)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setClearColor(0xffffff)
	renderer.setSize($(window).width(), $(window).height())
	//shadows
	//renderer.shadowMap.enabled = true
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	$('#root').append(renderer.domElement)
	// #endregion initial

	let grid = new Grid(2500)
	grid.addTo(scene)

	// var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
	// orbitControl.addEventListener('change', function () {
	//     renderer.render(scene, camera)
	// });

	let uiFunctions = ['lights']
	var ui = new UI(uiFunctions)

	var net = new Net()
	var map = await net.loadlevel()

	var level = new Level(ui, map)

	// player
	var player = new Player()
	await player.loadModel(Settings.playerGeometryURL, Settings.playerMaterialURL)
	player.model.setAnimation('stand')
	player.addTo(scene)
	player.container.position.x = level.hexagons[0].position.x
	player.container.position.z = level.hexagons[0].position.z

	const ws = new WebSocket('ws://127.0.0.1:1337')
	var isRunning = false
	ws.onmessage = e => {
		let obj = false
		try {
			obj = JSON.parse(e.data)
		} catch {}
		if (obj) {
			console.log(obj)
			if (Math.abs(obj.x) < 0.3 && Math.abs(obj.y) < 0.3) return
			if (!isRunning) {
				player.model.setAnimation('run')
				isRunning = true
			}
			clickedVect = new THREE.Vector3(player.container.position.x - obj.x * 70, 0, player.container.position.z + obj.y * 70) // wektor określający PUNKT kliknięcia
			directionVect = clickedVect
				.clone()
				.sub(player.container.position)
				.normalize()
			var angle = Math.atan2(player.container.position.clone().x - clickedVect.x, player.container.position.clone().z - clickedVect.z)
			player.mesh.rotation.y = Math.PI * 1.5 + angle
			player.lastdist = null
			console.log(player.container.position)
			console.log(clickedVect)
		}
	}

	ws.onerror = e => {
		console.log(e.message)
	}

	ws.onclose = e => {
		console.log(e.code, e.reason)
	}

	// raycaster
	var raycaster = new THREE.Raycaster() // obiekt symulujący "rzucanie" promieni
	var mouseVector = new THREE.Vector2()
	// $(root).mousedown(event => {
	// 	movePlayerEnable(event)
	// 	activateAlly(event)
	// 	$(document).on('mousemove', event => {
	// 		movePlayerEnable(event)
	// 	})
	// 	$(document).mouseup(event => {
	// 		$(document).off('mousemove')
	// 	})
	// })

	// $(root).mousemove(event => {
	// 	highlightAlly(event)
	// })

	// wektory
	var clickedVect = new THREE.Vector3(0, 0, 0) // wektor określający PUNKT kliknięcia
	var directionVect = new THREE.Vector3(0, 0, 0) // wektor określający KIERUNEK ruchu playera

	// #region player movement

	function movePlayer() {
		var dist = ~~player.container.position.clone().distanceTo(clickedVect)
		if (player.lastdist == null) player.lastdist = dist + 1

		if (player.lastdist > dist && collision()) {
			player.lastdist = dist
			player.container.translateOnAxis(directionVect, 4)
			player.container.position.y = 0

			camera.position.x = player.container.position.x + 200 * Math.sin(camAngle)
			camera.position.z = player.container.position.z + 200 * Math.cos(camAngle)
			camera.lookAt(player.container.position)
		} else {
			//on arrive
			isRunning = false
			player.model.setAnimation('stand')
		}
	}

	function movePlayerEnable(event) {
		mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
		mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
		raycaster.setFromCamera(mouseVector, camera)

		var intersects = raycaster.intersectObjects(scene.children, true)

		if (intersects.length > 0 && intersects[0].object.name == 'floor') {
			player.model.setAnimation('run')
			clickedVect = intersects[0].point
			directionVect = clickedVect
				.clone()
				.sub(player.container.position)
				.normalize()
			var angle = Math.atan2(player.container.position.clone().x - clickedVect.x, player.container.position.clone().z - clickedVect.z)
			player.mesh.rotation.y = Math.PI * 1.5 + angle
			player.lastdist = null
		}
	}

	// collsion
	var wallTab = []
	for (let hexagon of level.hexagons) {
		wallTab = wallTab.concat(hexagon.walls)
	}
	console.log(wallTab)

	var greenPoint = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
	scene.add(greenPoint)
	greenPoint.position.y = 50

	var raycasterCol = new THREE.Raycaster() // raycaster dla kolizji

	function collision() {
		var ray = new THREE.Ray(player.container.position, player.axes.getWorldDirection(new THREE.Vector3(1, 1, 1)))

		raycasterCol.ray = ray

		var intersects = raycasterCol.intersectObjects(wallTab, true)

		if (intersects[0]) {
			console.log('HERE')
			console.log(intersects[0].distance) // odległość od vertex-a na wprost, zgodnie z kierunkiem ruchu
			greenPoint.position.set(intersects[0].point.x, 50, intersects[0].point.z)
			if (intersects[0].distance <= 40) return false
		}
		return true
	}
	// #endregion player movement

	// #region camera movement
	var camLeft = false
	var camRight = false
	var camAngle = 0

	// document.addEventListener('keydown', e => {
	// 	switch (e.code) {
	// 		case 'KeyA':
	// 		case 'ArrowLeft':
	// 			camLeft = true
	// 			break
	// 		case 'KeyD':
	// 		case 'ArrowRight':
	// 			camRight = true
	// 			break
	// 	}
	// })
	// document.addEventListener('keyup', e => {
	// 	switch (e.code) {
	// 		case 'KeyA':
	// 		case 'ArrowLeft':
	// 			camLeft = false
	// 			break
	// 		case 'KeyD':
	// 		case 'ArrowRight':
	// 			camRight = false
	// 			break
	// 	}
	// })
	function rotateCamera() {
		if (camLeft) {
			camAngle -= 0.05
		}
		if (camRight) {
			camAngle += 0.05
		}
		camera.position.x = player.container.position.x + 200 * Math.sin(camAngle)
		camera.position.z = player.container.position.z + 200 * Math.cos(camAngle)
		camera.lookAt(player.container.position)
	}
	// #endregion camera movement

	// #region allies
	var allies = []
	for (let hexagon of level.hexagons) {
		// ally spawns
		if (hexagon.locationData.type == 'ally') {
			let ally = new Ally()
			await ally.loadModel(Settings.allyGeometryURL, Settings.allyMaterialURL)
			ally.addTo(scene)
			let x = hexagon.position.x
			let z = hexagon.position.z
			ally.container.position.set(x, 0, z)
			ally.model.setAnimation('1stand')
			allies.push(ally)
		}
	}

	function activateAlly(event) {
		mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
		mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
		raycaster.setFromCamera(mouseVector, camera)

		var intersects = raycaster.intersectObjects(scene.children, true)
		// console.log(intersects);

		if (intersects.length > 0) {
			if (intersects[0].object.name == 'ally') {
				console.log('clicked ally')
				let ally = allies.find(ally => ally.mesh.uuid == intersects[0].object.uuid)
				console.log(ally)
				if (true) {
					// placeholder for range check
					ally.follow = true
					player.allies.push(ally)
				}
			}
		}
	}

	function moveAllies() {
		player.allies.forEach((ally, iterator) => {
			ally.vector = player.container.position
			ally.directionVect = ally.vector
				.clone()
				.sub(ally.container.position)
				.normalize()
			let angle = Math.atan2(ally.container.position.clone().x - ally.vector.x, ally.container.position.clone().z - ally.vector.z)
			ally.mesh.rotation.y = Math.PI * 1.5 + angle
			if (~~ally.container.position.clone().distanceTo(ally.vector) > 50 * (iterator + 1)) {
				ally.container.translateOnAxis(ally.directionVect, 3.5)
				ally.container.position.y = 0
				ally.model.setAnimation('2run')
			} else {
				ally.model.setAnimation('1stand')
			}
		})
	}

	function highlightAlly(event) {
		allies.forEach(ally => {
			ally.ring.visible = false
		})
		mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
		mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
		raycaster.setFromCamera(mouseVector, camera)

		var intersects = raycaster.intersectObjects(scene.children, true)
		// console.log(intersects);

		if (intersects.length > 0) {
			if (intersects[0].object.name == 'ally') {
				let ally = allies.find(ally => ally.mesh.uuid == intersects[0].object.uuid)
				if (player.allies.indexOf(ally) == -1) {
					// if not following
					ally.ring.visible = true
				}
			}
		}
	}
	// #endregion

	function render() {
		movePlayer()
		rotateCamera()
		player.model.updateModel()

		moveAllies()
		allies.forEach(ally => {
			ally.model.updateModel()
		})

		renderer.render(scene, camera)
		requestAnimationFrame(render)
	}
	render()
})
