/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import React from 'react';

import SplashScreen from 'react-native-splash-screen';

import App from './App';
import { NativeBaseProvider } from 'native-base';


class Index extends React.Component {
    componentDidMount = async () => {
        SplashScreen.hide();
    }

    render() {
        return (
            <NativeBaseProvider>
                <App />
            </NativeBaseProvider>
        );
    };
};

export default Index;
