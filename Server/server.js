const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 1337 }, () => {
	console.log('ws startuje na porcie 1337')
})

//reakcja na podłączenie klienta i odesłanie komunikatu

wss.on('connection', (ws, req) => {
	//adres ip klienta
	const clientip = req.connection.remoteAddress

	//reakcja na komunikat od klienta
	ws.on('message', data => {
		console.log('received data: ', data)
		sendToAll(data)
	})
})

sendToAll = data => {
	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data)
		}
	})
}

sendToAllButMe = (data, ws) => {
	wss.clients.forEach(client => {
		if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(data)
		}
	})
}

var http = require('http')
var fs = require('fs')
var qs = require('querystring')

var serverDB = {
	map: {},
}

var server = http.createServer(function(req, res) {
	switch (req.method) {
		case 'GET':
			console.log(`requested adres: ${decodeURI(req.url)}`)
			var fileEXTEN = req.url.split('.')[req.url.split('.').length - 1]
			if (req.url == '/') {
				fs.readFile(`./static/html/index.html`, function(error, data) {
					if (error) {
						res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' })
						res.write('<h1>błąd 404 - nie ma pliku!<h1>')
						res.end()
					} else {
						res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' })
						res.write(data)
						res.end()
						console.log('sent index')
					}
				})
			} else {
				fs.readFile(`.${decodeURI(req.url)}`, function(error, data) {
					if (error) {
						console.log(`cant find file ${decodeURI(req.url)}`)
						res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' })
						res.write('<h1>Error 404 - file doesnt exist<h1>')
						res.end()
					} else {
						switch (fileEXTEN) {
							case 'css':
								res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' })
								break
							case 'html':
								res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
								break
							case 'js':
								res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' })
								break
							case 'png':
								res.writeHead(200, { 'Content-Type': 'image/png' })
								break
							case 'jpg':
								res.writeHead(200, { 'Content-Type': 'image/jpg' })
								break
							case 'mp3':
								res.writeHead(200, { 'Content-type': 'audio/mpeg' })
								break
							default:
								res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
						}
						res.write(data)
						res.end()
						console.log(`sent file: ${decodeURI(req.url)}`)
					}
				})
			}
			break
	}
})

server.listen(3000, () => {
	console.log('serwer startuje na porcie 3000')
})
