import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default function AddStatusButton({ user, friendId }) {
	const [addLoading, setAddLoading] = useState(false);
	const [add, setAdd] = useState('');
	const db = firebase.firestore();
	const [docId, setDocId] = useState();

	const friendStatus = () => {
		setAddLoading(() => true);
		db.collection('friends')
			.where('sender', '==', user.uid)
			.where('receiver', '==', friendId)
			.onSnapshot(dat => {
				if (dat.size > 0) {
					dat.forEach(t => {
						setDocId(() => t.id);
						if (t.data().status == 'friends') {
							//they are freinds
							setAdd(() => 'friends');
							setAddLoading(() => false);
						} else if (t.data().status == 'pending') {
							//show that friend request is sent
							setAdd(() => 'cancel');
							setAddLoading(() => false);
						}
					});
					setAddLoading(() => false);
				} else {
					db.collection('friends')
						.where('sender', '==', friendId)
						.where('receiver', '==', user.uid)
						.get()
						.then(dat => {
							if (dat.size > 0) {
								dat.forEach(t => {
									setDocId(() => t.id);
									if (t.data().status == 'friends') {
										//they are freinds
										setAdd(() => 'friends');
										setAddLoading(() => false);
									} else if (t.data().status == 'pending') {
										//show accept or reject
										setAdd(() => 'decide');
										setAddLoading(() => false);
									}
								});
							} else {
								//show the add button
								setAdd(() => 'add');
								setAddLoading(() => false);
							}
						});
				}
			});
	};

	const addFriend = () => {
		setAddLoading(true);
		if (friendId && user) {
			db.collection('friends')
				.add({
					sender: user.uid,
					receiver: friendId,
					status: 'pending',
					senderStatus: 'added',
					receiverStatus: 'pending',
					users: [user.uid, friendId],
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				})
				.then(doc => {
					friendStatus();
				}, []);
		}
	};

	const acceptFriend = () => {
		setAddLoading(true);
		if (friendId && user) {
			db.collection('friends')
				.doc(docId)
				.update({
					status: 'friends',
					senderStatus: 'added',
					receiverStatus: 'added',
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				})
				.then(doc => {
					friendStatus();
				}, []);
		}
	};

	const rejectFriend = () => {
		setAddLoading(true);
		if (friendId && user) {
			db.collection('friends')
				.doc(docId)
				.delete()
				.then(doc => {
					friendStatus();
				}, []);
		}
	};

	const cancelRequest = () => {
		setAddLoading(true);
		if (friendId && user) {
			db.collection('friends')
				.doc(docId)
				.delete()
				.then(doc => {
					friendStatus();
				}, []);
		}
	};

	useEffect(() => {
		friendStatus();
	}, []);

	if (addLoading) return <ActivityIndicator size='small' />;
	else
		return add == 'add' ? (
			<TouchableOpacity
				onPress={() => addFriend()}
				style={{
					//backgroundColor: 'rgba(0,58,91,.8)',
					paddingVertical: 5,
					borderRadius: 100,
				}}>
				<Text style={{ color: 'rgba(0,58,91,1)', fontWeight: '600' }}>
					{add}
				</Text>
			</TouchableOpacity>
		) : add == 'friends' ? (
			<View
				style={{
					//backgroundColor: 'rgba(0,58,91,.8)',
					paddingVertical: 5,
					borderRadius: 100,
				}}>
				<Text style={{ color: 'rgba(0,58,91,1)', fontWeight: '600' }}>
					{add}
				</Text>
			</View>
		) : add == 'cancel' ? (
			<TouchableOpacity
				onPress={() => cancelRequest()}
				style={{
					//backgroundColor: 'rgba(0,58,91,.8)',
					paddingVertical: 5,
					borderRadius: 100,
				}}>
				<Text style={{ color: 'rgba(0,58,91,1)', fontWeight: '600' }}>
					{add}
				</Text>
			</TouchableOpacity>
		) : add == 'decide' ? (
			<View>
				<TouchableOpacity
					onPress={() => acceptFriend()}
					style={{
						//backgroundColor: 'rgba(0,58,91,.8)',
						paddingVertical: 5,
						borderRadius: 100,
					}}>
					<Text style={{ color: 'rgba(0,58,91,1)', fontWeight: '600' }}>
						accept
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => rejectFriend()}
					style={{
						//backgroundColor: 'rgba(0,58,91,.8)',
						paddingVertical: 5,
						borderRadius: 100,
					}}>
					<Text style={{ color: 'rgba(0,58,91,1)', fontWeight: '600' }}>
						reject
					</Text>
				</TouchableOpacity>
			</View>
		) : (
			<View></View>
		);
}
