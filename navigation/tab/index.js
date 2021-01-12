import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../../pages/HomePage';
import { Image } from 'react-native';
import ProfilePage from '../../pages/ProfilePage';
import SearchPage from '../../pages/SearchPage';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color = 'slateblue', size }) => {
					let iconName = 'chat';
					if (route.name === 'Home') {
						return (
							<Image
								style={{ height: 30, width: 30 }}
								source={require(`../../assets/chat.png`)}
							/>
						);
					} else if (route.name === 'Search') {
						return (
							<Image
								style={{ height: 30, width: 30 }}
								source={require(`../../assets/search.png`)}
							/>
						);
					} else if (route.name === 'Profile') {
						return <Image source={require(`../../assets/profile.png`)} />;
					}
					return <Image source={require(`../../assets/chat.png`)} />;
				},
			})}
			tabBarOptions={{
				activeTintColor: 'gray',
				inactiveTintColor: 'white',
				tabStyle: { backgroundColor: '#003A5B' },
			}}>
			<Tab.Screen name='Home' component={HomePage} />
			<Tab.Screen name='Search' component={SearchPage} />
			<Tab.Screen name='Profile' component={ProfilePage} />
		</Tab.Navigator>
	);
}
