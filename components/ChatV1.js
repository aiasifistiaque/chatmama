import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatV1({ chat, i, arr, user, friend, status }) {
	const previousItem = arr[i - 1];
	const lastItem = arr[arr.length - 1];
	console.log(chat);

	const textBoxStyle = {
		flex: 1,
		alignSelf: chat.sender === user.uid ? 'flex-end' : 'flex-start',
		minWidth: '40%',
		maxWidth: '80%',
		shadowColor: 'black',
		shadowOpacity: 0.1,
		shadowOffset: {
			height: 2,
			width: 1,
		},
		shadowRadius: 4,
		paddingHorizontal: 20,
		marginTop: i > 0 && previousItem.sender == chat.sender ? 3 : 15,
		paddingVertical: 10,
		borderRadius: 4,
		backgroundColor:
			chat.sender == user.uid ? 'whitesmoke' : 'rgba(0,58,91,.4)',
	};

	const unixToHourMin = () => {
		const date = new Date(chat.timestamp.seconds * 1000);
		const hour = date.getHours();
		const min =
			date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
		if (hour == 0) return '12:' + min + ' AM';
		if (hour == 12) return '12:' + min + ' PM';
		if (hour < 12) {
			if (hour < 10) return `0${hour}:${min} AM`;
			else return `${hour}:${min} AM`;
		}
		if (hour > 12) {
			let hh = hour - 12;
			if (hh < 10) return `0${hh}:${min} PM`;
			else return `${hh}:${min} PM`;
		}
	};

	return (
		<View key={i}>
			<View style={textBoxStyle}>
				{i > 1 && previousItem.sender == chat.sender ? null : (
					<Text style={styles.text}>
						{chat.sender === user.uid ? 'me' : friend.username}
					</Text>
				)}
				<View style={styles.msgBox}>
					<Text style={styles.msg}>{chat.message}</Text>
					{chat.timestamp && <Text style={styles.time}>{unixToHourMin()}</Text>}
				</View>
			</View>
			{chat.sender === user.uid && chat == arr[0] && (
				<Text style={styles.seen}>{status}</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		fontWeight: '600',
		textTransform: 'uppercase',
		paddingBottom: 2,
	},
	msg: {
		fontSize: 14,
		marginTop: 3,
	},
	msgBox: {
		flex: 1,
		flexDirection: 'column',
	},
	seen: {
		marginTop: 4,
		marginHorizontal: 10,
		alignSelf: 'flex-end',
		fontSize: 12,
		fontWeight: '600',
		color: 'rgba(0,0,0,.5)',
		textTransform: 'capitalize',
	},
	time: {
		alignSelf: 'flex-end',
		fontSize: 10,
		color: 'rgba(0,0,0,.5)',
	},
});
