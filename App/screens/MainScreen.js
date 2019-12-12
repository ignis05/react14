import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SwitchButton from '../components/SwitchButton'

const socketDest = 'ws://192.168.1.12:1337'

const styles = StyleSheet.create({
	wrapper: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
})

class MainScreen extends Component {
	constructor(props) {
		super(props)
		this.state = { ws: false, acc: false }

		this.switchWS = this.switchWS.bind(this)
	}

	switchWS() {
		console.log('switching websocket')
		if (this.state.ws) {
			this.state.ws.close()
			this.setState({ ws: false })
		} else {
			this.setState({ ws: new WebSocket(socketDest) }, () => {
				const ws = this.state.ws

				ws.onopen = () => {
					ws.send('klient się podłączył')
				}

				//odebranie danych z serwera i reakcja na nie, po sekundzie
				ws.onmessage = e => {
					console.log(e.data)
					setTimeout(() => {
						ws.send('timestamp z klienta: ' + Date.now())
					}, 1000)
				}

				ws.onerror = e => {
					console.log(e.message)
				}

				ws.onclose = e => {
					console.log(e.code, e.reason)
				}
			})
		}
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<SwitchButton enabled={this.state.ws} onPress={this.switchWS}>
					Start websocket
				</SwitchButton>
				<SwitchButton enabled={this.state.acc}>Start accelerometer</SwitchButton>
			</View>
		)
	}
}

export default MainScreen
