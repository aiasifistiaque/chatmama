import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePage() {
	const user = firebase.auth().currentUser;
	const db = firebase.firestore();
	const storage = firebase.storage();
	const [email, setEmail] = useState('');
	const [userName, setUserName] = useState('');
	const [name, setName] = useState('');
	const [editName, setEditName] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const uri = storage.ref().child(user.uid + '/profilePicture');
	const [picLoading, setPicLoading] = useState();

	const [image, setImage] = useState();

	console.log(image);

	const getImage = () => {
		setPicLoading(true);
		uri
			.getDownloadURL()
			.then(function (url) {
				setImage({ uri: url });
				setPicLoading(false);
			})
			.catch(function (error) {
				setImage(require('../assets/prof.png'));
				setPicLoading(false);
				PIage;
			});
	};

	useEffect(() => {
		setPicLoading(true);
		uri
			.getDownloadURL()
			.then(function (url) {
				setImage({ uri: url });
				setPicLoading(false);
			})
			.catch(function (error) {
				setImage(require('../assets/prof.png'));
				setPicLoading(false);
			});
	}, []);

	const getName = () => {
		db.collection('users')
			.doc(user.uid)
			.get()
			.then(doc => {
				setName(doc.data().displayName);
				setDisplayName(doc.data().displayName);
			});
	};

	//console.log(storageRef.user.email)

	const setNameF = () => {
		db.collection('users')
			.doc(user.uid)
			.update({ displayName: name })
			.then(doc => {
				getName();
				setEditName(false);
			})
			.catch(err => console.log(err));
	};

	useEffect(() => {
		db.collection('users')
			.doc(user.uid)
			.get()
			.then(doc => {
				setEmail(() => doc.data().email);
				setUserName(() => doc.data().username);
				setName(() => doc.data().displayName);
				setDisplayName(() => doc.data().displayName);
			}, []);
	}, [user]);

	//image
	let pick = async () => {
		let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert('Permission to access camera roll is required!');
			return;
		} else {
			pickImage();
		}
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			const storeRef = firebase.storage().ref(user.uid + '/profilePicture');
			const response = await fetch(result.uri);
			const blob = await response.blob();
			const upload = await storeRef.put(blob);
			getImage(upload);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.ppBox}>
				<TouchableOpacity style={{ marginBottom: 20 }} onPress={pick}>
					<Text style={{ color: 'dodgerblue' }}>Change picture</Text>
				</TouchableOpacity>
				{picLoading ? (
					<ActivityIndicator size='large' />
				) : (
					<Image source={image} style={styles.pp} />
				)}

				<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
					{!displayName ? 'Name not set' : displayName}
				</Text>
			</View>

			<View style={styles.box}>
				<Text>Edit Bio</Text>
			</View>
			<View style={styles.boxTwo}>
				<Text>Name</Text>
				{editName ? (
					<View
						style={{
							padding: 10,
							flex: 1,
							borderBottomWidth: 1,
							borderBottomColor: 'black',
						}}>
						<TextInput
							placeholder='Enter name'
							value={name}
							onChangeText={text => setName(text)}
						/>
					</View>
				) : (
					<Text>{!name ? 'not set' : name}</Text>
				)}

				<TouchableOpacity
					onPress={() => (!editName ? setEditName(true) : setNameF())}>
					<Text
						style={{
							color: 'dodgerblue',
							fontSize: 12,
							fontWeight: '600',
						}}>
						{editName ? 'save' : 'edit'}
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.box}>
				<Text style={styles.text}>Username:</Text>
				<Text style={styles.text}>{userName}</Text>
			</View>
			<View style={styles.box}>
				<Text style={styles.text}>Email:</Text>
				<Text style={styles.text}>{email}</Text>
			</View>

			<TouchableOpacity
				onPress={() => {
					db.collection('onlinestatus').doc(user.uid).set({
						status: 'offline',
						lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
					});
					firebase.auth().signOut();
				}}
				style={styles.logoutButton}>
				<Text style={styles.logoutText}>Log Out</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = {
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		paddingHorizontal: '10%',
		paddingVertical: 20,
		backgroundColor: 'rgba(0,58,91,.06)',
	},
	ppBox: {
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 15,
	},
	box: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		width: '80%',
		marginHorizontal: '10%',
		paddingVertical: 15,
		paddingHorizontal: '10%',
		marginVertical: 10,
		borderRadius: 5,
		alignItems: 'center',
	},
	boxTwo: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		width: '80%',
		marginHorizontal: '10%',
		paddingVertical: 15,
		paddingHorizontal: '10%',
		marginVertical: 10,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	text: { flex: 1 },
	logoutButton: {
		backgroundColor: 'white',
		width: '40%',
		paddingVertical: 15,
		paddingHorizontal: 15,
		marginVertical: 10,
		borderRadius: 100,
		alignSelf: 'center',
		alignItems: 'center',
		backgroundColor: '#809A74',
	},
	logoutText: {
		fontWeight: 'bold',
		color: 'white',
	},
	pp: {
		width: 100,
		height: 100,
		borderRadius: 100,
		marginBottom: 20,
	},
};
