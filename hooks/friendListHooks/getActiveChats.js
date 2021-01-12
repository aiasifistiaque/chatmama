import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';

export function getActiveChats(user) {
	const db = firebase.firestore();
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState();
	const [chats, setChat] = useState([]);

	function removeDuplicates(arr, key) {
		return [...new Map(arr.map(item => [item[key], item])).values()];
	}

	const activeChats = () => {
		let ids = [];
		setLoading(true);
		db.collection('chats')
			.where('people', 'array-contains', user.uid)
			.onSnapshot(doc => {
				if (doc.size < 1) {
					setLoading(() => false);
					setNotFound(() => true);
				} else if (doc.size > 0) {
					let friendsArray = [];
					doc.forEach(dat => {
						const idOfFriend =
							dat.data().sender === user.uid
								? dat.data().receiver
								: dat.data().sender;
						db.collection('users')
							.doc(idOfFriend)
							.get()
							.then(snap => {
								friendsArray.push(snap.data());
								setFriends(friendsArray);
								ids.push(idOfFriend);
							});
					});

					setLoading(false);
					setNotFound(false);
				}
			});
	};

	useEffect(() => {
		activeChats();
	}, []);

	return { friends, loading, notFound };
}
