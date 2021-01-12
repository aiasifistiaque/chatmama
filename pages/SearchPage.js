import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
	TextInput,
	ScrollView,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AddStatusButton from '../components/AddStatusButton';
import FriendRequests from '../components/FriendRequests';
import FriendList from '../components/FriendList';
import ProPic from '../components/ProPic';

export default function SearchPage() {
	const name = 'Asif Istiaque';
	const db = firebase.firestore();
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const [friend, setFriend] = useState('');

	const user = firebase.auth().currentUser;

	useEffect(() => {
		setLoading(true);
		const query = search.toLowerCase();

		search.length > 1 &&
			db
				.collection('users')
				.where('username', '==', query)
				.get()
				.then(doc => {
					doc.forEach(usr => {
						//friendStatus(usr.data().uid);
						setFriend(() => usr.data());
						setLoading(false);
						setSearched(true);
					});
				})
				.catch(err => console.log(err));
	}, [search]);

	return (
		<View style={styles.container}>
			<StatusBar style='dark' />
			<View style={styles.top}>
				<View style={styles.topBox}>
					<View style={styles.nameBox}>
						<ProPic uid={firebase.auth().currentUser.uid} style={styles.pp} />
						<Text style={styles.name}>{name}</Text>
					</View>
					<Image
						source={require('../assets/settings.png')}
						style={styles.image}
					/>
				</View>

				<View style={styles.searchBox}>
					<TextInput
						placeholder='Search'
						style={styles.input}
						value={search}
						onChangeText={text => setSearch(text)}
					/>
					<Image
						source={require('../assets/searchblack.png')}
						style={styles.searchIcon}
					/>
				</View>
			</View>
			<View style={styles.bottomBox}>
				{search.length < 1 && (
					<View style={{ flex: 1, width: '100%' }}>
						<View style={{ flex: 3 }}>
							<FriendRequests user={user} />
						</View>
						<View style={{ flex: 4 }}>
							<FriendList user={user} />
						</View>
					</View>
				)}
				{loading ? (
					<Text></Text>
				) : (
					searched && (
						<ScrollView style={{ flex: 2 }}>
							<View style={styles.friendBox}>
								<View style={{}}>
									{friend.displayName && (
										<Text style={{ fontSize: 18 }}>{friend.displayName}</Text>
									)}

									<Text style={{ fontSize: 15 }}>{friend.username}</Text>
								</View>
								<AddStatusButton user={user} friendId={friend.uid} />
							</View>
						</ScrollView>
					)
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,58,91,.06)',
	},
	top: {
		flex: 2.5,
		width: '100%',
		justifyContent: 'center',
	},
	topBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '90%',
		marginLeft: '5%',
		paddingVertical: 10,
	},
	bottomBox: {
		flex: 8,
		width: '90%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	name: {
		fontSize: 20,
		fontWeight: '600',
		paddingHorizontal: 10,
		color: 'rgba(0, 58, 91, 1)',
	},
	searchBox: {
		backgroundColor: 'white',
		borderRadius: 100,
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-between',
		marginLeft: '5%',
	},
	searchIcon: {
		alignSelf: 'center',
		height: 20,
		width: 20,
		marginHorizontal: 10,
	},
	input: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		width: '75%',
	},
	friendBox: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		paddingHorizontal: '20%',
		paddingVertical: 20,
		borderRadius: 100,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	nameBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 25,
		height: 25,
	},
	pp: {
		width: 40,
		height: 40,
		borderRadius: 100,
	},
});

const color = { primary: 'rgba(0, 58, 91, 1)' };
