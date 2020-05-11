import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    FlatList
} from 'react-native';
import { Icon } from 'react-native-elements';
import ICON from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import { setRemember } from './js/actions/index';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Post from './Post';
import {validations, config } from './Utils';

const mapStateToProps = state => {
    return { post: state.post }
}

function Timeline(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [posts, setPosts] = useState("");
    const [username, setUsername] = useState("");

    function showActionSheet() {
        React.Component.ActionSheet.show();
    }

    useEffect(() => {
        async function getEmail() {
            let email1;
            try {
                email1 = await AsyncStorage.getItem('email');
                setEmail(email1);
                axios({
                    method: "POST",
                    url: config.SERVER + "/user",
                    data: { email: email }
                })
                    .then(resp => {
                        // console.log("Response data from /user on frontend: " + JSON.stringify(resp.data));
                        setName(resp.data.firstname + " " + resp.data.lastname);
                        setUsername(resp.data.username)
                    })

                axios({
                    method: "get",
                    url: config.SERVER + "/showpost"
                })
                    .then(resp => {
                        setPosts(resp.data.filter(singlepost => singlepost.username === username));
                    })
            }
            catch (err) {
                console.log("Error in upload user in timeline: " + err);
            }
        }

        getEmail();
    })

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Image source={require('./images/krishna.jpg')} style={{ position: "absolute", top: 50, left: 20, width: 120, height: 120, zIndex: 10, borderRadius: 60 }} />
                <View style={{ flex: 3, backgroundColor: "#e1f6fc", flexWrap: "wrap-reverse", flexDirection: "row-reverse", padding: 10, zIndex: 5 }} >
                    <Text style={{ color: "black", fontSize: 25, fontWeight: "700", color: "#58b2d6" }} >{name}</Text>
                    {/* {console.log("Name in return: "+name)} */}
                </View>
                <View style={{ flex: 13 }} >

                    <View style={{ flex: 1 }}>
                    </View>
                    <View style={{ flex: 12, marginTop: 10 }}>
                        <ScrollView>
                            <View style={{ marginBottom: 10, padding: 10 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Description: </Text>
                                <Text>This is an example of a comment. You can create as many comments like this one
                                        or sub comments as you like and manage all of your content inside Account.</Text>
                            </View>
                            <View>
                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 50 }}
                                    data={posts}
                                    renderItem={({ item }) => <Post singlepost={item} user={email} navigation={props.navigation}/>}
                                />
                            </View>
                        </ScrollView>

                    </View>

                </View>
            </View>

            <View style={styles.menu}>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
                        <Icon
                            name="home"
                            color="#58b2d6"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={showActionSheet} >
                        <Icon
                            name="settings"
                            color="#58b2d6"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Upload")}>
                        <ICON
                            name="upload"
                            color="#58b2d6"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity>
                        <Icon
                            name="perm-identity"
                            color="#58b2d6"
                            size={40} />
                    </TouchableOpacity>
                </View>

                <ActionSheet
                    ref={o => (React.Component.ActionSheet = o)}
                    title={"Settings"}
                    options={["Logout", "Change Password", "Cancel"]}
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
        flex: 1
    },
    main: {
        flex: 13
    },
    menu: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#e1f6fc"
    },
    icon: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default connect(mapStateToProps, {setRemember })(Timeline);