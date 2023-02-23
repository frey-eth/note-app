import React, { useEffect, useState } from "react";
import { View,Image, StyleSheet, Modal,Text,Dimensions, StatusBar, TextInput, TouchableWithoutFeedback,Keyboard, KeyboardAvoidingView, Alert, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const NoteInputModal = ({visible, onClose,onSubmit,note,isEdit,isFocus})=>{

    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [image,setImage] = useState(null)
    
    const handleModalClose=()=>{
        Keyboard.dismiss();
    }
    useEffect(() => {
        if (isEdit) {
          setTitle(note.title);
          setDescription(note.description);
          setImage(note.image)
        }
      }, [isEdit]);
    
    

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1,
        });
        
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            const newNote = {...note, image: result.assets[0].uri};
            setNote(newNote);
        }
      }

    const handleOnchangeText=(text,valueFor)=>{
        if(valueFor==='title')setTitle(text)
        if(valueFor==='description')setDescription(text)
    }

    const handleSubmit=()=>{
        if(!title.trim()&&!description.trim())return onClose()
        
        if(isEdit){
            onSubmit(title,description,Date.now(),image)
        }else{
            onSubmit(title,description)
            setTitle('')
            setDescription('')
            setImage(null);
        }
        onClose()
    }

    const closeModal = ()=>{
        if(!isEdit){
            setTitle('')
            setDescription('')
        }
        onClose()
    }

    return(
        <>
            <StatusBar hidden/>
            <Modal visible={visible} animationType='fade'>
                <View style={styles.container}>
                    <KeyboardAvoidingView>
                            <View  style={styles.btnUndoContainer}>
                            <RoundIconBtn
                                onPress={handleSubmit}
                                size={15}
                                antIconName={'check'}
                                style={{marginLeft:windowWidth*0.03,backgroundColor:'lightskyblue'}}/>

                            <RoundIconBtn
                                onPress={closeModal}
                                size={15}
                                antIconName={'close'}
                                style={{backgroundColor:'lightskyblue'}}/>
                            </View>
                    </KeyboardAvoidingView>
                    <RoundIconBtn
                                style={{width:45}}
                                onPress={handleImagePicker}
                                size={15}
                                antIconName={'camera'}
                               />
                    <TextInput
                        value={title}
                        onChangeText={(text)=>handleOnchangeText(text,'title')} 
                        placeholder="Title" 
                        style={[styles.input,styles.title]}
                        autoFocus={isFocus}
                        multiline={true}/>
                        {image && (
                            <>
                            <View>
                                <TouchableOpacity onPress={handleImagePicker}>
                                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                                </TouchableOpacity>
                                
                                <RoundIconBtn
                                onPress={() => setImage(null)}
                                size={15}
                                antIconName={'delete'}
                                style={{ position: 'absolute', top: 0, right: 0 }}
                                />
                            </View>
                            </>
                        )}
                    <TextInput
                        value={description}
                        onChangeText={(text)=>handleOnchangeText(text,'description')} 
                        placeholder="Note" 
                        style={[styles.input,styles.description]}
                        autoFocus={!isFocus}
                        multiline={true}/>      
                </View>

                <TouchableWithoutFeedback onPress={handleModalClose}>
                    <View style={[styles.modelBG,StyleSheet.absoluteFillObject]}></View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    container:{
        paddingHorizontal : 20,
        paddingTop : 10, 
    },
    input:{
        fontSize : 20,
        color: colors.Dark,

    },
    title:{
        // height: 30,
        marginBottom :20,
        fontWeight:'bold',
        fontSize:25,
        textAlign:'center',
    },
    description:{
        textAlign:'left',
        textAlignVertical:'top',
        height: '70%',

    },
    modelBG:{
        flex:1,
        zIndex: -1
    },
    btnContainer:{
        flexDirection :'row',
        justifyContent:'flex-end',
        paddingVertical:15,
    },
    btnUndoContainer:{
        flexDirection :'row-reverse',
        marginBottom:0,
        // justifyContent:'flex-end',
        width:'100%',
        // backgroundColor:'red'
    },

})

export default NoteInputModal