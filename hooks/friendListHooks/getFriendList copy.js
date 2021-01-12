import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';

export function getFriendList(user) {
	const db = firebase.firestore();
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState();

	const activeChats = () => {
		setLoading(true);
		db.collection('chats')
			.where('people', 'array-contains', user.uid)
			.get()
			.then(doc => {
				if (doc.size < 1) {
					setLoading(() => false);
					setNotFound(() => true);
				} else if (doc.size > 0) {
					let friendsArray = [];
					doc.forEach(dat => {
						const idOfFriend =
							dat.data().sender == user.uid
								? dat.data().receiver
								: dat.data().sender;
						friendsArray.push(db.collection('users').doc(idOfFriend));
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
							setNotFound(false);
						});
				}
			});
	};

	useEffect(() => {
		requests();
	}, []);

	return { friends, loading, notFound };
}
