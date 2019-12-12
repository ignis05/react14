import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

class Button extends Component {
	static propTypes = {
		onPress: PropTypes.func,
		children: PropTypes.any,
		style: PropTypes.any,
		disabled: PropTypes.bool,
	}

	constructor(props) {
		super(props)

		this.style = this.props.style || { color: 'black', fontSize: 24 }
		this.pressHandler = this.pressHandler.bind(this)
		this.longPressHandler = this.longPressHandler.bind(this)
	}

	pressHandler() {
		if (this.props.onPress) this.props.onPress(this)
	}

	longPressHandler() {
		if (this.props.onLongPress) this.props.onLongPress(this)
	}

	render() {
		let textstyle
		if (Array.isArray(this.style)) {
			textstyle = this.style.map(s =>
				Object.keys(s)
					.filter(key => key.startsWith('text') || key.startsWith('font'))
					.reduce((reducer, key) => {
						reducer[key] = s[key]
						return reducer
					}, {})
			)
		} else {
			textstyle = Object.keys(this.style)
				.filter(key => key.startsWith('text') || key.startsWith('font'))
				.reduce((reducer, key) => {
					reducer[key] = this.style[key]
					return reducer
				}, {})
		}
		return (
			<TouchableOpacity style={this.style} onPress={this.pressHandler} onLongPress={this.longPressHandler} disabled={this.props.disabled}>
				{typeof this.props.children == 'string' ? <Text style={textstyle}>{this.props.children}</Text> : this.props.children}
			</TouchableOpacity>
		)
	}
}

export default Button
