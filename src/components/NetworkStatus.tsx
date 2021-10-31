/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import React from 'react';

import { Alert, Center, Text } from 'native-base';
import NetInfo from "@react-native-community/netinfo";

type NetworkStatusState = {
    isConnected: boolean;
}

class NetworkStatus extends React.Component<{}, NetworkStatusState> {
    state = {
        isConnected: false
    }

    componentDidMount = async () => {
        const state = await NetInfo.fetch();
        
        this.setState({
            isConnected: state.isConnected ? true : false
        });
    }

    public render() {
        return this.state.isConnected ? (
            this.props.children
        ) : (
            <Center style={{ flex: 1 }}>
                <Text>Check your network connection.</Text>
            </Center>
        );
    };
};

export default NetworkStatus;
