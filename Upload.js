import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Picker, Alert } from 'react-native';
import axios from 'axios';

import { Icon } from 'react-native-elements';
import ICON from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { postUploaded, categoryUploaded } from './js/actions/index';
import { Button } from 'react-native-elements'
import {validations, config } from './Utils';

const mapStateToProps = state => {
    return { categories: state.categories }
}


function Upload(props) {
    const [valueForm, setValueForm] = useState(0);
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    const showForm = () => {

        const choosePhoto = (value) => {
            const options = {
                noData: true,
                title: "Choose Image",
                storageOptions: {
                    skipBackup: true,
                    // path: 'images'
                },
                quality: 1.0,
                maxWidth: 500,
                maxHeight: 500,
            }

            ImagePicker.launchImageLibrary(options, resp => {
                console.log("Response from image picker: " + JSON.stringify(resp));

                if (resp.didCancel) {
                    console.log("User cancelled image picker");
                } else if (resp.error) {
                    console.log("Image picker error: " + resp.err);
                } else if (resp.customButton) {
                    console.log("User tapped custom button: " + resp.customButton);
                } else {
                    // const source = { uri: resp.uri };
                    if (value === "post")
                        setImage(resp);
                    else {
                        setSelectedImage(resp);
                    }
                    // console.log("file path: " + JSON.stringify(resp));
                    // console.log("file data: "+JSON.stringify(resp.data))
                    // console.log("file uri: " + JSON.stringify(source));
                }
            })
        }

        const handleUploadPost = (e) => {
            e.preventDefault();
            const fd = new FormData();

            fd.append("username", username);
            fd.append("category", category);
            fd.append("description", description);
            fd.append("image", {
                name: image.fileName,
                type: image.type,
                uri: image.uri
            })

            // console.log("Form Data in /Upload Post: "+JSON.stringify(fd));

            if (username && description && category && image) {
                axios({
                    method: "POST",
                    url: config.SERVER + "/uploadpost",
                    data: fd,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(resp => {
                    console.log("Response in Upload Post: " + JSON.stringify(resp));
                    props.postUploaded(resp.data);
                    setUsername(""); onPress = { handleUploadPost }
                    setDescription("");
                    setCategory("");
                    setImage("");
                    Alert.alert("Your post is successfully uploaded");
                    props.navigation.navigate("Timeline");
                })
                    .catch(err => { console.log("Error in Upload post: " + err) });
            } else {
                Alert.alert("Please enter all details");
            }
        }

        const handleUploadCategory = (e) => {
            e.preventDefault();
            const fb = new FormData();
            fb.append("categoryName", selectedCategory);
            fb.append("categoryImage", {
                name: selectedImage.fileName,
                type: selectedImage.type,
                uri: selectedImage.uri
            });

            if (selectedCategory && selectedImage) {

                if (props.categories.filter(category=>category.categoryName === selectedCategory).length === 0 && 
                    selectedCategory!="Dogs" && 
                    selectedCategory!="Cats" && 
                    selectedCategory!="Birds" && 
                    selectedCategory!="Rabbits" &&  
                    selectedCategory!="Others")  {
                    axios({
                        method: "POST",
                        url: config.SERVER + "/uploadcategory",
                        data: fb,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(resp => {
                        console.log("Response from /uploadcategory: " + JSON.stringify(resp.data));
                        setSelectedCategory("");
                        setSelectedImage("");
                        props.categoryUploaded(resp.data);
                        Alert.alert("Your category is successfully uploaded");
                        props.navigation.navigate("Timeline");
                    })
                    .catch(err => { console.log("Error in upload category: " + err) })
                }
                else{
                    Alert.alert("This category is already uploaded.");
                }
            } else {
                Alert.alert("Please enter all details");
            }
        }

        const handleBack = ()=>{
            setValueForm(0);
            setUsername("");
            setDescription("");
            setCategory("");
            setImage("");
            setSelectedCategory("");
            setSelectedImage("");
        }

        return (
            <View style={{ backgroundColor: "#fa9d32", flex: 13, justifyContent: "center", alignItems: "center" }}>
                {valueForm === 1 ?

                    <View style={styles.form} >
                        <Text style={{ padding: 10, margin: 10, fontWeight: "bold", fontSize: 30, color: "#fa9d32" }}>UPLOAD POST</Text>
                        <View>{image ? <Image style={{ height: 100, width: 100, marginBottom: 20 }} source={{ uri: image.uri }} /> : null}</View>
                        <View style={styles.formElement}>
                            <TextInput style={{ fontStyle: "italic", fontWeight: "bold", color: "#58b2d6" }} placeholder="Username" value={username} onChangeText={value => setUsername(value)} />
                        </View>
                        {console.log("If part")}
                        <View style={styles.formElement}>
                            <TextInput style={{ fontStyle: "italic", fontWeight: "bold", color: "#58b2d6" }} placeholder="Description" value={description} onChangeText={value => setDescription(value)} />
                        </View>
                        <View style={styles.formElement}>
                            <Picker
                                selectedValue={category}
                                style={{ height: 50, width: 250, color: "#58b2d6" }}
                                onValueChange={category => setCategory(category)}>
                                <Picker.Item color="#fa9d32" label={"Cats"} value={"Cats"} />
                                <Picker.Item label={"Dogs"} value={"Dogs"} />
                                <Picker.Item label={"Birds"} value={"Birds"} />
                                <Picker.Item label={"Rabbits"} value={"Rabbits"} />
                                {props.categories.map(category => <Picker.Item label={category.categoryName} value={category.categoryName} />)}
                                <Picker.Item label={"Others"} value={"Others"} />
                            </Picker>
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button type="outline" title="Choose Photo" onPress={() => choosePhoto("post")} buttonStyle={{ borderRadius: 10, borderWidth: 2 }} />
                        </View>
                        <View style={{ margin: 10, flexDirection: "row", justifyContent: "space-between", width: 150 }}>
                            <Button title="Upload" onPress={handleUploadPost} />
                            <Button title="Back" onPress={handleBack} />
                        </View>
                    </View> :
                    <View style={styles.form} >
                        <Text style={{ padding: 10, margin: 10, fontWeight: "bold", fontSize: 30, color: "#fa9d32" }}>UPLOAD CATEGORY</Text>
                        <View>{selectedImage ? <Image style={{ height: 100, width: 100, marginBottom: 20 }} source={{ uri: selectedImage.uri }} /> : null}</View>
                        <View style={styles.formElement}>
                            <TextInput style={{ fontStyle: "italic", fontWeight: "bold", color: "#58b2d6" }} placeholder="Category" value={selectedCategory} onChangeText={value => setSelectedCategory(value)} />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button type="outline" title="Choose Photo" onPress={() => choosePhoto("category")} buttonStyle={{ borderRadius: 10, borderWidth: 2 }} />
                        </View>
                        <View style={{ margin: 10, flexDirection: "row", justifyContent: "space-between", width: 150 }}>
                            <Button title="Upload" onPress={handleUploadCategory} />
                            <Button title="Back" onPress={handleBack} />
                        </View>
                    </View>}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {valueForm === 0 ? <View style={{ backgroundColor: "#fa9d32", flex: 13, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => setValueForm(1)}>
                    <View style={styles.option}>
                        <Text style={styles.text}>Upload Post</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => setValueForm(2)} >
                    <View style={styles.option}>
                        <Text style={styles.text}>Upload Category</Text>
                    </View>
                </TouchableOpacity>
            </View> :
                showForm()}
            <View style={styles.menu}>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
                        <Icon
                            name="home"
                            color="#fff"
                            size={40} />
                    </TouchableOpacity>
                </View>

                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Upload")}>
                        <ICON
                            name="upload"
                            color="#fff"
                            size={40} />
                    </TouchableOpacity>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Timeline")}>
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
        flex: 1,
        backgroundColor: "#fa9d32"
    },
    form: {
        height: 525,
        width: 350,
        borderRadius: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5eadc"
    },
    formElement: {
        width: 250,
        borderRadius: 10,
        borderColor: "#58b2d6",
        borderWidth: 2,
        // shadowOffset:
        // {
        //     width: 0,
        //     height: 4
        // },
        // shadowColor: "#000",
        // shadowOpacity: 0.26,
        // shadowRadius: 4,
        // elevation: 5,
        alignItems: "center",
        marginBottom: 10
    },
    option: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 250,
        padding: 50,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#f5eadc",
        borderRadius: 100,
        shadowColor: "grey",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.26,
        shadowRadius: 4,
        elevation: 10
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
        alignItems: "center",
        color: "#fa9d32",
        textAlign: "center"
    },
    menu: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#03fcec"
    },
    icon: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default connect(mapStateToProps, { postUploaded, categoryUploaded })(Upload);