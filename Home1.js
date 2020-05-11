import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';

import Post from './Post';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { postUploaded } from './js/actions/index';
// import ActionSheet from 'react-native-actionsheet';

const mapStateToProps = state => {
    return { post: state.post }
}

function Home(props) {
    const [email, setEmail] = useState("");

    function handlePost(element) {
        let posts = props.post;
        if (element === "lf") {
            posts.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));

        }

        else if (element === "of") {
            posts.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

        }

        else if (element === "ml") {
            posts.sort((a, b) => b.likes.length - a.likes.length);

        }

        else if (element === "mc") {
            posts.sort((a, b) => b.comments.length - a.comments.length);

        }
        props.postUploaded(posts);
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://192.168.43.23:3002/showpost'
        }).then(async resp => {
            await setEmail(await AsyncStorage.getItem('email'));
            // console.log("Email stored in Home Component: "+email);
            props.postUploaded(resp.data);
        })
    }, []);

    return (
        <View style={styles.container}>
            {/* {console.log("Email in render function: "+email)} */}
            <View style={styles.main}>
                <View style={styles.options}>
                    <TouchableHighlight style={styles.option} onPress={() => handlePost("lf")}>
                        <Text style={{ fontWeight: "bold", color: "#f5ebd0" }}>Latst First</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.option} onPress={() => handlePost("of")}>
                        <Text style={{ fontWeight: "bold", color: "#f5ebd0" }}>Oldst First</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.option} onPress={() => handlePost("ml")}>
                        <Text style={{ fontWeight: "bold", color: "#f5ebd0" }}>Most Likes</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.option} onPress={() => handlePost("mc")}>
                        <Text style={{ fontWeight: "bold", color: "#f5ebd0" }}>Most Cmnts</Text>
                    </TouchableHighlight>
                </View>
                <View>
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 50 }}
                        data={props.post}
                        renderItem={({ item }) => <Post singlepost={item} user={email} />}
                    />
                </View>
            </View>

            <View style={styles.menu}>

                <View style={styles.icon}>
                    <TouchableOpacity >
                        <Icon
                            name="home"
                            color="#fff"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity>
                        <Icon
                            name="settings"
                            color="#fff"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Timeline")}>
                        <Icon
                            name="perm-identity"
                            color="#fff"
                            size={40} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: 12
    },
    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: '#03fcec',
        zIndex: 10,
        shadowOffset: {
            width: 0,
            height: 7
        },
        shadowColor: "grey",
        shadowRadius: 10,
        shadowOpacity: 0.26,
        elevation: 4
    },
    option: {
        padding: 7,
        margin: 7,
        backgroundColor: "#f5882a",
        borderRadius: 10,
    },
    menu: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f5882a",
        shadowColor: "#000",
    },
    icon: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
})

export default connect(mapStateToProps, { postUploaded })(Home)