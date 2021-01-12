import React from 'react';
import { View, Text } from 'react-native';

export default function TextTimeStamp() {
	return (
		<View>
			<Text
				style={{
					alignSelf: 'flex-end',
					fontSize: 10,
					color: 'rgba(0,0,0,.5)',
				}}>
				{unixToHourMin(chat.timestamp.seconds)}
			</Text>
		</View>
	);
}
