import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default function OnlineStatus({ friend }) {
	const db = firebase.firestore();
	const [status, setStatus] = useState('');
	const [lastSeen, setLAstSeen] = useState('');
	const [lastSeenValue, setLastSeenValue] = useState('');
	const isOnline = () => {
		db.collection('onlinestatus')
			.doc(friend.uid)
			.onSnapshot(doc => {
				if (doc.exists) {
					setStatus(doc.data().status);
					setLAstSeen(doc.data().lastSeen);
					unixToHourMin();
				}
			});
	};

	useEffect(() => {
		isOnline();
		unixToHourMin();
	}, []);

	useEffect(() => {}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			unixToHourMin();
		}, 100);

		return () => clearInterval(intervalId); //This is important
	}, [status, lastSeen]);

	const getNumberToMonth = month => {
		switch (month) {
			case '0':
				return 'Jan';
			case '1':
				return 'Feb';
			case '2':
				return 'Mar';
			case '3':
				return 'Apr';
			case '4':
				return 'May';
			case '5':
				return 'Jun';
			case '6':
				return 'Jul';
			case '7':
				return 'Aug';
			case '8':
				return 'Sep';
			case '9':
				return 'Oct';
			case '10':
				return 'Nov';
			case '11':
				return 'Dec';
		}
	};

	const unixToHourMin = () => {
		setLastSeenValue('');
		const unix = lastSeen.seconds;
		if (lastSeen.length < 1) return;
		const nowDate = Date.now();
		const now = new Date(nowDate);
		const nowDay = now.getDate();
		const nowMonth = now.getMonth();
		const nowYear = now.getFullYear();

		const date = new Date(unix * 1000);

		const getDay = date.getDate();
		const getMonth = date.getMonth();
		const getYear = date.getFullYear();

		const minsAgo = Math.floor((nowDate / 1000 - unix) / 60);

		if (minsAgo < 60) {
			if (minsAgo == 0) {
				setLastSeenValue('last seen a few second ago');
				return;
			}
			setLastSeenValue('last seen ' + minsAgo + ' mins ago');
			return;
		}
		const day =
			getNumberToMonth(getMonth.toString()) + ' ' + getDay + ' ' + getYear;
		const hour = date.getHours();

		const min =
			date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
		if (hour == 0) return day + 'at 12:' + min + ' AM';
		if (hour == 12) return day + 'at 12:' + min + ' PM';
		if (hour < 12) {
			if (hour < 10) return `${day} at 0${hour}:${min} AM`;
			else return `${day} at ${hour}:${min} AM`;
		}
		if (hour > 12) {
			let hh = hour - 12;
			if (hh < 10) return `${day} at 0${hh}:${min} PM`;
			else return `${day} at ${hh}:${min} PM`;
		}
	};

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text
				style={{
					fontSize: 20,
					fontWeight: '600',
					color: 'rgba(0, 58, 91, 1)',
				}}>
				{friend.username}
			</Text>
			<Text
				style={{ fontSize: 12, fontWeight: '600', color: 'rgba(0,0,0,.6)' }}>
				{status == 'active' ? 'online' : 'offline'}
			</Text>
		</View>
	);
}
