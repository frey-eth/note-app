import React, { useState,useEffect } from "react";
import { View, StyleSheet,SafeAreaView, StatusBar,Text, TouchableWithoutFeedback, Keyboard, FlatList,Dimensions, TouchableOpacity } from "react-native";
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
import PopupMenu from "../components/PopupMenu";


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
    const [mess, setmess] = useState(1);
    const [sortlist, setsortlist] = useState(true);

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


    const reverseData = data => {
        data=data.filter(d=>d.type===1)
        return data.sort((a, b) => {
          const aInt = parseInt(a.time);
          const bInt = parseInt(b.time);
          if(sortlist){
            if (aInt < bInt) return 1;
            if (aInt == bInt) return 0;
            if (aInt > bInt) return -1;
          }
          else{
            if (aInt > bInt) return 1;
            if (aInt == bInt) return 0;
            if (aInt < bInt) return -1;
          }
    });};

    const reverseNotes = reverseData(notes);

    const handleMess = (message) => {
        setmess(message);
        if(message===2)
            navigation.navigate('Recycle')
    };
    const handleOnSubmit= async (title,description)=>{
        const note = {id: Date.now(),title,description, time:Date.now(),type:1}
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
        for(let i=0;i<notes.length;i++)
            if(selectedItems.includes(notes[i].id))
                notes[i].type=2
        const newNotes=notes;
        // setNotes(newNotes);
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
                <View style={{alignItems:'center'}}>
                <Text style={styles.header}>{`Good ${greet} ${user.name}`}</Text></View>
                
                <View style={{flexDirection:'row-reverse'}}>
                <PopupMenu count={handleMess}></PopupMenu></View>

                {notes.length? (<SearchBar
                                    onClear={handleOnClear}
                                    value={searchQuery}
                                    onChangeText={handleOnSearchInput} 
                                    containerStyle={{marginVertical:15}}
                                />):null}
                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                    <Text style={{fontSize:20,fontWeight:'600'}}>Sort by time | </Text>
                    <TouchableOpacity onPress={()=>setsortlist(!sortlist)}>
                        <Text style={{fontSize:20,fontWeight:'500'}}>{sortlist?'Lastest':'Earliest'}</Text>
                    </TouchableOpacity>
                </View>
                {resultNotFound
                    ? <NotFound/>
                    : <FlatList 
                        data={reverseNotes} 
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
                    antIconName='link'
                    style={{...styles.deletebtn}}></RoundIconBtn>}
                <RoundIconBtn 
                    onPress={deleteMultiNodes}
                    antIconName='delete' 
                    style={{...styles.deletebtn,marginTop:windowWidth*0.02}}/>
            </View>)
            :
            (<RoundIconBtn 
                onPress={()=>{setModalVisible(true)}} 
                antIconName='edit' 
                style={styles.addBtn}/>)}

        <BottomPopup
            show={showBottomPopup}
            title={"Share with"}
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
        paddingTop:windowHeight*0.02,
        paddingHorizontal: 20,
        flex :1,
        // backgroundColor:'red',
    },
    header:{
        fontSize : 25,
        fontWeight: 'bold',

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
        zIndex: 1,
        backgroundColor:'pink',
    },
    deletebtn:{
        backgroundColor:'lightskyblue',
    },
    shareanddlt:{
        // backgroundColor:'aqua',
        // flexDirection:'row',
        marginBottom:0.1 * windowHeight,
        marginLeft:0.83 * windowWidth,
        marginRight:0.03 * windowWidth,
    }

})

export default NoteScreen