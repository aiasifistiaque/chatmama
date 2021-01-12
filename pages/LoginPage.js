import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import TermsLogin from '../components/TermsLogin';
import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';
import * as firebase from 'firebase/app';

export default function LoginPage({ navigation }) {
	const keyboard = useKeyboardVisibility();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [showMessage, setShowMessage] = useState(false);

	const login = () => {
		setLoading(true);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(() => {
				setShowMessage(false);
				setLoading(false);
			})
			.catch(function (error) {
				var errorCode = error.code;
				setMessage(error.message);
				setShowMessage(true);
				setLoading(false);
			});
	};

	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<StatusBar style='light' />
			<ImageBackground
				source={require('../assets/lp.jpg')}
				style={styles.bgImage}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: !keyboard ? 'flex-end' : 'flex-start',
						paddingTop: !keyboard ? 0 : 100,
					}}>
					<Text style={styles.loginText}>Login</Text>
					<TextInput
						style={styles.input}
						placeholder='Username'
						placeholderTextColor='rgba(0,0,0,.6)'
						onChangeText={text => setEmail(text)}
						value={email}
					/>
					<TextInput
						secureTextEntry={true}
						style={styles.input}
						placeholder='Password'
						placeholderTextColor='rgba(0,0,0,.6)'
						onChangeText={text => setPassword(text)}
						value={password}
					/>
					{showMessage && <Text style={{ color: 'crimson' }}>{message}</Text>}
					<TouchableOpacity style={styles.loginButton} onPress={login}>
						<Text style={styles.buttonText}>
							{loading ? 'loading...' : 'Log In'}
						</Text>
					</TouchableOpacity>
					<Text style={styles.buttonText}>Forgot Password?</Text>
				</View>
				{!keyboard && (
					<View style={{ flex: 1, alignItems: 'center' }}>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Text style={styles.buttonText}>Don't have an account?</Text>
							<TouchableOpacity
								style={styles.signupButton}
								onPress={() => navigation.navigate('Signup')}>
								<Text style={styles.buttonText}>Sign Up</Text>
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
	loginText: {
		color: 'white',
		fontSize: 25,
		fontWeight: '700',
		marginVertical: 20,
	},
	input: {
		backgroundColor: '#fff',
		width: 300,
		paddingVertical: 15,
		marginVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 50,
	},
	loginButton: {
		backgroundColor: '#BCAF37',
		width: 300,
		paddingVertical: 15,
		marginVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	signupButton: {
		backgroundColor: 'rgba(238,226,122,.6)',
		width: 250,
		paddingVertical: 15,
		marginVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: { color: 'white', fontWeight: '600' },
});

const constants = { inputWidth: '70%' };
