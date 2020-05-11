import React, { useState, useEffect } from 'react';
import RegisterView from './Register';
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

import Home from './Home';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
let asyncemail, asyncremember="false";

export default function LoginView({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    

    const handleLogin = (e) => {
        e.preventDefault();
        if (email != "" && password != "") {
            axios({
                method: "post",
                url: "http://192.168.43.23:3002/login",
                data: { email: email, password: password }
            })
                .then(resp => {
                    if (resp.data == 0) {
                        Alert.alert("*This account is not yet registered.");
                    }
                    else if (resp.data == 2) {
                        Alert.alert("*Your password is wrong");
                    }
                    else {
                        const storeData = async () => {
                            try {
                                if (checked) {
                                    await AsyncStorage.setItem("remember", checked.toString());
                                    // console.log(await AsyncStorage.getItem('remember'));
                                }
                                await AsyncStorage.setItem("email", email);
                                // console.log(await AsyncStorage.getItem('email'));
                                Alert.alert("You have succesfully logged in.");
                                navigation.navigate("Home");
                                setChecked(false);
                                setEmail("");
                                setPassword("");
                            } catch (err) {
                                console.log("Catch err: " + err);
                            }
                        }
                        storeData();
                    }
                })
        }
        else {
            Alert.alert("*Please enter all details.");
        }
    }



    useEffect(() => {
        const getAsyncDetails = async () => {
            try {
                asyncemail = await AsyncStorage.getItem('email');
                // asyncemail = JSON.parse(email1);
                asyncremember = await AsyncStorage.getItem('remember');
                // asyncremember = JSON.parse(remember);
                console.log("Email of Async Storage: " + asyncemail);
                console.log("Remember value of async storage: " + asyncremember);
            } catch (err) {
                console.log("Error in useEffect: " + err);
            }
        }
        getAsyncDetails();
    })

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            {console.log("Value of asyncremember: "+asyncremember)}
            {asyncremember === "true" ? <Home navigation={navigation}/> :
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/message/ultraviolet/50/3498db' }} /> */}
                        <TextInput style={styles.inputs}
                            value={email}
                            placeholder="Email"
                            keyboardType="email-address"
                            underlineColorAndroid='transparent'
                            onChangeText={(email) => setEmail(email)} />
                    </View>

                    <View style={styles.inputContainer}>
                        {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} /> */}
                        <TextInput style={styles.inputs}
                            value={password}
                            placeholder="Password"
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                            onChangeText={(password) => setPassword(password)} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                        <Text style={{}}>Remember</Text>
                        <CheckBox
                            value={checked}
                            disabled={false}
                            onChange={() => setChecked(!checked)}
                        />
                    </View>

                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={handleLogin}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.buttonContainer, { marginBottom: 10 }} >
                        <Text>Forgot your password?</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.buttonContainer}
                        onPress={() => navigation.navigate("Register")} >
                        <Text>Register</Text>
                    </TouchableHighlight>
                </View>}
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