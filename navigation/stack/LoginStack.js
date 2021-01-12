import React, { useEffect, useState, useRef } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';
import TabNavigator from '../tab';
import { useLogged } from '../../hooks';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ConversationPage from '../../pages/ConversationPage';
import { AppState, View, Text, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const Stack = createStackNavigator();

export function LoginStack() {
	return useLogged() ? <HomeStack /> : <LStack />;
}

const LStack = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='Signup' component={SignupPage} />
		</Stack.Navigator>
	);
};

const HomeStack = () => {
	const db = firebase.firestore();
	const user = firebase.auth().currentUser;
	const appState = AppState.currentState;
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);

	const isOnline = () => {
		console.log('appstate', appState);
		db.collection('onlinestatus').doc(user.uid).set({
			status: AppState.currentState,
			lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
		});
		AppState.addEventListener('change', () => {
			user &&
				db.collection('onlinestatus').doc(user.uid).set({
					status: AppState.currentState,
					lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
				});
		});
	};

	useEffect(() => {
		isOnline();
		//egisterForPushNotificationsAsync();
		if (user) {
			db.collection('users')
				.doc(user.uid)
				.get()
				.then(doc => {
					if (doc.exists) {
						console.log('this user already exists');
					} else {
						const [username, provider] = user.email.split('@');
						db.collection('users').doc(user.uid).set({
							displayName: user.displayName,
							uid: user.uid,
							email: user.email,
							username: username,
							phoneNumeber: user.phoneNumber,
							photoUrl: user.photoURL,
						});
					}
				})
				.catch(error => {
					console.log(
						'there was an error while fetching user from auth to user table',
						error
					);
				});
		}
		return () => {
			console.log('listener is supposed to be removed');
			AppState.removeEventListener('change', () =>
				console.log('listener was removed')
			);
		};
	}, [user]);

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

	return (
		<View style={{ flex: 1 }}>
			<PushNotification />

			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name='Tabs' component={TabNavigator} />
				<Stack.Screen name='Chat' component={ConversationPage} />
			</Stack.Navigator>
		</View>
	);
};

const PushNotification = () => {
	const db = firebase.firestore();
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	const activeChats = () => {
		db.collection('latestChat')
			.doc(firebase.auth().currentUser.uid)
			.collection('activefriends')
			.orderBy('timestamp', 'asc')
			.onSnapshot(doc => {
				if (doc.size < 1) {
				} else if (doc.size > 0) {
					const user = firebase.auth().currentUser.uid;
					doc.docChanges().forEach(change => {
						if (
							change.doc.data().status &&
							change.doc.data().status == 'sent'
							//change.doc.data().sender != firebase.auth().currentUser.uid
						) {
							console.log(change.doc.data().status);
							console.log(change.doc.data().message);
							sendPushNotification({
								expoPushToken: expoPushToken,
								title: change.doc.data().username,
								body: change.doc.data().message,
							});
						}
					});
				}
			});
	};

	useEffect(() => {
		activeChats();
	}, []);

	const newNotification = () => {};

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current = Notifications.addNotificationReceivedListener(
			notification => {
				setNotification(notification);
			}
		);

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current = Notifications.addNotificationResponseReceivedListener(
			response => {
				console.log(response);
			}
		);

		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
			Notifications.removeNotificationSubscription(responseListener);
		};
	}, []);

	return null;
};

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification({ expoPushToken, body, title }) {
	const message = {
		to: expoPushToken,
		sound: 'default',
		title: title,
		body: body,
		data: { data: 'goes here' },
	};

	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});
}

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		//alert('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return token;
}
