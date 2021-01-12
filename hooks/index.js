import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';

export const useLogged = () => {
	const [isLogged, setIsLogged] = useState();
	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			user ? setIsLogged(true) : setIsLogged(false);
		});
		return () => {};
	}, [firebase]);
	return isLogged;
};
