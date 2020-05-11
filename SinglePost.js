import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    Alert
} from 'react-native';
import ICON from 'react-native-vector-icons/FontAwesome'
import { postUploaded } from './js/actions/index';
import { Button } from 'react-native-elements';
import {validations, config } from './Utils';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

function SinglePost(props) {
    // const [id, setId] = useState(props.route.params.singlepost._id);
    const [post, setPost] = useState(props.route.params.singlepost);
    const [comment, setComment] = useState("");
    const [clickedReply, setClickedReply] = useState(false);
    const [commentId, setCommentId] = useState("");
    const [reply, setReply] = useState("");

    const handleSubmitComment = (e)=>{
        e.preventDefault();
        if(comment){
            axios({
                method: 'post',
                url: config.SERVER + "/comment",
                data: {email: props.route.params.user, image: post.image, username: post.username , text: comment}
            }).then(resp=>{
                    if(resp.data != '0'){
                        console.log("Comments sent by backend: "+JSON.stringify(resp.data.comments));
                        setComment("");
                        setPost(resp.data);
                        axios.get(config.SERVER + "/showpost").then(resp=>{
                            props.postUploaded(resp.data);
                            Alert.alert("Done!");
                        })
                    }
            } )
        }else{
            Alert.alert("Please write a comment to post.");
        }

    }

    const handleReply = (value,id)=>{
        console.log("Id in handleReply: "+id);
        setClickedReply(value);
        setCommentId(id);
    }

    const handleSubmitReply = (id)=>{
        // console.log("reply sent to handleSubmitReply: "+reply);
        if(reply){
            axios({
                method: "POST",
                url: config.SERVER + "/replycomment",
                data: {email: props.route.params.user, image: post.image, username: post.username , text: reply, comment: id.toString()}
            })
            .then(resp=>{
                console.log("Reply sent by backend: "+JSON.stringify(resp.data.comments.replies));
                setReply("");
                setPost(resp.data);
                axios.get(config.SERVER + "/showpost").then(response=>{
                    props.postUploaded(response.data);
                    Alert.alert("Done!");
                })
            })
        }
        else{
            Alert.alert("Please write your reply.")
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* {console.log("Type of props.params: "+typeof post)} */}
            <ScrollView>
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
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <Image style={{ width: 30, height: 30 }} source={require('./images/user3.png')} />
                            <Text style={{ paddingTop: 5, padding: 10, fontWeight: "bold" }}>{post.username}</Text>
                            <Text style={{ paddingBottom: 0, padding: 10 }}> {post.date} </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <ImageBackground source={require("./images/tag3.png")} style={{ width: 100 }}>
                                <Text style={{ paddingTop: 5, padding: 10, fontWeight: "bold", color: "#21542f" }}>{post.category}</Text>
                            </ImageBackground>
                        </View>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text> {post.description} </Text>
                    </View>
                    <View style={{ zIndex: -10 }}>
                        <Image style={{ width: "100%", height: 300 }} source={{ uri: config.SERVER + "/" + post.image }} />
                    </View>
                    {/* <View
                        style={{
                            borderBottomColor: 'gray',
                            borderBottomWidth: 1,
                        }}
                    /> */}
                    <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>{post.comments.length} Comments</Text>
                        </View>
                    </View>
                </View>
                <View>
                </View>
                <View style={{ padding: 10, paddingBottom: 50 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>Comments:</Text>
                    <View style={{ borderBottomColor: "grey", borderBottomWidth: 1 }} />
                    {post.comments.map((comment, id)=>
                    <View style={{ paddingTop: 10, paddingBottom: 10}}>
                        
                        <View style={{ flexDirection: "row"}}>
                        <ICON  name="user-circle" size={30} />
                        <Text style={{ width: "70%" , marginLeft: 10}}>{comment.text}</Text>
                        <Text style={{color: "blue"}}>{comment.replies.length}</Text>
                        {/* {console.log("Id in mapping comments: "+id)} */}
                        {(clickedReply && commentId==id) ? <Button title="Reply" type="outline" onPress={()=>handleReply(false, "")} /> : <Button title="Reply" type="clear" onPress={()=>handleReply(true,id)} />}
                        
                        </View>
                       
                        <Text style={{paddingBottom: 10, color: "blue", fontSize: 8}}>{comment.email}</Text>
                        {(clickedReply && commentId==id) ?  comment.replies.map(reply=><View style={{borderBottomColor: "#dedad9", borderBottomWidth: 1,borderTopColor: "#dedad9", borderTopWidth: 1, paddingBottom: 10,paddingTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{marginLeft: 100}}>{reply.text}</Text>
                        <Text style={{fontSize: 8}}>{reply.email}</Text>
                        </View>): null }
                        <View 
                        style={{borderBottomColor: "#dedad9", borderBottomWidth: 1}} />
                        {(clickedReply && commentId==id) ? 
                        <View>
                            <TextInput placeholder="Click here add a reply..." value={reply} onChangeText={value=>setReply(value)} />
                            <Button title="Submit" type="outline" onPress={()=>handleSubmitReply(id)} />
                        </View>
                        : null}
                    </View>)}

                </View>
            </ScrollView>
            <View style={styles.comment}>
                <TextInput style={{ width: "70%", borderColor: "lightblue", borderWidth: 2, borderRadius: 10, }}
                    placeholder="Write a comment here..." value={comment} onChangeText={value=>setComment(value)}/>
                <Button title="Post" type="outline" buttonStyle={{ width: 100, borderRadius: 10, backgroundColor: "lightblue" }} onPress={handleSubmitComment} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        position: "relative",
        // left: 0,
        // bottom: 0,
        justifyContent: "space-between",
        width: "100%",
        flexDirection: "row",
        paddingLeft: 8,
        paddingRight: 10,
        zIndex: 20
    }
})

export default connect(null, { postUploaded })(SinglePost);