import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AddStatusButton from './AddStatusButton';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function SingleFriendRequest({ friendId, user, i, friends }) {
	const db = firebase.firestore();
	const navigation = useNavigation();
	const [friend, setFriend] = useState({});
	const [loading, setLoading] = useState(false);

	const getFriend = () => {
		setLoading(true);
		db.collection('users')
			.doc(friendId)
			.get()
			.then(doc => {
				doc.exists && setFriend(doc.data());
				setLoading(false);
			});
	};

	useEffect(() => {
		getFriend();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			{!loading && (
				<View
					style={{
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
						borderTopRightRadius: i == 0 ? 10 : 0,
						borderTopLeftRadius: i == 0 ? 10 : 0,
						borderBottomRightRadius: i == friends.length - 1 ? 10 : 0,
						borderBottomLeftRadius: i == friends.length - 1 ? 10 : 0,
						marginVertical: 1,
					}}
					key={friend.uid}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Image
							source={require('../assets/prof.png')}
							style={styles.image}
						/>
						<View style={{ paddingVertical: 10, justifyContent: 'center' }}>
							{friend.displayName && (
								<Text style={styles.name}>{friend.displayName}</Text>
							)}
							<Text style={styles.username}>{friend.username}</Text>
						</View>
					</View>

					<View style={styles.buttonContainer}>
						<AddStatusButton user={user} friendId={friendId} />
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
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
});
