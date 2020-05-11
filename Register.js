import React, { useState } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  ScrollView
} from 'react-native';

import {validations, config} from './Utils';
import CheckBox from '@react-native-community/checkbox';
// import { ScrollView } from 'react-native-gesture-handler';

export default function RegisterView({ navigation }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState(""); ``
  const [checked, setChecked] = useState(false);

  const handleUsername = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: config.SERVER+ "/checkUsername",
      data: { username: username }
    })
      .then(resp => {
        if (resp.data === 1) {
          Alert.alert("This username is not available");
          setUsername("");
        }
      })
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if(!validations.email.test(email)){
      Alert.alert("Entered email is not of email type.");
    }
    else if (username != "" && email != "" && password != "" && firstname != "" && lastname != "") {

      if (checked != false) {
        axios({
          method: "post",
          url: config.SERVER+ "/signup",
          data: {
            username: username,
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname
          }
        })
          .then(resp => {
            console.log("Response from /signup axios: " + JSON.stringify(resp.data));
            setChecked(false);
            setUsername("");
            setEmail("");
            setPassword("");
            setFirstname("");
            setLastname("");
            if (resp.data === 1) {
              Alert.alert("This account is already registered.");

            }
            else {
              Alert.alert("Verification Email has been sent to your registered email id.");
              props.navigation.navigate("Login");
            }

          })
      } else {
        Alert.alert("Please Accept Terms&Conditions.")
      }
    } else {
      Alert.alert("Please enter all details.")
    }

  }

  return (
    <ScrollView style={{backgroundColor: '#ddebea'}}>
    <View style={[styles.container,{paddingTop: 30}]}>
      
      <View style={styles.inputContainer}>
        {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/message/ultraviolet/50/3498db' }} /> */}
        <TextInput style={styles.inputs}
          placeholder="Username"
          value={username}
          onBlur={handleUsername}
          underlineColorAndroid='transparent'
          onChangeText={(username) => setUsername(username)} />
        {/* <Text id="username" style={{fontSize: 10}}>Hey There</Text> */}
      </View>

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

      <View style={styles.inputContainer}>
        {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} /> */}
        <TextInput style={styles.inputs}
          placeholder="Firstname"
          value={firstname}
          underlineColorAndroid='transparent'
          onChangeText={(name) => setFirstname(name)} />
      </View>

      <View style={styles.inputContainer}>
        {/* <Image style={styles.inputIcon} source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }} /> */}
        <TextInput style={styles.inputs}
          value={lastname}
          placeholder="Lastname"
          underlineColorAndroid='transparent'
          onChangeText={(name) => setLastname(name)} />
      </View>

      <CheckBox
        value={checked}
        disabled={false}
        onChange={() => setChecked(!checked)}
      /><Text style={{ marginBottom: 25 }}>*Accept Terms and Conditions</Text>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={handleRegister}>
        <Text style={styles.loginText}>Register</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Login")} >
        <Text>Login</Text>
      </TouchableHighlight>
      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "center",
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