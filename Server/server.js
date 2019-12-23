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
const AutoRouting = require('./modules/AutoRouting')
const router = new AutoRouting('./website/build/index.html', [], '<h1>Error 404 - file not found</h1>')

var os = require('os')
var networkInterfaces = os.networkInterfaces()
const IP = networkInterfaces.Ethernet.find(i => i.family == 'IPv4').address

var server = http.createServer((req, res) => {
	switch (req.method) {
		case 'GET':
			router.get(req, res)
			break
		case 'POST':
			switch (req.url) {
				case '/ip':
					res.end(JSON.stringify({ ip: IP }))
					break
			}
	}
})

server.listen(3000, () => {
	console.log('Server running on port 3000')
})
