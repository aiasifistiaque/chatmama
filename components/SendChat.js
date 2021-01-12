import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default function SendChat({ message, setMessage, sendMessage }) {
	return (
		<View style={styles.sendContainer}>
			<View style={styles.inputContainer}>
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<TextInput
						placeholder='enter text'
						value={message}
						onChangeText={text => setMessage(text)}
					/>
				</View>

				<TouchableOpacity
					onPress={sendMessage}
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						//backgroundColor: 'red',
						paddingHorizontal: 20,
						paddingVertical: 10,
					}}>
					<Text style={{ color: 'dodgerblue' }}>send</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	sendContainer: {
		flex: 0.8,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputContainer: {
		width: '90%',
		borderRadius: 100,
		backgroundColor: 'whitesmoke',
		marginVertical: 5,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 20,
		justifyContent: 'space-between',
		height: 45,
	},
});
