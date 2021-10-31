/**
 * @author Rafael Armênio <rafael.armenio@gmail.com>
 */

import { NavigationHelpers } from '@react-navigation/core';
import { Route } from '@react-navigation/routers';
import axios from 'axios';
import moment from 'moment';
import { Box, FlatList, HStack, Image, Pressable, Text, Toast, VStack } from 'native-base';
import React from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';

import Loader from '../../components/Loader';
import NetworkStatus from '../../components/NetworkStatus';

type ReadIndexProps = {
    route: Route<string, object> & {
        params: {
            type: string
        }
    };
    navigation: NavigationHelpers<any>;
};

type RedditItem = {
    id: string;
    thumbnail: string;
    title: string;
    author: string;
    created: number;
    score: number;
    num_comments: number;
    url: string;
};

type RedditEntry = {
    kind: string;
    data: RedditItem;
};

type RedditEntries = {
    after: string;
    children?: RedditEntry[];
    dist: number;
};

type RedditResult = {
    kind: string;
    data: RedditEntries;
};

type ReadIndexState = {
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    type: string;
    result?: RedditResult;
};

class ReadIndexScreen extends React.Component<ReadIndexProps, ReadIndexState> {

    public state: ReadIndexState = {
        isLoading: true,
        isRefreshing: false,
        isLoadingMore: false,
        type: 'top'
    };

    private loadData = () => {
        let queryString = '';
        if (this.state.isLoadingMore && this.state.result?.data?.after) {
            queryString = `?after=${this.state.result?.data?.after}`;
        }

        axios.get(`https://api.reddit.com/r/pics/${this.state.type}.json${queryString}`)
            .then(async response => {
                if (!response.data || !response.data.data || !response.data.data.children) {
                    Toast.show({
                        title: 'Unable to fetch data.',
                        status: 'danger',
                        duration: 2500
                    });

                    return;
                }

                let result = { ...response.data };

                if (this.state.isLoadingMore && this.state.result?.data?.children) {
                    result.data.children = [
                        ...this.state.result?.data?.children,
                        ...result.data.children
                    ];
                }

                this.setState({
                    result,
                    isRefreshing: false,
                    isLoading: false,
                    isLoadingMore: false
                });
            }).catch(async error => {
                Toast.show({
                    title: 'Unable to fetch data.',
                    status: 'danger',
                    duration: 2500
                });
            });
    }

    private loadMore = async () => {
        if (
            this.state.isLoadingMore
            || this.state.isRefreshing
            || this.state.isLoading
        ) {
            return;
        }

        await this.setState({
            isLoadingMore: true
        });

        this.loadData();
    }

    private onRefresh = () => {
        if (
            this.state.isLoadingMore
            || this.state.isRefreshing
            || this.state.isLoading
        ) {
            return;
        }

        this.setState({
            isRefreshing: true
        });

        this.loadData();
    }

    public componentDidMount = async () => {
        await this.setState({
            type: this.props.route.params.type
        });

        this.loadData();
    }

    private abbreviateNumber = (value: number | null) => {
        if (!value) {
            return '0';
        }

        let newValue = value;

        if (value < 1000) {
            return newValue;
        }

        let suffixes: string[] = ['', 'K', 'M', 'B', 'T'];
        let suffixNum: number = Math.floor((value.toString()).length / 3);
        let shortValue: string = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = (suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision);
            let dotLessShortValue = (shortValue).replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (parseFloat(shortValue) % 1 != 0) {
            shortValue = parseFloat(shortValue).toFixed(1);
        }

        return `${shortValue}${suffixes[suffixNum]}`;
    }

    render() {
        return (
            <NetworkStatus>
                <Box style={{
                    flex: 1
                }}>
                    {this.state.isLoading ? (
                        <Loader isLoading={this.state.isLoading} />
                    ) : (
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={this.state.result?.data?.children}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh}
                                    tintColor="#ff4500"
                                />
                            }

                            showsVerticalScrollIndicator={true}
                            renderItem={(e) => {

                                const item: RedditItem = e.item.data;

                                return (
                                    <TouchableOpacity
                                        activeOpacity={.7}
                                        onPress={() => {
                                            this.props.navigation.navigate('ReadShowScreen', {
                                                id: item.id,
                                                url: item.url
                                            });
                                        }}
                                    >
                                        <Box
                                            key={`${this.state.type}-${item.id}`}
                                            borderBottomWidth="1"
                                            _dark={{
                                                borderColor: "gray.600",
                                            }}
                                            borderColor="coolGray.200"
                                            pl="4"
                                            pr="5"
                                            py="4"
                                        >
                                            <HStack space={3} justifyContent="space-between">
                                                {!!item?.thumbnail && item?.thumbnail.length > 20 && (
                                                    <Image
                                                        rounded='sm'
                                                        size="48px"
                                                        source={{
                                                            uri: item.thumbnail,
                                                        }}
                                                        alt="Thumb"
                                                    />
                                                )}
                                                <VStack justifyContent="space-between" style={{
                                                    flex: 1
                                                }}>
                                                    <Text
                                                        _dark={{
                                                            color: "warmGray.50",
                                                        }}
                                                        color="coolGray.800"
                                                        bold
                                                        fontSize={13}
                                                    >
                                                        {item.title.substring(0, 75)}
                                                        {item.title.length > 75 && '...'}
                                                    </Text>
                                                    <HStack alignItems="flex-end" justifyContent="space-between" mt="1">
                                                        <VStack justifyContent="space-between">
                                                            <HStack alignItems="center">
                                                                <Entypo name="user" size={12} color="gray" />
                                                                <Text
                                                                    color="coolGray.600"
                                                                    _dark={{
                                                                        color: "warmGray.200",
                                                                    }}
                                                                    fontSize={12}
                                                                    ml="1"
                                                                >
                                                                    {item.author}
                                                                </Text>
                                                            </HStack>
                                                            <HStack alignItems="center">
                                                                <Entypo name="clock" size={10} color="gray" />
                                                                <Text
                                                                    color="coolGray.600"
                                                                    _dark={{
                                                                        color: "warmGray.200",
                                                                    }}
                                                                    fontSize={12}
                                                                    ml="1"
                                                                >
                                                                    {moment.unix(item.created).fromNow()}
                                                                </Text>
                                                            </HStack>
                                                        </VStack>
                                                        <HStack>
                                                            <HStack alignItems="center" ml="2">
                                                                <Entypo name="star" size={12} color="orange" />
                                                                <Text
                                                                    color="coolGray.600"
                                                                    _dark={{
                                                                        color: "warmGray.200",
                                                                    }}
                                                                    fontSize={12}
                                                                    ml="1"
                                                                >
                                                                    {this.abbreviateNumber(item.score)}
                                                                </Text>
                                                            </HStack>
                                                            <HStack alignItems="center" ml="2">
                                                                <Entypo name="chat" size={12} color="green" />
                                                                <Text
                                                                    color="coolGray.600"
                                                                    _dark={{
                                                                        color: "warmGray.200",
                                                                    }}
                                                                    fontSize={12}
                                                                    ml="1"
                                                                >
                                                                    {this.abbreviateNumber(item.num_comments)}
                                                                </Text>
                                                            </HStack>
                                                        </HStack>
                                                    </HStack>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    </TouchableOpacity>
                                );
                            }}
                            onEndReached={({ distanceFromEnd }) => !this.state.isLoadingMore && this.loadMore()}
                            onEndReachedThreshold={.1}
                            scrollEventThrottle={16}
                            ListFooterComponent={
                                <Box style={{ flex: 1 }}>
                                    {this.state.isLoadingMore && (
                                        <Box style={{ flex: 1 }} p="2">
                                            <ActivityIndicator size="large" color="#ff4500" />
                                        </Box>
                                    )}
                                </Box>
                            }
                        />
                    )}
                </Box>
            </NetworkStatus>
        );
    };
};

export default ReadIndexScreen;
