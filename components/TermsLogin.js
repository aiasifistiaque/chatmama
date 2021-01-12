import React from 'react';
import { View, Text } from 'react-native';

export default function TermsLogin() {
	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'row',
				alignItems: 'flex-end',
				paddingVertical: 20,
			}}>
			<Text style={{ color: 'white', marginHorizontal: 3 }}>Terms of use</Text>
			<Text style={{ color: 'white', marginHorizontal: 5 }}>|</Text>
			<Text style={{ color: 'white', marginHorizontal: 3 }}>
				Privacy Policy
			</Text>
		</View>
	);
}
