import { createStackNavigator, createAppContainer } from 'react-navigation'
import MainScreen from './screens/MainScreen'
import TitleScreen from './screens/TitleScreen'

const Root = createStackNavigator(
	{
		title: TitleScreen,
		main: MainScreen,
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#FFCB2F',
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
