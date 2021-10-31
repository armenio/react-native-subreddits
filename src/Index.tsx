/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import 'react-native-gesture-handler';

import React from 'react';

import SplashScreen from 'react-native-splash-screen';

import App from './App';
import { NativeBaseProvider } from 'native-base';

class Index extends React.Component {
    public componentDidMount = async () => {
        SplashScreen.hide();
    }

    public render() {
        return (
            <NativeBaseProvider>
                <App />
            </NativeBaseProvider>
        );
    };
};

export default Index;
