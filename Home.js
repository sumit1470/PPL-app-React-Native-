import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {validations, config } from './Utils';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Animated,
    BackHandler,
    ScrollView
} from 'react-native';

import Post from './Post';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { postUploaded ,setRemember, categoryUploaded } from './js/actions/index';
import ActionSheet from 'react-native-actionsheet';


const mapStateToProps = state => {
    return { post: state.post,remember : state.remember }
}

function Home(props) {
    let scrollView;
    const [email, setEmail] = useState("");

    function showActionSheet() {
        React.Component.ActionSheet.show();
    }

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
        scrollView.scrollTo({
            x: 0,
            y: 0,
            animated: true
        })
    }

    useEffect(() => {
        console.log("Use effect runs of Home comp.");
        BackHandler.addEventListener('hardwareBackPress',function() {
            return true;
        });
        axios({
            method: 'get',
            url: config.SERVER + '/showpost'
        }).then(async resp => {
            await setEmail(await AsyncStorage.getItem('email'));
            // console.log("Email stored in Home Component: "+email);
            // if(props.posts.length === 0)
                props.postUploaded(resp.data);
        });

        axios({
            method: "get",
            url: config.SERVER + "/showcategory"
        }).then(resp => {
            scrollView.scrollTo({
                x: 0,
                y: 0,
                animated: true
            })
            props.categoryUploaded(resp.data);
        })
    }, []);

    return (
        <View style={styles.container}>
            {/* {console.log("Navigation Object: "+JSON.stringify(props.navigation.navigate))} */}
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
                <ScrollView
                 ref = {ref=> {scrollView = ref}}>
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 50 }}
                        data={props.post}
                        renderItem={({ item }) => <Post singlepost={item} user={email} navigation={props.navigation}/>}
                    />
                </ScrollView>
            </View>

            <View style={styles.menu}> 

                <View style={styles.icon}>
                    <TouchableOpacity >
                        <Icon
                            name="home"
                            color="#fff"
                            size={37} />
                            <Text style={{color: "#fff"}}>Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={showActionSheet}>
                        <Icon
                            name="settings"
                            color="#fff"
                            size={37} />
                            <Text style={{color: "#fff"}}>Settings</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Categories")}>
                        <Icon
                            name="pets"
                            color="#fff"
                            size={37} />
                            <Text style={{color: "#fff"}}>Categories</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Timeline")}>
                        <Icon
                            name="perm-identity"
                            color="#fff"
                            size={37} />
                            <Text style={{color: "#fff"}}>Account</Text>
                    </TouchableOpacity>
                </View>
                
                <ActionSheet
                    ref={o => (React.Component.ActionSheet = o)}
                    title={"Settings"}
                    options={["Logout","Change Password", "Cancel"]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={0}
                    onPress={async (index) => {
                        if (index === 0) {
                            try {
                                await AsyncStorage.removeItem('email');
                                 await AsyncStorage.removeItem('remember');
                                 props.setRemember("false");
                                props.navigation.navigate('Login');
                                // console.log("Navigation object in home: "+JSON.stringify(props.navigation));
                            }
                            catch (err) {
                                console.log(await AsyncStorage.getItem("remember"));
                                console.log("Catch in Home: " + err);
                            }
                        }
                        else if(index === 1){
                            props.navigation.navigate("Change Password");
                        }
                    }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#b0afac"
    },
    main: {
        flex: 12,
        // backgroundColor: "#fff"
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

export default connect(mapStateToProps, { postUploaded, setRemember, categoryUploaded })(Home)