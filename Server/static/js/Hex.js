class Hex {
    constructor(id, col, row, map, displayBlock, variables) {
        //#region config
        this.offsetTop = 20
        this.offsetLeft = 40
        this.spaces = 5
        //#endregion

        var img = $(`<div class='hexagon' id='hexagon${id}'>`)
        img
            .css("left", ((90 + this.spaces) * col) + this.offsetLeft)
        //.css("transform", "rotate(30deg)")
        if (col % 2 == 0) {
            img.css("top", ((100 + this.spaces) * row) + this.offsetTop)
        }
        else {
            img.css("top", ((100 + this.spaces) * row + 53) + this.offsetTop)
        }

        img.click(function () {
            var id = this.id.substr(7, this.id.length - 2)
            console.log(`hexagon ${id} clicked`);
            console.log(`col: ${col}, row: ${row}`);
            var entry = map.level.find(hexagon => hexagon.id == id)
            if (entry == undefined) {
                console.log("doesnt exist yet - creating");
                var arrow = $("<img src='/static/img/arrow.png' class='arrow' id='arrow" + id + "'>")
                $("#hexagon" + id).append(arrow)
                var div = $("<div id='displayDiv" + id + "' class='displayDiv'>")
                $("#hexagon" + id).append(div)
                map.level.push(
                    {
                        id: id,
                        col: col,
                        row: row,
                        dirOut: 0,
                        dirIn: [3,],
                        type: variables.typeOfNextHex
                    }
                )
                entry = map.level.find(hexagon => hexagon.id == id)
            }
            else {
                console.log("exists - updating");
                if (entry.dirOut == 5) {
                    entry.dirOut = 0
                }
                else {
                    entry.dirOut++
                }
                entry.dirIn[0] = (3 + entry.dirOut) % 6
                entry.type = variables.typeOfNextHex
            }
            console.log("dirin: " + entry.dirIn[0]);
            $("#displayDiv" + id).text(entry.dirOut)
            img.css("transform", "rotate(" + ((entry.dirOut * 60)) + "deg)")
            switch (entry.type) {
                case "walls":
                    img.css("background", "white")
                    break
                case "enemy":
                    img.css("background", "red")
                    break
                case "treasure":
                    img.css("background", "blue")
                    break
                case "light":
                    img.css("background", "yellow")
                    break
                case "ally":
                    img.css("background", "green")
                    break
            }
            Hex.correctDirIns(map)
            displayBlock.innerText = JSON.stringify(map, null, 4)
        })

        img.contextmenu(function (e) {
            e.preventDefault()
            var id = this.id.substr(7, this.id.length - 2)
            var hexagon = map.level.find(hexagon => hexagon.id == id)
            if (hexagon) {
                var which = map.level.findIndex(el => el.id == hexagon.id)
                console.log(which);
                map.level.splice(which, 1)
                Hex.correctDirIns(map)
                displayBlock.innerText = JSON.stringify(map, null, 4)
                $(this).remove()
                new Hex(id, col, row, map, displayBlock, variables)
            }
        })

        $("<div class='corner-1'>").appendTo(img)
        $("<div class='corner-2'>").appendTo(img)
        img.appendTo($("#map"))


        var object = map.level.find(hexagon => hexagon.id == id)
        if (object != undefined) { // triggers when hexagon was loaded from server
            console.log("exists");
            let id = object.id
            var arrow = $("<img src='/static/img/arrow.png' class='arrow' id='arrow" + id + "'>")
            $("#hexagon" + id).append(arrow)
            var div = $("<div id='displayDiv" + id + "' class='displayDiv'>")
            $("#hexagon" + id).append(div)
            $("#displayDiv" + id).text(object.dirOut)
            img.css("transform", "rotate(" + ((object.dirOut * 60)) + "deg)")
            switch (object.type) {
                case "walls":
                    img.css("background", "white")
                    break
                case "enemy":
                    img.css("background", "red")
                    break
                case "treasure":
                    img.css("background", "blue")
                    break
                case "light":
                    img.css("background", "yellow")
                    break
                case "ally":
                    img.css("background", "green")
                    break
            }
        }
    }
    static correctDirIns(map) {
        console.log("correcting dirIns");
        console.log(map);
        map.level.forEach(hexagon => {
            hexagon.dirIn = []
            var neighbors = []
            if (hexagon.col % 2 == 0) { //diffrent row heights
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row - 1) && (hex.col == hexagon.col)))     //0
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row - 1) && (hex.col == hexagon.col + 1))) //1
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row) && (hex.col == hexagon.col + 1)))     //2
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row + 1) && (hex.col == hexagon.col)))     //3
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row) && (hex.col == hexagon.col - 1)))     //4
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row - 1) && (hex.col == hexagon.col - 1))) //5
            }
            else {
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row - 1) && (hex.col == hexagon.col)))     //0
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row) && (hex.col == hexagon.col + 1)))     //1
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row + 1) && (hex.col == hexagon.col + 1))) //2
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row + 1) && (hex.col == hexagon.col)))     //3
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row + 1) && (hex.col == hexagon.col - 1))) //4
                neighbors.push(map.level.find(hex => (hex.row == hexagon.row) && (hex.col == hexagon.col - 1)))     //5
            }
            console.log(neighbors);
            for (let i in neighbors) {
                if (neighbors[i] && (neighbors[i].dirOut + 3) % 6 == i) {
                    hexagon.dirIn.push(parseInt(i))
                }
            }
        });
    }
}