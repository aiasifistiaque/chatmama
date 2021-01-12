import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './navigation';
import * as firebase from 'firebase';
//import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from './constants';

firebase.initializeApp(firebaseConfig);

export default function App() {
	return <Navigator />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
