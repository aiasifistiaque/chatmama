import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import 'firebase/firestore';
import OnlineStatus from '../components/OnlineStatus';
import Chat from '../components/Chat';
import SendChat from '../components/SendChat';
import { appColors } from '../constants';
import { Spinner } from 'native-base';

export default function ConversationPage({ route }) {
	const db = firebase.firestore();
	const { friend } = route.params;
	const user = firebase.auth().currentUser;
	const users = user && [friend.uid, user.uid];
	const sortedUsers = users.sort();
	const [message, setMessage] = useState('');
	const [chats, setChats] = useState([]);
	const [loading, setLoading] = useState(true);
	const scrollViewRef = useRef();
	const [status, setStatus] = useState('');
	const userRef = db.collection('latestChat').doc(user.uid);
	const secondUserRef = db.collection('latestChat').doc(friend.uid);
	const [chatLimit, setChatLimit] = useState(1);
	const flatListRef = useRef();

	const friendRef = userRef.collection('activefriends').doc(friend.uid);
	const secondFriendRef = secondUserRef
		.collection('activefriends')
		.doc(user.uid);

	const sendMessage = () => {
		const msg = message.trim();
		if (msg.length == 0) return;
		db.collection('chats')
			.add({
				sender: user.uid,
				receiver: friend.uid,
				message: msg,
				room: sortedUsers,
				people: [user.uid, friend.uid],
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})

			.catch(function (error) {
				console.error('Error adding document: ', error);
			});

		const [username, provider] = user.email.split('@');

		const doneRef = friendRef.set({
			uid: friend.uid,
			sender: user.uid,
			message: msg,
			room: sortedUsers,
			people: [user.uid, friend.uid],
			username: friend.username,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			status: 'seen',
		});

		const doneTwoRef = secondFriendRef.set({
			uid: user.uid,
			sender: user.uid,
			message: msg,
			room: sortedUsers,
			people: [user.uid, friend.uid],
			username: username,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			status: 'sent',
		});

		setMessage('');
	};

	useEffect(() => {
		setLoading(true);
		const loadMessage = db
			.collection('chats')
			.where('room', '==', sortedUsers)
			.orderBy('timestamp', 'asc')
			.onSnapshot(
				querySnapshot => {
					const threads = querySnapshot.docs.map(documentSnapshot => {
						return {
							_id: documentSnapshot.id,
							name: '',
							latestMessage: { text: '' },
							...documentSnapshot.data(),
						};
					});
					setLoading(false);
					const reverseThreads = threads.reverse();
					setChats(reverseThreads);
					setLoading(() => false);
					const textIsSeen = friendRef
						.update({ status: 'seen' })
						.catch(err => console.log(err.message));
				},
				err => console.log(err)
			);

		const isTextSeen = db
			.collection('latestChat')
			.doc(friend.uid)
			.collection('activefriends')
			.doc(user.uid)
			.onSnapshot(
				doc => {
					if (doc.exists) {
						setStatus(doc.data().status);
					}
				},
				function (error) {
					console.log(error);
				}
			);

		return () => loadMessage();
	}, []);

	if (loading)
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Spinner color='black' />
			</View>
		);
	else
		return (
			<View style={styles.container}>
				<SafeAreaView style={{ flex: 1, width: '100%' }}>
					<View style={{ flex: 8, width: '100%' }}>
						<View style={styles.nameContainer}>
							<OnlineStatus friend={friend} />
						</View>
						<FlatList
							showsVerticalScrollIndicator={false}
							//onScroll={() => console.log('scrolled')}
							ref={flatListRef}
							data={chats}
							inverted
							style={styles.chatScroll}
							keyExtractor={item => item._id}
							initialNumToRender={10}
							maxToRenderPerBatch={5}
							renderItem={(item, index) => (
								<Chat
									chat={item.item}
									index={index}
									arr={chats}
									user={user}
									friend={friend}
									status={status}
								/>
							)}
						/>
					</View>
					<SendChat
						message={message}
						sendMessage={sendMessage}
						setMessage={text => setMessage(text)}
					/>
				</SafeAreaView>
			</View>
		);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	nameContainer: {
		height: 50,
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(0, 58, 91, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: '5%',
	},
	nameText: {
		fontSize: 20,
		fontWeight: '600',
		color: 'rgba(0, 58, 91, 1)',
	},
	chatScroll: {
		marginVertical: 15,
		marginHorizontal: '5%',
	},
});
