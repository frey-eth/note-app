import React from "react";
import { View,Text, StyleSheet,Dimensions, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import HighlightText from '@sanar/react-native-highlight-text';

const Note = ({item,selected, onLongPress, onPress , searchText})=>{
    const {title,description} = item
    const searchQuery=[searchText]
    // console.log(searchQuery)
    return(
    <>  
        <TouchableOpacity style={styles.container} onLongPress={onLongPress} onPress={onPress}>
            <HighlightText 
                searchWords={searchQuery} 
                numberOfLines={2} 
                style={styles.title}
                textToHighlight={title}
                highlightStyle={{backgroundColor:'yellow'}}></HighlightText>
            <HighlightText 
                searchWords={searchQuery} 
                numberOfLines={3} 
                style={styles.description}
                textToHighlight={description}
                highlightStyle={{backgroundColor:'yellow'}}></HighlightText>
            {selected && <View style={styles.overlay}></View>}
        </TouchableOpacity>
    </>)
}


const styles= StyleSheet.create({
    container:{
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 15,
        borderColor : colors.Primary,
        overflow:'hidden',
    },
    title:{
        borderBottomWidth: 0.5,
        borderBottomColor: "#6476fb",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 20,
        fontWeight:'bold',
        fontSize: 18,
        color:'#1e2870',
        paddingHorizontal: 15,
        paddingHorizontal : 10,
    },
    description:{
        fontSize :15,
        paddingHorizontal: 15,
        paddingHorizontal : 10,
        color: 'gray',
    },
    overlay:{
        position:'absolute',
        width:'100%',height:'100%',
        borderColor : colors.Primary,
        backgroundColor: '#212fbf',
        opacity: 0.2,
        borderWidth:3, 
        borderRadius:10,
    },
})

export default Note 