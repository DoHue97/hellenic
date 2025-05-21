import React from "react";
import { Box, Button, Center, Modal, NativeBaseProvider, Text } from 'native-base'
import { StatusBar } from "react-native";
import { Provider } from 'react-redux'
import initTheme from './src/theme/index'
import { store } from './src/reducers';

export default function App() {

	return (
		<NativeBaseProvider theme={initTheme(config)}>
			<StatusBar backgroundColor={'transparent'} barStyle={'light-content'} />
			<Provider store={store}>
				<AppRouter />
			</Provider>
		</NativeBaseProvider>
	)
}