class Net {
	constructor() {}

	saveLevel(mapObject) {
		console.log('saving level on server')
		return new Promise(promise => {
			$.ajax({
				url: '/saveLevel',
				data: JSON.stringify(mapObject),
				type: 'POST',
				success: data => {
					var obj = JSON.parse(data)
					promise(obj)
				},
				error: (xhr, status, error) => {
					console.log(xhr)
					throw 'error'
				},
			})
		})
	}

	loadlevel() {
		console.log('loading level from server')
		return new Promise(promise => {
			promise({
				size: '6',
				level: [
					{
						id: '14',
						col: 2,
						row: 2,
						dirOut: 2,
						dirIn: [],
						type: 'light',
					},
					{
						id: '20',
						col: 3,
						row: 2,
						dirOut: 4,
						dirIn: [5],
						type: 'treasure',
					},
					{
						id: '15',
						col: 2,
						row: 3,
						dirOut: 5,
						dirIn: [1, 2],
						type: 'walls',
					},
					{
						id: '21',
						col: 3,
						row: 3,
						dirOut: 5,
						dirIn: [1],
						type: 'walls',
					},
					{
						id: '27',
						col: 4,
						row: 3,
						dirOut: 4,
						dirIn: [0],
						type: 'walls',
					},
					{
						id: '26',
						col: 4,
						row: 2,
						dirOut: 3,
						dirIn: [5],
						type: 'walls',
					},
					{
						id: '19',
						col: 3,
						row: 1,
						dirOut: 2,
						dirIn: [5],
						type: 'walls',
					},
					{
						id: '13',
						col: 2,
						row: 1,
						dirOut: 2,
						dirIn: [4],
						type: 'walls',
					},
					{
						id: '7',
						col: 1,
						row: 1,
						dirOut: 1,
						dirIn: [3],
						type: 'enemy',
					},
					{
						id: '8',
						col: 1,
						row: 2,
						dirOut: 0,
						dirIn: [2],
						type: 'ally',
					},
				],
			})
		})
	}
}
