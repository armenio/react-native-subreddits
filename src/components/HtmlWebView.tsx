/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import React from 'react';
 
import { View } from 'native-base';
import { WebView, WebViewMessageEvent, WebViewProps as NativeWebViewProps } from 'react-native-webview';

type Props = NativeWebViewProps & {
    url: string;
    autoHeight?: boolean;
    height?: number | string;
};

type HtmlWebViewState = {
    webViewHeight: string;
}

type DynamicProps = {
    onMessage?: (event: WebViewMessageEvent) => void;
    injectedJavaScript?: string;
}

const injectedJavaScript = `
var count = 0;
function postMessage() {
    window.ReactNativeWebView.postMessage(
        Math.max(document.body.offsetHeight, document.body.scrollHeight)
    );

    count++;

    if (count > 0) {
        clearInterval(interval);
    }
};
postMessage();
var interval = setInterval(postMessage, 200);
`;

class HtmlWebView extends React.Component<Props, HtmlWebViewState> {
    public state: HtmlWebViewState = {
        webViewHeight: 'auto'
    }

    public render() {
        let style = {
            flexGrow: 1,
            height: 'auto'
        };

        let props: DynamicProps = {};

        if (this.props.autoHeight) {
            props.onMessage = async (event: WebViewMessageEvent) => {
                await this.setState({
                    webViewHeight: Number(event.nativeEvent.data).toString()
                })
            };

            props.injectedJavaScript = injectedJavaScript;

            style.height = this.state.webViewHeight;
        }

        return (
            <View style={style}>
                <WebView
                    androidHardwareAccelerationDisabled={true}

                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}

                    style={{
                        flex: 1,
                        opacity: 0.99
                    }}

                    scrollEnabled={true}

//                    originWhitelist={['*']}

                    {...props}

                    source={{ uri: this.props.url }}
                />
            </View>
        );
    };
};

export default HtmlWebView;
