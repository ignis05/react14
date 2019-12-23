var fs = require('fs')

// autoroutes all files in server directory
// requires indexpath - path to main page file
// optionally files array for other pages : ex: [   { url:'/xd', path:'./static/xd/xd.html'},  ]
// optionally errorMsg to be sent with error 404
// to use construct class and paste autorouting.get(req,res) to handle requests
class AutoRouting {
    constructor(indexpath, files, errorMsg) {
        this.indexpath = indexpath
        if (files && files.length > 0) {
            if (!files.every(file => file.url && file.path)) console.error('wrong files attribute')
            this.files = files
        }
        this.errorMsg = (errorMsg ? errorMsg : '<h1>Error 404: page not found<h1>')
    }
    get(req, res) {
        console.log(`requested address: ${decodeURI(req.url)}`)
        var fileEXTEN = req.url.split(".")[req.url.split(".").length - 1]
        let file
        if (this.files) file = this.files.find(file => file.url == req.url)
        if (req.url == "/") {
            fs.readFile(this.indexpath, (error, data) => {
                if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write(this.errorMsg);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' });
                    res.write(data);
                    res.end();
                    console.log("sent index");
                }
            })
        }
        else if (file) {
            fs.readFile(file.path, (error, data) => {
                if (error) {
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write(this.errorMsg);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' });
                    res.write(data);
                    res.end();
                    console.log(`sent page: ${decodeURI(req.url)}`)
                }
            })
        }
        else {
            fs.readFile(`./website/build${decodeURI(req.url)}`, (error, data) => {
                if (error) {
                    console.log(`cant find file ${decodeURI(req.url)}`);
                    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write(this.errorMsg);
                    res.end();
                }
                else {
                    switch (fileEXTEN) {
                        case "css":
                            res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
                            break;
                        case "html":
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            break;
                        case "js":
                            res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });
                            break;
                        case "png":
                            res.writeHead(200, { 'Content-Type': 'image/png' });
                            break;
                        case "jpg":
                            res.writeHead(200, { 'Content-Type': 'image/jpg' });
                            break;
                        case "mp3":
                            res.writeHead(200, { "Content-type": "audio/mpeg" });
                            break
                        default:
                            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                    }
                    res.write(data);
                    res.end();
                    console.log(`sent file: ${decodeURI(req.url)}`)
                }
            })
        }
    }
}

module.exports = AutoRouting
