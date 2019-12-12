class UI {
    constructor(functions) {
        if (functions.includes("lights")) {
            this.controlLights()
        }
    }
    controlLights() {
        this.lights = []
        this.lightsHeight = $("<input type='range' id='lightsHeight' class='lightsControler' min='-50' max='300' step='5'>")
        this.lightsIntensity = $("<input type='range' id='lightsIntensity' class='lightsControler' min='0' max='10' step='0.01' initial='1'>")
        this.lightsIntensity.val(1)
        this.lightContainer = $("<div id='lightsControls'>")
        $("body").append(this.lightContainer)
        this.lightContainer
            .css("position", "fixed")
            .css("top", "0")
            .css("left", "0")
        this.lightsHeight.css("margin-right", "20px")
        $(this.lightContainer).append(this.lightsHeight)
        $(this.lightContainer).append(this.lightsIntensity)
        this.lightsHeight.on("input", e => {
            this.lights.forEach(light => {
                light.setHeight(e.target.value)
            })
        })
        this.lightsIntensity.on("input", e => {
            this.lights.forEach(light => {
                light.setIntensity(e.target.value)
            })
        })
    }
}