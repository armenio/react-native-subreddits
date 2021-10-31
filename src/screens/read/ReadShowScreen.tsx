/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import React from 'react';

import { Box } from 'native-base';
import HtmlWebView from '../../components/HtmlWebView';
import { Route } from '@react-navigation/routers';
import NetworkStatus from '../../components/NetworkStatus';

type ReadShowProps = {
    route: Route<string, object> & {
        params: {
            id: string;
            url: string;
        }
    };
    navigation: any;
};

class ReadShowScreen extends React.Component<ReadShowProps> {
    public componentDidMount = async () => {
        this.props.navigation.setOptions({ headerTitle: `r/pics/${this.props.route.params.id}` })
    }

    public render() {
        return (
            <NetworkStatus>
                <Box style={{
                    flex: 1
                }}>
                    <HtmlWebView url={this.props.route.params.url} />
                </Box>
            </NetworkStatus>
        );
    };
};

export default ReadShowScreen;
