import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
	TextInput,
	ScrollView,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import ProPic from '../components/ProPic';

const unixToHourMin = unix => {
	const date = new Date(unix * 1000);
	const hour = date.getHours();
	const min =
		date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
	if (hour == 0) return '12:' + min + ' am';
	if (hour == 12) return '12:' + min + ' pm';
	if (hour < 12) {
		if (hour < 10) return `0${hour}:${min} am`;
		else return `${hour}:${min} am`;
	}
	if (hour > 12) {
		let hh = hour - 12;
		if (hh < 10) return `0${hh}:${min} pm`;
		else return `${hh}:${min} pm`;
	}
};

export default function HomePage() {
	const user = firebase.auth().currentUser;
	const db = firebase.firestore();
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState();
	const name = user && user.displayName;
	const navigation = useNavigation();

	const activeChats = () => {
		setLoading(true);
		db.collection('latestChat')
			.doc(user.uid)
			.collection('activefriends')
			.orderBy('timestamp', 'asc')
			.onSnapshot(doc => {
				if (doc.size < 1) {
					setLoading(() => false);
					setNotFound(() => true);
				} else if (doc.size > 0) {
					let friendsArray = [];
					const threads = doc.docs.map(documentSnapshot => {
						return {
							_id: documentSnapshot.id,
							name: '',
							latestMessage: { text: '' },
							...documentSnapshot.data(),
						};
					});
					const reverseThreads = threads.reverse();
					setFriends(threads);
					setLoading(false);
					setNotFound(false);
				}
			});
	};

	useEffect(() => {
		activeChats();
	}, [user]);

	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'white',
			}}>
			<StatusBar style='dark' />

			<View
				style={{
					flex: 2.5,
					width: '100%',

					justifyContent: 'center',
				}}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '90%',
						marginLeft: '5%',
						paddingVertical: 10,
					}}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<ProPic
							uid={user.uid}
							style={{ width: 40, height: 40, borderRadius: 100 }}
						/>

						<Text
							style={{
								fontSize: 20,
								fontWeight: '600',
								paddingHorizontal: 10,
								color: color.primary,
							}}>
							{name}
						</Text>
					</View>
					<Image
						source={require('../assets/settings.png')}
						style={{ width: 25, height: 25 }}
					/>
				</View>

				<View
					style={{
						backgroundColor: 'white',
						borderRadius: 100,
						flexDirection: 'row',
						width: '90%',
						justifyContent: 'space-between',
						marginLeft: '5%',
					}}>
					<TextInput
						placeholder='Search friends'
						style={{ paddingVertical: 12, paddingHorizontal: 20, width: '75%' }}
					/>
					<ProPic
						source={ProPic(user.uid)}
						style={{
							alignSelf: 'center',
							height: 20,
							width: 20,
							marginHorizontal: 10,
						}}
					/>
				</View>
			</View>
			<View style={{ flex: 8, width: '90%' }}>
				<ScrollView>
					{friends.map(friend => (
						<View key={friend.uid}>
							<ListedFriend friend={friend} user={user} />
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	);
}

const ListedFriend = ({ friend, user }) => {
	const db = firebase.firestore();
	const secondUserRef = db.collection('latestChat').doc(friend.uid);
	const [status, setStatus] = useState('');
	const secondFriendRef = secondUserRef
		.collection('activefriends')
		.doc(user.uid);

	useEffect(() => {
		const isTextSeen = secondFriendRef.onSnapshot(doc => {
			setStatus(doc.data().status);
		});
	}, []);
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate('Chat', { friend: friend })}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'flex-start',
					paddingBottom: 15,
				}}>
				<ProPic
					uid={friend.uid}
					style={{
						width: 60,
						height: 60,
						borderRadius: 100,
						marginRight: 8,
					}}
				/>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',

						//alignItems: 'center',
						justifyContent: 'space-between',
						marginLeft: 5,
						paddingRight: 5,
						borderBottomColor: 'rgba(255,255,255,.3)',
						borderBottomWidth: 2,
						paddingBottom: 20,
						paddingTop: 5,
					}}>
					<View>
						<Text
							style={{
								fontSize: 18,
								fontWeight:
									friend.sender == user.uid
										? '500'
										: friend.status && friend.status == 'seen'
										? '500'
										: '900',
							}}>
							{friend.username}
						</Text>
						<Text
							style={{
								color:
									friend.sender == user.uid
										? 'rgba(0,0,0,.7)'
										: friend.status && friend.status == 'seen'
										? 'rgba(0,0,0,.7)'
										: 'black',
								fontWeight:
									friend.sender == user.uid
										? '500'
										: friend.status && friend.status == 'seen'
										? '500'
										: '900',
							}}>
							{friend.sender == user.uid && 'you: '}
							{friend.message.length > 22
								? friend.message.substring(0, 22) + '...'
								: friend.message}
						</Text>
					</View>
					<View>
						<Text
							style={{
								fontSize: 12,
								fontWeight: '700',
								color: 'rgba(0,0,0,.4)',
							}}>
							{friend.timestamp && unixToHourMin(friend.timestamp.seconds)}
						</Text>
						{friend.sender == user.uid && <Text>{status}</Text>}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const color = { primary: 'rgba(0, 58, 91, 1) ' };
