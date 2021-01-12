import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Chat({ chat, index, arr, user, friend, status }) {
	const [same, setSame] = useState(false);
	const i = arr.indexOf(chat);
	const length = arr.length;
	const isSender = chat.sender === user.uid ? true : false;

	useEffect(() => {
		if (i < length - 1) {
			const prevItem = arr[i + 1];
			if (prevItem.sender == chat.sender) {
				setSame(true);
			}
		}
	}, []);

	const textBoxStyle = {
		flex: 1,
		alignSelf: isSender ? 'flex-end' : 'flex-start',
		//minWidth: '40%',
		//maxWidth: '80%',
		width: '100%',
		shadowColor: 'black',
		shadowOpacity: 0.1,
		shadowOffset: {
			height: 2,
			width: 1,
		},
		shadowRadius: 4,
		paddingHorizontal: 2,
		marginTop: same ? 0 : 10,

		//borderRadius: 4,
		//backgroundColor: isSender ? 'whitesmoke' : 'rgba(0,58,91,.4)',
		borderRightColor: '#BCAF37',
		borderLeftColor: '#0038FF',
		borderRightWidth: isSender ? 4 : 0,
		borderLeftWidth: !isSender ? 4 : 0,
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
	if (!chat.timestamp) return <View></View>;

	return (
		<View key={i}>
			<View style={textBoxStyle}>
				<View style={{ alignItems: isSender ? 'flex-end' : 'flex-start' }}>
					{!same && (
						<Text
							style={{
								marginTop: -3,
								fontSize: 14,
								fontWeight: '700',
								textTransform: 'uppercase',
								color: isSender ? '#BCAF37' : '#0038FF',
							}}>
							{isSender ? 'me' : friend.username}
						</Text>
					)}
				</View>
				<View
					style={[
						styles.msgBox,
						{
							alignItems: 'center',
							flexDirection: 'row',
							justifyContent: 'space-between',
							//borderBottomWidth: 0.5,
							borderBottomColor: 'rgba(0,0,0,.1)',
						},
					]}>
					{chat.timestamp && isSender && (
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<Text style={styles.time}>{unixToHourMin()}</Text>
						</View>
					)}

					<View
						style={{
							marginTop: same ? 4 : 0,
							fontSize: 14,
							maxWidth: '80%',
							minWidth: '40%',
							paddingVertical: 10,
							paddingHorizontal: 10,
							borderTopLeftRadius: isSender ? 10 : 2,
							borderBottomLeftRadius: isSender ? 10 : 2,
							borderTopRightRadius: !isSender ? 10 : 2,
							borderBottomRightRadius: !isSender ? 10 : 2,
							backgroundColor: isSender ? '#DFDBC6' : '#D2F7FF',
						}}>
						<Text
							style={{
								color: !isSender ? 'black' : 'black',
								fontWeight: '400',
								fontSize: 14,
							}}>
							{chat.message}
						</Text>
					</View>

					{chat.timestamp && !isSender && (
						<View>
							<Text style={styles.time}>{unixToHourMin()}</Text>
						</View>
					)}
				</View>
			</View>
			{isSender && chat == arr[0] && <Text style={styles.seen}>{status}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		marginTop: -3,
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	msg: {
		fontSize: 14,
		paddingVertical: 0,
		//paddingHorizontal: 10,
	},
	msgBox: {
		flex: 1,
		flexDirection: 'column',
	},
	seen: {
		marginTop: 4,
		marginHorizontal: 20,
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
