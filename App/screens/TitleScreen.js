import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Button from '../components/Button'
import * as Font from 'expo-font'

const styles = StyleSheet.create({
	wrapper: { flex: 1 },
	header: { flex: 1, backgroundColor: '#FFCB2F', alignItems: 'center', justifyContent: 'center', elevation: 2 },
	headerText: { fontSize: 40, color: 'black', textAlign: 'center' },
	buttonWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	button: { fontSize: 24, fontWeight: 'bold' },
})

class TitleScreen extends Component {
	static navigationOptions = {
		header: null,
	}

	constructor(props) {
		super(props)
		this.state = { fontLoaded: false }

		this.navigate = this.navigate.bind(this)
	}

	navigate() {
		this.props.navigation.navigate('main')
	}

	async componentWillMount() {
		await Font.loadAsync({
			customFont: require('../assets/fonts/FiraCode-Regular.ttf'),
		})
		this.setState({ fontLoaded: true })
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<View style={styles.header}>
					<Text style={[styles.headerText, this.state.fontLoaded ? { fontFamily: 'customFont' } : {}]}>Accelerometer App</Text>
					<Text>firebase authentication</Text>
					<Text>firebase database</Text>
				</View>
				<View style={styles.buttonWrapper}>
					<Button style={styles.button} onPress={this.navigate}>
						Start
					</Button>
				</View>
			</View>
		)
	}
}

export default TitleScreen
