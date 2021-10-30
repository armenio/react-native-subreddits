/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import { Center } from 'native-base';
import React from 'react';

import { ActivityIndicator } from 'react-native';

type LoaderProps = {
    isLoading: boolean;
};

class Loader extends React.Component<LoaderProps> {
    render() {
        return this.props.isLoading && (
            <Center style={{ flex: 1 }}>
                <ActivityIndicator size="large" color="#ff4500" />
            </Center>
        );
    };
};

export default Loader;