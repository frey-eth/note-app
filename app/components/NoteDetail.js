import React, { useState } from "react";
import { ScrollView,Text,View, StyleSheet, Alert } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNotes} from '../contexts/NoteProvider'
import NoteInputModal from "./NoteInputModal";
const formatDate = (ms)=>{
    const date = new Date(ms)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hrs = date.getHours()
    const min = date.getMinutes()
    return `${month}/${day}/${year} - ${hrs}:${min}`
}

const NoteDetail = (props)=>{
    const [note,setNote] = useState(props.route.params.note)
    const headerHeight = useHeaderHeight()
    const {setNotes} = useNotes()
    const [showModal,setShowModal] = useState(false)
    const [isEdit,setIsEdit] = useState(false)
    const deleteNote =async()=>{
        const result = await AsyncStorage.getItem('notes')
        let notes = []
        if(result!==null)notes = JSON.parse(result)
        const newNotes = notes.filter(n=> n.id !==note.id)
        setNotes(newNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
        props.navigation.goBack()
    }
    const displayDeleteAlert =()=>{
        Alert.alert('Are you sure?', 'This action will delete your note permanently!',[
            {
                text: 'Delete',
                onPress:()=>deleteNote()
            },
            {
                text: 'No Thanks',
                onPress: ()=> console.log('no thanks')
            }
        ],{
            cancelable: true
        })
    }

    const handleUpdate =async(title,description,time)=>{
        const result =await AsyncStorage.getItem('notes')
        let notes= []
        if(result!==null) notes = JSON.parse(result)

        const newNotes=notes.filter(n=>{
            if(n.id===note.id){
                n.title = title
                n.description = description
                n.isUpdated = true
                n.time = time
                setNote(n)
            }
            return n
        })
        setNotes(newNotes)
        await AsyncStorage.setItem('notes',JSON.stringify(newNotes))
    }
    const handleOnClose =()=>setShowModal(false)
    const openEditModal = ()=>{
        setIsEdit(true)
        setShowModal(true)
    }
    return(
        <>
            <ScrollView contentContainerStyle={[styles.container,{paddingTop : headerHeight}]}>
                <Text style={styles.time}> {note.isUpdated 
                                            ? `Updated at: ${formatDate(note.time)}`
                                            :`Created at: ${formatDate(note.time)}`}</Text>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.description}>{note.description}</Text>
            </ScrollView>

            <View style={styles.btnContainer}>
                    <RoundIconBtn
                        onPress={()=>displayDeleteAlert()} 
                        antIconName={'delete'} 
                        style={{backgroundColor:colors.Error, marginBottom : 15}}/>
                    <RoundIconBtn
                        onPress={()=>openEditModal()} 
                        antIconName={'edit'} 
                        style={{backgroundColor:colors.Primary, marginBottom : 15}}/>
            </View>
            
            <NoteInputModal 
                isEdit={isEdit} note={note} 
                onClose={handleOnClose} 
                onSubmit={handleUpdate} 
                visible={showModal}/>

        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        paddingHorizontal : 15,
    },
    title:{
        fontSize : 25,
        color: colors.Primary,
        fontWeight : 'bold'
    },
    description:{
        fontSize : 20,
        opacity : 0.6
    },
    time:{
       textAlign:'right',
        fontSize : 12,
        opacity: 0.5,
    },
    btnContainer:{
        position : 'absolute',
        right: 15,
        bottom : 50
    }
})

export default NoteDetail