import React, { useState } from "react";
import { Text,View, StyleSheet, TextInput, StatusBar, Dimensions,AsyncStorage } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "../components/RoundIconBtn";

const Intro=({onFinish})=>{

    const [name,setName]=useState('')
    const handleOnchangeText= text => setName(text)
    const handleSubmit= async ()=>{
        const user={name:name}
        await AsyncStorage.setItem('user',JSON.stringify(user))
        if(onFinish)onFinish()
    }
    return (
        <> 
        <StatusBar hidden/>
        <View style={styles.container}>
            <Text style={styles.inputTitle}>Enter your name to continue</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder='Enter your name'
                value={name}
                onChangeText={handleOnchangeText}/>
                {name.trim().length >= 3 ? (
                <RoundIconBtn antIconName='arrowright' onPress={handleSubmit}/>
            )   :   null}
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    inputTitle:{
        alignSelf :'flex-start',
        paddingLeft: 25,
        marginBottom : 5,
        opacity: 0.5
    },
    textInput:{
        borderWidth:2,
        borderColor:colors.Primary,
        color: colors.Primary,
        width:Dimensions.get('window').width-50,
        height:40,
        borderRadius: 10,
        paddingLeft :15,
        fontSize : 15,
        marginBottom : 15,
    }
})

export default Intro