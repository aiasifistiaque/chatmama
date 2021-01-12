import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';

export const getFriends = user => {
	const db = firebase.firestore();
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);

	const friendList = () => {
		setLoading(true);
		db.collection('friends')
			.where('users', 'array-contains', user.uid)
			.where('status', '==', 'friends')
			.get()
			.then(doc => {
				if (doc.size > 0) {
					let friendsArray = [];
					doc.forEach(dat => {
						if (dat.data().sender == user.uid) {
							friendsArray.push(dat.data().receiver);
						} else if (dat.data().receiver == user.uid) {
							friendsArray.push(dat.data().sender);
						}
					});
					//distinct
					const distinctArray = friendsArray.filter(
						(v, i, a) => a.indexOf(v) === i
					);
					db.collection('users')
						.where('uid', 'in', distinctArray)
						.get()
						.then(userDoc => {
							if (userDoc.size > 0) {
								let tempArr = [];
								userDoc.forEach(userData => {
									tempArr.push(userData.data());
								});
								setFriends(tempArr);
							}
							setLoading(false);
						});
				}
			});
	};
	useEffect(() => {
		friendList();
	}, []);

	return { friends, loading };
};
