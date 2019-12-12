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
