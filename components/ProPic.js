import React, { useEffect, useState } from 'react';
import { Image, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default function ProPic({ uid, style }) {
	const [image, setImage] = useState();
	const [loading, setLoading] = useState(false);
	const storage = firebase.storage();
	const uri = storage.ref().child(uid + '/profilePicture');

	useEffect(() => {
		setLoading(true);
		uri
			.getDownloadURL()
			.then(function (url) {
				setImage({ uri: url });
				setLoading(false);
			})
			.catch(function (error) {
				setImage(require('../assets/prof.png'));
				setLoading(false);
			});
	}, []);

	if (loading) return <ActivityIndicator size='small' />;

	return <Image source={image} style={style} />;
}
