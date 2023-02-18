import React, { useState,useEffect } from "react";
import { View, StyleSheet,SafeAreaView, StatusBar,Text, TouchableWithoutFeedback, Keyboard, FlatList,Dimensions } from "react-native";
import Note from "../components/Note";
import NoteInputModel from "../components/NoteInputModal";
import RoundIconBtn from "../components/RoundIconBtn";
import SearchBar from "../components/SearchBar";
import colors from "../misc/colors";
import {useNotes} from '../contexts/NoteProvider'
import NotFound from "../components/NotFound";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import BottomPopup from "../components/BottomPopup";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const NoteScreen = ({user, navigation})=>{
    const [greet, setGreet] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const  {notes, setNotes,findNotes} = useNotes()
    const [searchQuery, setSearchQuery]  = useState('')
    const [resultNotFound,setResultNotFound] = useState(false)
    const [selectedItems, setselectedItems] = useState([]);
    const [showBottomPopup, setshowBottomPopup] = useState(false);
    const [getgift, setgift] = useState({});

    const popupList = [
        { id: 0, name: 'Pdf' },
        { id: 1, name: 'Message' },
    ]

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
        const note = {id: Date.now(),title,description, time:Date.now()}
        const updatedNotes = [...notes,note]
        setNotes(updatedNotes)
        await AsyncStorage.setItem('notes',JSON.stringify(updatedNotes))
    }

    const handleOnPress =(note)=>{
        if(selectedItems.length){
            return handleOnLongPress(note)
        }
        navigation.navigate('NoteDetail',{note})
    }

    const handleOnSearchInput =async (text)=>{
        setSearchQuery(text);
        if(!text.trim()){
            setSearchQuery('')
            setResultNotFound(false)
            return await findNotes()
        }
        await findNotes()

        const filteredNotes=notes.filter(note=>{
            if(note.title.toLowerCase().includes(text.toLowerCase()) ||
                note.description.toLowerCase().includes(text.toLowerCase())){
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

    const handleOnLongPress=(node)=>{
        
        if(selectedItems.includes(node.id)){
            const newList=selectedItems.filter(nodeId=>nodeId!==node.id);
            setselectedItems(newList);
            return
        }
        setselectedItems([...selectedItems,node.id])
    }

    const getSelectedItems=(note)=>selectedItems.includes(note.id)

    const handleOutSidePress=()=>{
        Keyboard.dismiss()
        setselectedItems([])    
    }

    const deleteMultiNodes=async()=>{
        if(!selectedItems.length) return;
        const newNotes=notes.filter((n)=>!selectedItems.includes(n.id));
        setNotes(newNotes);

        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
        setselectedItems([]);
    }

    const closePopup=()=>{setshowBottomPopup(false)}
    const openPopup=()=>{setshowBottomPopup(true)}

    return (
        <SafeAreaView style={{flex:1}}>
        <StatusBar backgroundColor={colors.Light} hidden={false}></StatusBar>
        <TouchableWithoutFeedback onPress={handleOutSidePress}>
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
                        renderItem={({item})=><Note onLongPress={()=>{handleOnLongPress(item)}} 
                                                    onPress={()=>handleOnPress(item)} 
                                                    item={item}
                                                    selected={getSelectedItems(item)}
                                                    searchText={searchQuery}/>}/>}
                
                {!notes.length?
                    <View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                        <Text style={styles.emptyHeader}>Add Note</Text>
                    </View>:null}
            </View>
        </TouchableWithoutFeedback>

        {selectedItems.length?
            (<View style={styles.shareanddlt}>
                {selectedItems.length ===1&&<RoundIconBtn
                    onPress={openPopup}
                    antIconName='plus'
                    style={{...styles.deletebtn}}></RoundIconBtn>}
                <RoundIconBtn 
                    onPress={deleteMultiNodes}
                    antIconName='delete' 
                    style={{...styles.deletebtn,marginTop:windowWidth*0.02}}/>
            </View>)
            :
            (<RoundIconBtn 
                onPress={()=>{setModalVisible(true)}} 
                antIconName='plus' 
                style={styles.addBtn}/>)}

        <BottomPopup
            show={showBottomPopup}
            title={"Demo Popup"}
            animationType={"slide"}
            closePopup={closePopup}
            data={popupList}
            haveOutsideTouch={true}
            gift={notes.filter((n)=>selectedItems.includes(n.id))}
        />
        <NoteInputModel
            onSubmit={handleOnSubmit} 
            visible={modalVisible} 
            onClose={()=>setModalVisible(false)}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 20,
        flex :1,
        // backgroundColor:'red',
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
    },
    deletebtn:{
        backgroundColor:'red',
    },
    shareanddlt:{
        // backgroundColor:'aqua',
        // flexDirection:'row',
        marginBottom:0.1 * windowHeight,
        marginLeft:0.85 * windowWidth,
        marginRight:0.01 * windowWidth,
    }

})

export default NoteScreen