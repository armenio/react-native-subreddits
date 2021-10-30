/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import React from 'react';

import SplashScreen from 'react-native-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import ReadIndexScreen from './screens/read/ReadIndexScreen';
import ReadShowScreen from './screens/read/ReadShowScreen';

const ReadStack = createStackNavigator();
const ReadStackScreen = (props: any) => {
    return (
        <ReadStack.Navigator
            initialRouteName="ReadIndexScreen"
            screenOptions={{
                headerBackTitleVisible: false,
            }}
        >
            <ReadStack.Screen options={{ headerShown: false }} name="ReadIndexScreen" component={ReadIndexScreen} initialParams={{ ...props.route.params }} />
            <ReadStack.Screen options={{ headerTitle: "View" }} name="ReadShowScreen" component={ReadShowScreen} />
        </ReadStack.Navigator>
    );
};

const Tab = createBottomTabNavigator();
const TabScreen = (props: any) => {
    return (
        <Tab.Navigator
            initialRouteName="NewTab"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: "#ff4500",
                tabBarInactiveTintColor: '#787878',
                style: {
                    backgroundColor: '#ffffff',
                },
            })}
        >
            <Tab.Screen
                name="TopTab"
                component={ReadStackScreen}
                options={{
                    title: 'Top',
                    tabBarIcon: ({ color, size }) => (
                        <SimpleLineIcons name="star" color={color} size={size} />
                    ),
                }}
                initialParams={{
                    type: 'top'
                }}
            />
            <Tab.Screen
                name="NewTab"
                component={ReadStackScreen}
                options={{
                    title: 'New',
                    tabBarIcon: ({ color, size }) => (
                        <SimpleLineIcons name="clock" color={color} size={size} />
                    ),
                }}
                initialParams={{
                    type: 'new'
                }}
            />
            <Tab.Screen
                name="HotTab"
                component={ReadStackScreen}
                options={{
                    title: 'Hot',
                    tabBarIcon: ({ color, size }) => (
                        <SimpleLineIcons name="fire" color={color} size={size} />
                    ),
                }}
                initialParams={{
                    type: 'hot'
                }}
            />
            <Tab.Screen
                name="ControversialTab"
                component={ReadStackScreen}
                options={{
                    title: 'Controversial',
                    tabBarIcon: ({ color, size }) => (
                        <SimpleLineIcons name="dislike" color={color} size={size} />
                    ),
                }}
                initialParams={{
                    type: 'controversial'
                }}
            />
        </Tab.Navigator>
    );
};

const Stack = createStackNavigator();

class App extends React.Component {
    componentDidMount = async () => {
        SplashScreen.hide();
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="TabScreen">
                    <Stack.Screen options={{ headerShown: false }} name="TabScreen" component={TabScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    };
};

export default App;
