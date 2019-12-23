import { createStackNavigator, createAppContainer } from 'react-navigation'
import MainScreen from './screens/MainScreen'
import TitleScreen from './screens/TitleScreen'
import QRscanner from './screens/QRscanner'

const Root = createStackNavigator(
	{
		title: TitleScreen,
		main: MainScreen,
		QRscanner: QRscanner,
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#FF5722',
			},
			headerTintColor: '#000',
			headerTitleStyle: {
				fontWeight: 'bold',
			},
		},
	}
)

const App = createAppContainer(Root)

export default App
