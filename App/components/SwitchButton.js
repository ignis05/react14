import React, { Component } from 'react'
import { TouchableOpacity, Text } from 'react-native'

class SwitchButton extends Component {
	constructor(props) {
		super(props)

		this.pressHandler = this.pressHandler.bind(this)
	}

	pressHandler() {
		if (this.props.onPress) this.props.onPress(this.props)
	}

	render() {
		return (
			<TouchableOpacity
				disabled={this.props.disabled === true}
				onPress={this.pressHandler}
				style={[{ width: 200, height: 200, borderRadius: 200, alignItems: 'center', justifyContent: 'center' }, { backgroundColor: this.props.enabled ? 'green' : 'red' }]}
			>
				<Text style={{ fontSize: 18, textAlign: 'center' }}> {this.props.children} </Text>
			</TouchableOpacity>
		)
	}
}

export default SwitchButton
