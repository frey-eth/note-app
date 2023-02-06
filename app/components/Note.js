import React from "react";
import { View,Text, StyleSheet,Dimensions, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";

const Note = ({item,onPress})=>{
    const {title,description} = item
    return(
    <>  
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text numberOfLines={2} style={styles.title}>{title}</Text>
            <Text numberOfLines={3} style={styles.description}>{description}</Text>
        </TouchableOpacity>
    </>)
}

const styles= StyleSheet.create({
    container:{
        borderWidth: 2,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 20,
        borderColor : colors.Primary,
        paddingHorizontal : 10
    },
    title:{
        fontWeight:'bold',
        fontSize: 18,
        color:'grey'
    },
    description:{
        fontSize :15
    }
})

export default Note 