import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {validations, config } from './Utils';
let email1;
function ChangePassword(props) {
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        async function getUser() {
            email1 = await AsyncStorage.getItem('email');
            // console.log("Email in change password comp.: "+email1);

            axios({
                method: "post",
                url: config.SERVER + "/user",
                data: { email: email1 }
            })
                .then(resp => {
                    console.log("Response from /user in ChangePasword comp: " + JSON.stringify(resp.data));
                    setPassword(resp.data.password);
                })
        }

        getUser();
    })

    function handleSave() {
        if (oldPassword && newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                Alert.alert("Your passwords didn't match.");
            }
            else if (oldPassword != password) {
                Alert.alert("Your old password is not correct.");
            }
            else {
                // console.log("Email in handlesave changePassword comp: "+email1);
                if (password != undefined) {
                    axios({
                        method: "POST",
                        url: config.SERVER + "/changepassword",
                        data: { email: email1, password: newPassword }
                    })
                        .then(resp => {
                            // console.log("Response from /changepassword in Changepassword  comp: "+resp.data);
                            if(resp.data === '0'){
                                Alert.alert("There is some error in changing password. Please try after sometime.");
                            }
                            else if(resp.data == '2'){
                                Alert.alert("Your password has been changed but this is same as previous.");
                            }
                            else{
                                Alert.alert("Your password has been changed successfully. Thanks");
                            }
                        })
                }
                setOldPassword("");
                setPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        }
        else {
            Alert.alert("Please enter all details.");
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        value={oldPassword}
                        placeholder="Old Password:"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={value => setOldPassword(value)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} /> */}
                    <TextInput style={styles.inputs}
                        value={newPassword}
                        placeholder="New Password:"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={value => setNewPassword(value)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} /> */}
                    <TextInput style={styles.inputs}
                        value={confirmPassword}
                        placeholder="Confirm Password:"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={value => setConfirmPassword(value)}
                    />
                </View>

                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={handleSave} >
                    <Text style={styles.loginText}>Save</Text>
                </TouchableHighlight>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddebea',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    inputs: {
        height: 45,
        marginLeft: 5,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: "#f5882a",
    },
    loginText: {
        color: 'white',
    }
});

export default ChangePassword;