import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { LoginStack } from './stack/LoginStack';

export default function Navigator() {
	return (
		<NavigationContainer>
			<LoginStack />
		</NavigationContainer>
	);
}
