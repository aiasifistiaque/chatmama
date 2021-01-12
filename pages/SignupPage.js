import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import TermsLogin from '../components/TermsLogin';
import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';
//import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';

export default function SignupPage({ navigation }) {
	const keyboard = useKeyboardVisibility();
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [confirmPass, setConfirmPass] = useState();
	const [errMessage, setErrMessage] = useState();
	const [loading, setLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const signup = () => {
		setLoading(true);
		if (email.length < 1) {
			setErrMessage('enter a valid email');
			setIsError(true);
			setLoading(false);
			return;
		}
		if (pass.length < 8) {
			setErrMessage('Password Must be 8 letters long');
			setIsError(true);
			setLoading(false);
			return;
		}

		if (pass == confirmPass) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, pass)
				.then(() => {
					setErrMessage('Success');
					setIsError(true);
					setLoading(false);
					navigation.navigate('Login');
				})
				.catch(function (error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					setErrMessage(errorMessage);
					setLoading(false);
					setIsError(true);
					return;
				});
		} else {
			setErrMessage('Password does not match');
			setIsError(true);
			setLoading(false);
			return;
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar style='light' />

			<ImageBackground
				source={require('../assets/su.jpg')}
				style={styles.bgImage}>
				<SafeAreaView
					style={{
						flex: keyboard ? 1 : 2,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Text
						style={{
							marginTop: keyboard ? 0 : '40%',
							color: 'rgba(255,255,255,.9)',
							fontSize: 35,
							fontWeight: '600',
						}}>
						Sign Up
					</Text>
				</SafeAreaView>
				<View
					style={{
						flex: keyboard ? 6 : 3,
						alignItems: 'center',
						justifyContent: keyboard ? 'flex-start' : 'center',
					}}>
					<View style={styles.input}>
						<Image source={require('../assets/email.png')} />
						<TextInput
							style={styles.inputText}
							placeholder='Email'
							placeholderTextColor='rgba(0,0,0,.6)'
							onChangeText={email => setEmail(email)}
							value={email}
						/>
					</View>
					<View style={styles.input}>
						<Image source={require('../assets/pass.png')} />
						<TextInput
							style={styles.inputText}
							placeholder='Password'
							placeholderTextColor='rgba(0,0,0,.6)'
							onChangeText={text => setPass(text)}
							value={pass}
							secureTextEntry={true}
						/>
					</View>

					<View style={styles.input}>
						<Image source={require('../assets/pass.png')} />
						<TextInput
							style={styles.inputText}
							placeholder='Confirm Password'
							placeholderTextColor='rgba(0,0,0,.6)'
							onChangeText={text => setConfirmPass(text)}
							value={confirmPass}
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.agree}>
						<Text style={{ color: 'white', fontSize: 12 }}>I agree to </Text>
						<Text style={{ color: 'rgba(238,226,122,.9)', fontSize: 12 }}>
							Terms and Conditions
						</Text>
					</View>
					{isError ? (
						<Text style={{ color: 'crimson' }}>{errMessage}</Text>
					) : null}

					<TouchableOpacity style={styles.signupButton} onPress={signup}>
						<Text style={styles.buttonText}>
							{loading ? 'loading...' : 'Create Account'}
						</Text>
					</TouchableOpacity>
				</View>
				{!keyboard && (
					<View style={styles.bContainer}>
						<View style={styles.already}>
							<Text style={styles.alreadyText}>Already have an account? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Login')}>
								<Text style={styles.loginText}>Log In</Text>
							</TouchableOpacity>
						</View>

						<TermsLogin />
					</View>
				)}
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	bgImage: {
		flex: 1,
		resizeMode: 'cover',
		width: '100%',
	},
	input: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,.8)',
		width: 300,
		alignItems: 'center',
		marginVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 50,
	},
	inputText: {
		flex: 1,
		paddingHorizontal: 5,
		paddingVertical: 15,
	},
	signupButton: {
		backgroundColor: 'rgba(238,226,122,.6)',
		width: 200,
		paddingVertical: 15,
		marginVertical: '8%',
		paddingHorizontal: 15,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 16,
	},
	already: {
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	alreadyText: {
		color: 'white',
		fontSize: 15,
		fontWeight: '600',
	},
	loginText: {
		color: 'rgba(238,226,122,.9)',
		fontSize: 15,
		fontWeight: '600',
	},
	bContainer: {
		flex: 1.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	agree: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
