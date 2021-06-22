import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem, Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import { CAMPSITES } from '../shared/campsites';


const mapStateToProps = state => {
    return {
        campsites: state.campsites
    };
};

const renderDirectoryItem = ({ item }) => {
    return (
        <Tile
            title={item.name}
            caption={item.description}
            featured
            onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })}
            imageSrc={{ uri: baseUrl + item.image }}
        />
    );
};
class Directory extends Component {

    static navigationOptions = {
        title: 'Directory'
    }

    render() {
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({ item }) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })}
                    leftAvatar={{ source: require('./images/react-lake.jpg') }}
                />
            );
        };

        if (this.props.campsites.isLoading) {
            return <Loading />;
        }
        if (this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={this.props.campsites}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps)(Directory);
