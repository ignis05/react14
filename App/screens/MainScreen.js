import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Accelerometer } from 'expo-sensors'
import SwitchButton from '../components/SwitchButton'
import Button from '../components/Button'

const socketDest = 'ws://192.168.1.3:1337'

const styles = StyleSheet.create({
	wrapper: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
})

class MainScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerRight: (
				<Button
					onPress={() => navigation.navigate('QRscanner', { setDest: navigation.getParam('setDest') })}
					marginRight={10}
					style={{ marginRight: 10, fontWeight: 'bold', fontSize: 24, backgroundColor: '#ffffff55', color: 'black', padding: 3 }}
				>
					Connect
				</Button>
			),
		}
	}

	constructor(props) {
		super(props)
		this.state = { ws: false, acc: false, isAcc: false, data: null, dest: null }

		this.switchWS = this.switchWS.bind(this)
		this.switchAcc = this.switchAcc.bind(this)
		this.accHandler = this.accHandler.bind(this)
		this.setDest = this.setDest.bind(this)
		this.socket

		this.props.navigation.setParams({ setDest: this.setDest })
	}

	async componentDidMount() {
		let acc = await Accelerometer.isAvailableAsync()
		this.setState({ isAcc: acc })
	}

	setDest(url) {
		console.log('setting dest to', url)
		this.setState({ dest: url })
	}

	switchWS() {
		console.log('switching websocket')
		if (this.state.ws) {
			this.socket.close()
			this.setState({ ws: false })
		} else {
			this.socket = new WebSocket(socketDest)
			this.socket.onerror = e => console.log(e.message)
			this.socket.onclose = e => console.log(e.code, e.reason)
			this.socket.onopen = e => this.setState({ ws: true })
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
				<SwitchButton enabled={this.state.ws} disabled={this.state.dest === null} onPress={this.switchWS}>
					{this.state.dest === null ? 'No server specified' : `Connect to:\n${this.state.dest}`}
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
