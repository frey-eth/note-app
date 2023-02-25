import React, { useState,useEffect } from "react";
import { View, StyleSheet,SafeAreaView,Alert, StatusBar,Text, TouchableWithoutFeedback, Keyboard, FlatList,Dimensions, TouchableOpacity } from "react-native";
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

const Recycle=()=>{

    const  {notes, setNotes,findNotes} = useNotes()
    const [searchQuery, setSearchQuery]  = useState('')
    const [sortlist, setsortlist] = useState(true);
    const [resultNotFound, setresultNotFound] = useState(false);
    const [selectedItems, setselectedItems] = useState([]);

    const reverseData = data => {
        data=data.filter(d=>d.type===2)
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

    const restore = async(i)=>{
        i.type=1;
        setselectedItems([])
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
    }
    const handlerestore = (item)=>{
        Alert.alert('Restore?', '',[
            {
                text: 'Yes',
                onPress:()=>restore(item)
            },
            {
                text: 'No',
                onPress: ()=> console.log('No, thanks')
            }
        ],{
            cancelable: true
        })
    }

    return(
        <SafeAreaView style={{flex:1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.container}>
                <View style={{alignItems:'center'}}>
                <Text style={styles.header}>Recycle Bin</Text></View>
                <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:windowHeight*0.04}}>
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
                        renderItem={({item})=><Note 
                                                    onPress={()=>handlerestore(item)} 
                                                    item={item}
                                                    selected={false}
                                                    searchText={searchQuery}/>}/>}
                
            </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 20,
        flex :1,
        backgroundColor:'whitesmoke',
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
        zIndex: 1
    },
    deletebtn:{
        backgroundColor:colors.Error,
    },
    shareanddlt:{
        // backgroundColor:'aqua',
        // flexDirection:'row',
        marginBottom:0.1 * windowHeight,
        marginLeft:0.85 * windowWidth,
        marginRight:0.01 * windowWidth,
    }

})

export default Recycle