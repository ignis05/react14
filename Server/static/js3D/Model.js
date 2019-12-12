class Model {
    constructor() {
        // this.container = new THREE.Object3D()
        this.mixer = null
        this.animations = []
        this.model = null
        this.currentAnimation = null
        this.clock = new THREE.Clock();
    }

    loadModel(urlModel, urlMaterial) {
        return new Promise(resolve => {
            var modelMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(urlMaterial), morphTargets: true });

            var loader = new THREE.JSONLoader();

            loader.load(urlModel, geometry => {
                var model = new THREE.Mesh(geometry, modelMaterial)
                model.name = "model";
                var box = new THREE.Box3().setFromObject(model);
                //console.log(box.getSize(new THREE.Vector3()).y);
                //model.rotation.y = 0;
                model.scale.set(1, 1, 1);
                model.position.y = box.getSize(new THREE.Vector3()).y / 2;
                scene.add(model);

                this.mixer = new THREE.AnimationMixer(model)

                model.geometry.animations.forEach(animation => {
                    this.animations.push(animation.name)
                })

                // this.container.add(model)
                this.model = model
                resolve(this.model);
            })
        })
    }


    // update mixera

    updateModel() {
        var delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta)
    }

    //animowanie postaci

    setAnimation(animationName) {
        if (this.currentAnimation != animationName) {
            this.currentAnimation = animationName
            this.mixer.uncacheRoot(this.model)
            this.mixer.clipAction(animationName).play();
        }
    }
}