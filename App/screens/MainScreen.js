import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Accelerometer } from 'expo-sensors'
import SwitchButton from '../components/SwitchButton'

const socketDest = 'ws://192.168.1.12:1337'

const styles = StyleSheet.create({
	wrapper: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
})

class MainScreen extends Component {
	constructor(props) {
		super(props)
		this.state = { ws: false, acc: false, isAcc: false, data: null }

		this.switchWS = this.switchWS.bind(this)
		this.switchAcc = this.switchAcc.bind(this)
		this.accHandler = this.accHandler.bind(this)
		this.socket
	}

	async componentDidMount() {
		let acc = await Accelerometer.isAvailableAsync()
		this.setState({ isAcc: acc })
	}

	switchWS() {
		console.log('switching websocket')
		if (this.state.ws) {
			this.socket.close()
			this.setState({ ws: false })
		} else {
			this.setState({ ws: true }, () => {
				this.socket = new WebSocket(socketDest)
				this.socket.onerror = e => console.log(e.message)
				this.socket.onclose = e => console.log(e.code, e.reason)
			})
		}
	}

	switchAcc() {
		if (this.state.acc) {
			Accelerometer.removeAllListeners()
			this.setState({ acc: false })
		} else {
			Accelerometer.addListener(this.accHandler)
			this.setState({ acc: true })
		}
	}

	accHandler(data) {
		this.setState({ data: data })
		if (this.state.ws) this.socket.send(JSON.stringify(data))
	}

	render() {
		let d = this.state.data
		if (!this.state.isAcc) {
			return (
				<View>
					<Text style={{ fontSize: 48 }}>No accelerometer detected on this device</Text>
				</View>
			)
		}
		return (
			<View style={styles.wrapper}>
				<SwitchButton enabled={this.state.ws} onPress={this.switchWS}>
					Start websocket
				</SwitchButton>
				<Text style={{ fontSize: 24 }}>{d && `X: ${d.x}\nY: ${d.y}\nZ: ${d.z}`}</Text>
				<SwitchButton enabled={this.state.acc} onPress={this.switchAcc}>
					Start accelerometer
				</SwitchButton>
			</View>
		)
	}
}

export default MainScreen
