import React, { useState,useEffect } from "react";
import { View, StyleSheet, StatusBar,Text, TouchableWithoutFeedback, Keyboard, AsyncStorage, FlatList } from "react-native";
import Note from "../components/Note";
import NoteInputModel from "../components/NoteInputModal";
import RoundIconBtn from "../components/RoundIconBtn";
import SearchBar from "../components/SearchBar";
import colors from "../misc/colors";
import {useNotes} from '../contexts/NoteProvider'
import NotFound from "../components/NotFound";

const NoteScreen = ({user, navigation})=>{
    const [greet, setGreet] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const  {notes, setNotes,findNotes} = useNotes()
    const [searchQuery, setSearchQuery]  = useState('')
    const [resultNotFound,setResultNotFound] = useState(false)
    const findGreet= () => {
        const hrs = new Date().getHours()
        if(hrs==0||hrs < 12) return setGreet('Morning')
        if(hrs==1||hrs < 17) return setGreet('Afternoon')
        else setGreet('Evening')
    }
    useEffect(()=>{
        findGreet();
    },[])

    const handleOnSubmit= async (title,description)=>{
        const note = {id: Date.now(),title,description, time: Date.now()}
        const updatedNotes = [...notes,note]
        setNotes(updatedNotes)
        await AsyncStorage.setItem('notes',JSON.stringify(updatedNotes))
    }

    const openNote =(note)=>{
        navigation.navigate('NoteDetail',{note})
    }

    const handleOnSearchInput =async (text)=>{
        setSearchQuery(text);
        if(!text.trim()){
            setSearchQuery('')
            setResultNotFound(false)
            return await findNotes()
        }
        const filteredNotes=notes.filter(note=>{
            if(note.title.toLowerCase().includes(text.toLowerCase())){
                return note
            }
        })

        if(filteredNotes.length){
            setNotes([...filteredNotes])
        }else{
            setResultNotFound(true)
        }
    }

    const handleOnClear =async ()=>{
        setSearchQuery('')
        setResultNotFound(false)
        await findNotes()
    }

    return (
        <>
        <StatusBar barStyle='dark-content' backgroundColor={colors.Light}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.header}>{`Good ${greet} ${user.name}`}</Text>
                {notes.length? (<SearchBar
                                    onClear={handleOnClear}
                                    value={searchQuery}
                                    onChangeText={handleOnSearchInput} 
                                    containerStyle={{marginVertical:15}}
                                />):null}
                {resultNotFound
                    ? <NotFound/>
                    : <FlatList 
                        data={notes} 
                        keyExtractor={item=>item.id.toString()} 
                        renderItem={({item})=><Note onPress={()=>openNote(item)} item={item}/>}/>}
                
                {!notes.length?
                    <View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                        <Text style={styles.emptyHeader}>Add Note</Text>
                    </View>:null}
            </View>
        </TouchableWithoutFeedback>

        <RoundIconBtn 
                        onPress={()=>{setModalVisible(true)}} 
                        antIconName='plus' 
                        style={styles.addBtn}/>
        <NoteInputModel
            onSubmit={handleOnSubmit} 
            visible={modalVisible} 
            onClose={()=>setModalVisible(false)}/>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 20,
        flex :1,
    },
    header:{
        fontSize : 25,
        fontWeight: 'bold'
    },
    emptyHeaderContainer:{
        flex: 1,
        alignItems : 'center',
        justifyContent :'center',
        zIndex: -1,
    },
    emptyHeader:{
        fontSize : 25,
        textTransform : 'uppercase',
        fontWeight:'bold',
        opacity: 0.2,
    },
    addBtn:{
        position :'absolute',
        right : 15,
        bottom: 50,
        zIndex: 1
    }

})

export default NoteScreen