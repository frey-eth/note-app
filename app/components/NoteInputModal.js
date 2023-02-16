import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal,Text, StatusBar, TextInput, TouchableWithoutFeedback,Keyboard, KeyboardAvoidingView } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";

const NoteInputModal = ({visible, onClose,onSubmit,note,isEdit,isFocus})=>{

    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const handleModalClose=()=>{
        Keyboard.dismiss();
    }

    useEffect(()=> {
        if(isEdit){
            setTitle(note.title)
            setDescription(note.description)
        }
    },[isEdit])

    const handleOnchangeText=(text,valueFor)=>{
        if(valueFor==='title')setTitle(text)
        if(valueFor==='description')setDescription(text)
    }

    const handleSubmit=()=>{
        if(!title.trim()&&!description.trim())return onClose()
        
        if(isEdit){
            onSubmit(title,description,Date.now())
        }else{
            onSubmit(title,description)
            setTitle('')
            setDescription('')
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
                    <View style={styles.btnContainer}>
                            {title.trim()||description.trim()?
                            <RoundIconBtn
                                onPress={closeModal}
                                size={15}
                                antIconName={'close'}/>:null}
                            <RoundIconBtn
                                style={{marginLeft:15}}
                                onPress={handleSubmit}
                                size={15}
                                antIconName={'check'}/>
                    </View>
                    <TextInput
                        value={title}
                        onChangeText={(text)=>handleOnchangeText(text,'title')} 
                        placeholder="Title" 
                        style={[styles.input,styles.title]}
                        autoFocus={isFocus}
                        multiline={true}/>
                    <TextInput
                        value={description}
                        onChangeText={(text)=>handleOnchangeText(text,'description')} 
                        multiline
                        placeholder="Note" 
                        style={[styles.input,styles.description]}
                        autoFocus={!isFocus}
                        multiline={true}/>
                    <KeyboardAvoidingView behavior='position'>
                            <View  style={styles.btnUndoContainer}>
                            <RoundIconBtn
                                onPress={closeModal}
                                size={10}
                                antIconName={'close'}/>
                            <RoundIconBtn
                                onPress={handleSubmit}
                                size={10}
                                antIconName={'check'}/>
                            </View>
                    </KeyboardAvoidingView>
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
    },

})

export default NoteInputModal