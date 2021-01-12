import * as firebase from 'firebase';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';

export default function getUser() {
	const db = firebase.firestore();
	const current = firebase.auth().currentUser;
	const [user, setUser] = useState('');
	useEffect(() => {
		db.collection('users')
			.doc(current.uid)
			.get()
			.then(doc => {
				if (doc.exists) {
					setUser(() => doc.data());
				}
			});
	}, [current]);

	return user;
}
