import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';
import SingleFriend from './SingleFriend';

export default function FriendList({ user }) {
	const db = firebase.firestore();
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);

	const getFriends = () => {
		setLoading(true);
		db.collection('friends')
			.where('users', 'array-contains', user.uid)
			.where('status', '==', 'friends')
			.orderBy('timestamp', 'desc')
			.onSnapshot(querySnapshot => {
				const threads = querySnapshot.docs.map(dat => {
					let id;
					if (dat.data().sender == user.uid) {
						id = dat.data().receiver;
					} else if (dat.data().receiver == user.uid) {
						id = dat.data().sender;
					}
					return {
						_id: dat.id,
						name: '',
						latestMessage: { text: '' },
						uid: id,
					};
				});
				const reverseThreads = threads.reverse();
				setFriends(threads);
				setLoading(false);
			});
	};

	useEffect(() => {
		getFriends();
	}, []);

	return (
		<View style={styles.container}>
			{loading ? (
				<Text>loading</Text>
			) : (
				<View style={styles.mainContainer}>
					<Text style={{ fontSize: 20 }}>Friends</Text>
					<ScrollView style={styles.scrollContainer}>
						{friends.map((friend, i) => (
							<View key={i} style={{ flex: 1 }}>
								<SingleFriend
									friendId={friend.uid}
									user={user}
									i={i}
									friends={friends}
								/>
							</View>
						))}
						<TouchableOpacity style={styles.moreButton}>
							<Text style={styles.moreText}>View More</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 40,
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
		borderRadius: 8,
	},
	scrollContainer: { width: '100%', paddingVertical: 10 },
	friendContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: '10%',
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(0,0,0,.1)',
		paddingVertical: 10,
		backgroundColor: 'white',
		borderRadius: 10,
		marginVertical: 1,
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
	username: {
		fontSize: 18,
		fontWeight: '600',
		color: 'rgba(0,0,0,.6)',
	},
	image: {
		width: 55,
		height: 55,
		borderRadius: 100,
		marginRight: 8,
	},
});
