import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from "../redux/ActionCreators";
import { color } from "react-native-reanimated";


const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments
    };
};

const mapDispatchToProps = {
    postFavorite: (campsiteId) => postFavorite(campsiteId),
    postComment: (comment) => postComment(comment),
};

function RenderCampsite(props) {

    const { campsite } = props;

    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{ uri: baseUrl + campsite.image }}
                onShowModal={() => this.toggleModal()}
            >
                <Text style={{ margin: 10 }}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow}>
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ?
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />
                    <Icon
                        name='pencil'
                        type='font-awesome'
                        color='#5637DD'
                        raised
                        reverse
                        onPress={() => props.onShowModal()}
                    />
                </View>
            </Card>
        );
    }
    return <View />;
}


function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating
                    style={{ fontSize: 12 }}
                    startingValue={renderCommentItem}
                    imageSize={10}
                    style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                    readonly
                >
                    {item.rating}
                    Stars
                </Rating>
                <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorite: false,
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        };
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    markFavorite() {
        this.setState({ favorite: true });
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment = (campsiteId) => {
        this.props.postComment({
            campsiteId,
            rating: this.state.rating,
            text: this.state.text,
            author: this.state.author,
        });
        this.toggleModal();
    };

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            showModal: false
        });
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.state.favorite}
                    markFavorite={() => this.markFavorite()}
                />
                <RenderComments comments={comments} />
                <Modal>
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={this.state.campers}
                            imageSize={40}
                            onFinishRating={rating => this.setState({ rating: rating })}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon='user-o'
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={rating => this.setState({ rating: rating })}
                            value
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon='comment-o'
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={rating => this.setState({ rating: rating })}
                            value
                        />
                        <View>
                            <Button
                                title='Submit'
                                color='#5637DD'
                                onPress={() => {
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                title='Cancel'
                                color='#808080'
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps)(CampsiteInfo);