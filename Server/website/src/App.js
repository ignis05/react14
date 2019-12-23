import React, { Component } from 'react'
import QRCode from 'qrcode.react'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = { qrcode: null }
	}

	async componentDidMount() {
		const rawResponse = await fetch(`/ip`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
		})
		const content = await rawResponse.json()
		console.log(content)
		this.setState({ qrcode: content.ip })
	}

	render() {
		return <div>{this.state.qrcode && <QRCode value={this.state.qrcode} />}</div>
	}
}

export default App
