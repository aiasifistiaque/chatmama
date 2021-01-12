import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';
import SingleFriendRequest from './SingleFriendRequest';

export default function FriendRequests() {
	//const { friends, loading, notFound } = getFriendList(user);
	const user = firebase.auth().currentUser;
	const db = firebase.firestore();
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState();

	const getList = () => {
		setLoading(true);
		db.collection('friends')
			.where('receiver', '==', user.uid)
			.where('status', '==', 'pending')
			.orderBy('timestamp', 'asc')
			.onSnapshot(
				querySnapshot => {
					setNotFound(false);
					if (querySnapshot.size > 0) {
						const threads = querySnapshot.docs.map(dat => {
							let id;
							return {
								_id: dat.id,
								name: '',
								latestMessage: { text: '' },
								uid: dat.data().sender,
							};
						});
						const reverseThreads = threads.reverse();
						setFriends(threads);
						setLoading(false);
					} else {
						setFriends([]);
						setNotFound(true);
						setLoading(false);
					}
				},
				err => {
					console.log(err.message);
				}
			);
	};

	useEffect(() => {
		getList();
	}, []);

	return (
		<View style={styles.container}>
			{loading ? (
				<Text>loading</Text>
			) : (
				<View
					style={{
						flex: 1,
						width: '100%',
						//alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Text
						style={{
							marginBottom: 10,
							fontSize: 20,
							fontWeight: '600',
							marginHorizontal: 10,
						}}>
						{friends.length == 0 ? 'No' : friends.length} New Friend{' '}
						{friends.length == 1 ? 'Request' : 'Requests'}
					</Text>
					<View style={styles.mainContainer}>
						<View
							style={{
								flex: 1,
								width: '100%',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							{friends.map(
								(friend, i) =>
									i < 2 && (
										<View key={i} style={{ flex: 1, width: '100%' }}>
											<SingleFriendRequest
												friendId={friend.uid}
												user={user}
												i={i}
												friends={friends}
											/>
										</View>
									)
							)}
						</View>
					</View>
					{friends.length > 2 && (
						<TouchableOpacity style={styles.moreButton}>
							<Text style={styles.moreText}>View More</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollContainer: { flex: 1, width: '100%' },
	friendContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 10,
	},
	button: {
		paddingHorizontal: 10,
		paddingVertical: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		borderRadius: 5,
	},
	buttonText: { color: 'white' },
	moreButton: {
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1,
		borderTopColor: 'rgba(0, 58, 91, 0.9)',
	},
	moreText: {
		color: 'rgba(0, 58, 91, 0.9)',
		fontWeight: '600',
		fontSize: 15,
	},
	name: {
		fontSize: 20,
		fontWeight: '600',
	},
	userName: {
		fontSize: 15,
		fontWeight: '600',
		color: 'rgba(0,0,0,.6)',
	},
});
