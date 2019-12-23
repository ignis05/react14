import React, { Component } from 'react'
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner'

export default class QRscanner extends Component {
	constructor(props) {
		super(props)

		this.state = {
			hasCameraPermission: null,
			scanned: null,
		}

		this.handleBarCodeRead = this.handleBarCodeRead.bind(this)
	}

	componentDidMount() {
		this._requestCameraPermission()
	}

	_requestCameraPermission = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA)
		this.setState({
			hasCameraPermission: status === 'granted',
		})
	}

	handleBarCodeRead = ({ data }) => {
		console.log(data)
		if (this.state.scanned !== data) {
			this.setState({ scanned: data })
			if (this.validURL(data)) this.props.navigation.state.params.setDest(data)
		}
	}

	validURL(str) {
		var pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		)
		return !!pattern.test(str)
	}

	render() {
		console.log(this.state.scanned)
		return (
			<View style={styles.container}>
				<View style={styles.displayBar}>
					<Text style={[styles.text, this.validURL(this.state.scanned) ? { color: 'green' } : { color: 'red' }]}>{this.state.scanned}</Text>
				</View>
				{this.state.hasCameraPermission === null ? (
					<Text>Requesting for camera permission</Text>
				) : this.state.hasCameraPermission === false ? (
					<Text style={{ color: '#fff' }}>Camera permission is not granted</Text>
				) : (
					<BarCodeScanner onBarCodeScanned={this.handleBarCodeRead} style={{ width: '100%', height: '100%' }} />
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		backgroundColor: '#000',
	},
	displayBar: {
		width: '100%',
		height: 50,
		textAlign: 'center',
		backgroundColor: 'cyan',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: 'black',
		fontSize: 24,
	},
})
