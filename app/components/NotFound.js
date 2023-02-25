import React from "react";
import { Text,View,StyleSheet } from "react-native";
import {AntDesign} from '@expo/vector-icons'
const NotFound = ()=>{
    return (
        <View style={[StyleSheet.absoluteFillObject,styles.container]}>
           <AntDesign name="search1" size={90} color='#6476fb'/>
            <Text style={{marginTop:20, fontSize: 20}}>Unfortunately, no results were found.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        justifyContent: 'center',
        alignItems : 'center',
        opacity : 0.5,
        zIndex :-1
    }
})

export default NotFound