import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import {validations, config } from './Utils';
import { postUploaded, categoryUploaded } from './js/actions/index';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';

const mapStateToProps = state => {
    return { categories: state.categories, post: state.categories }
}

function Category({ item, filterUpload, post }) {


    return (
        <View>
            <TouchableOpacity onPress={() => filterUpload(item.categoryName)}>
                <View style={styles.category}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: "config.SERVER + /" + item.categoryImage }} />
                    <Text style={{ fontSize: 25 }}>{item.categoryName}</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "#c5c7c9",
                    }}

                />
            </TouchableOpacity>
        </View>
    )
}

function Categories(props) {
    const [post, setPost] = useState("");

    function filterUpload(singlecategory) {

        if (singlecategory != "all") {
            const posts = post.filter(value => value.category === singlecategory);
            // console.log("Posts in Category Component: "+JSON.stringify(posts));
            if (posts.length == 0) {
                Alert.alert("No post for this category");
            }
            else {
                props.postUploaded(posts);
                props.navigation.navigate("Home");
            }
        }
        else{
            props.postUploaded(post);
                props.navigation.navigate("Home");
        }
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: config.SERVER + '/showpost'
        })
            .then(resp => {
                props.postUploaded(resp.data);
                setPost(resp.data);
            })


        axios({
            method: 'get',
            url: config.SERVER + '/showcategory'
        }).then(resp => {
            // await setEmail(await AsyncStorage.getItem('email'));
            // console.log("Email stored in Home Component: "+email);
            props.categoryUploaded(resp.data);
        })
    }, []);

    return (
        <View style={styles.container}>
            {/* {console.log("Navigation Object: "+JSON.stringify(props.navigation.navigate))} */}
            <View style={styles.main}>
                <ScrollView>
                    <TouchableOpacity onPress={() => filterUpload("Cats")}>
                        <View style={styles.category}>
                            <Image style={{ width: 50, height: 50 }} source={require('./images/icon_01.png')} />
                            <Text style={{ fontSize: 25 }}>Cats</Text>
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#c5c7c9",
                            }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => filterUpload("Dogs")}>
                        <View style={styles.category}>
                            <Image style={{ width: 50, height: 50 }} source={require('./images/icon_02.png')} />
                            <Text style={{ fontSize: 25 }}>Dogs</Text>
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#c5c7c9",
                            }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => filterUpload("Birds")}>
                        <View style={styles.category}>
                            <Image style={{ width: 50, height: 50 }} source={require('./images/icon_03.png')} />
                            <Text style={{ fontSize: 25 }}>Birds</Text>
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#c5c7c9",
                            }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => filterUpload("Rabbits")}>
                        <View style={styles.category}>
                            <Image style={{ width: 50, height: 50 }} source={require('./images/icon_04.png')} />
                            <Text style={{ fontSize: 25 }}>Rabbits</Text>
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#c5c7c9",
                            }}

                        />
                    </TouchableOpacity>
                    <FlatList
                        contentContainerStyle={{}}
                        data={props.categories}
                        renderItem={({ item }) => <Category item={item} filterUpload={filterUpload} post={post} />}
                    />
                    <TouchableOpacity onPress={() => filterUpload("Others")}>
                        <View style={styles.category}>
                            <Image style={{ width: 50, height: 50 }} source={require('./images/icon_05.png')} />
                            <Text style={{ fontSize: 25 }}>Others</Text>
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#c5c7c9",
                            }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => filterUpload("all")}>
                        <View style={styles.category}>
                            <Image style={{ width: 50, height: 50 }} source={require('./images/icon_05.png')} />
                            <Text style={{ fontSize: 25 }}>ALL</Text>
                        </View>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#c5c7c9",
                            }}

                        />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.menu}>

                <View style={styles.icon}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Home")} >
                        <Icon
                            name="home"
                            color="#fff"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Categories")}>
                        <Icon
                            name="pets"
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
    category: {
        flexDirection: "row",
        padding: 10
    },
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

export default connect(mapStateToProps, { postUploaded, categoryUploaded })(Categories);