import React from 'react';
import axios from 'axios';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground
} from 'react-native';
import {validations, config } from './Utils';
import { connect } from 'react-redux';
// import { TouchableHighlight } from 'react-native-gesture-handler';
import { postUploaded } from './js/actions/index';
import ICON from 'react-native-vector-icons/FontAwesome';


function Post(props) {
    function handleLike(post) {
        axios({
            method: "post",
            url: config.SERVER + "/likes",
            data: { email: props.user, image: post.image, username: post.username }
        })
            .then(resp => {
                props.postUploaded(resp.data);
            })
    }

    return (
        <View style={{backgroundColor: "#c7c6c5"}}>
        <View style={{
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: "#fff",
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 2,
        }}>
            <View style={{ flexDirection: "row", padding: 10 }}>
                <View style={{flex: 1, flexDirection: "row"}}>
                <Image style={{ width: 30, height: 30 }} source={require('./images/user3.png')} />
                <Text style={{ paddingTop: 5, padding: 10, fontWeight: "bold" }}>{props.singlepost.username}</Text>
                <Text style={{ paddingBottom: 0, padding: 10 }}> {props.singlepost.date} </Text>
                </View>
                <View style={{flex: 1,flexDirection: "row",justifyContent: "flex-end"}}>
                    <ImageBackground source={require("./images/tag3.png")} style={{width: 100}}>
                    <Text style={{ paddingTop: 5, padding: 10, fontWeight: "bold", color: "#21542f" }}>{props.singlepost.category}</Text>
                    </ImageBackground>
                </View>
            </View>
            <View style={{ padding: 10 }}>
                <Text> {props.singlepost.description} </Text>
            </View>
            <View style={{ zIndex: -10 }}>
                <Image style={{ width: "100%", height: 300 }} source={{ uri: config.SERVER + "/" + props.singlepost.image }} />
            </View>
            <View
                style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 1,
                }}
            />
            <View style={{ flexDirection: "row", padding: 10, zIndex: 10 }}>
                <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>{props.singlepost.likes.length}  </Text>{props.singlepost.likes.indexOf(props.user) == -1 ? <ICON name="thumbs-o-up" size={25} onPress={() => handleLike(props.singlepost)} /> : <ICON name="thumbs-up" size={25} onPress={() => handleLike(props.singlepost)} />}
                </View>
                <View style={{ flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>{props.singlepost.comments.length} </Text><ICON name="comments" size={25} onPress={()=>props.navigation.navigate("Your_Post",{singlepost: props.singlepost, user: props.user})} />
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ICON name="share-alt" size={25} />
                </View>
            </View>
        </View>
        </View>
    )
}

export default connect(null, { postUploaded })(Post);