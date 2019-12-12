var net = new Net()

var display = null;

var variables = {
    typeOfNextHex: "walls"
}

var map = {
    size: null,
    level: [],
}

function create() {
    display.innerText = ""
    map.size = $("#select").val()
    console.log(`creating ${map.size} hexagons`);
    map.level = []
    displayHexagons()
}

function displayHexagons() {
    $("#map").find(".hexagon").remove()
    var id = 0;
    for (let j = 0; j < map.size; j++) {
        for (let i = 0; i < map.size; i++) {
            new Hex(id, j, i, map, display, variables)
            id++
        }
    }
}


$(document).ready(() => {
    console.log("document ready");

    display = document.getElementById("display")

    $("#btCreate").click(create)
    $("#btSave").click(async function () {
        console.log("sending");
        var res = await net.saveLevel(map)
        if (res === true) {
            console.log("saving successful");
            let orgText = $(this).text()
            $(this).attr("disabled", true)
            $(this).text("Saved!")
            setTimeout(() => {
                $(this).text(orgText)
                $(this).attr("disabled", false)
            }, 2000)
        }
        else {
            console.error("map saving error");
        }
    })
    $("#btLoad").click(async function () {
        console.log("loading");
        var res = await net.loadlevel()
        map = res
        display.innerText = JSON.stringify(map, null, 4)
        displayHexagons()
        let orgText = $(this).text()
        $(this).attr("disabled", true)
        $(this).text("Loaded!")
        setTimeout(() => {
            $(this).text(orgText)
            $(this).attr("disabled", false)
        }, 2000)
    })

    $("#btRender").click(function () {
        window.location = "/game"
    })

    $("#btTestMove").click(function () {
        window.location = "/static/html/testmove.html"
    })

    $("#btTestAlly").click(function () {
        window.location = "/static/html/testally.html"
    })

    $("#btTestCol").click(function () {
        window.location = "/static/html/testcol.html"
    })
    


    // hex type changers
    $("#btWalls").addClass("btActive") //initial active:

    $(".hexButton").click(function () {
        var type = this.id.slice(2).toLowerCase()
        variables.typeOfNextHex = type
        display.innerText = JSON.stringify(map, null, 4)
        $(".hexButton").removeClass("btActive")
        this.classList.add("btActive")
    })
})