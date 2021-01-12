import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

export function useKeyboardVisibility() {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	useEffect(() => {
		// const keyboardWillShowListener = Keyboard.addListener(
		// 	'keyboardWillShow',
		// 	() => {
		// 		setKeyboardVisible(true); // or some other action
		// 	}
		// );
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true); // or some other action
			}
		);
		// const keyboardWillHideListener = Keyboard.addListener(
		// 	'keyboardWillHide',
		// 	() => {
		// 		setKeyboardVisible(false); // or some other action
		// 	}
		// );
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false); // or some other action
			}
		);

		return () => {
			//keyboardWillHideListener.remove();
			//keyboardWillShowListener.remove();
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);
	return isKeyboardVisible;
}
