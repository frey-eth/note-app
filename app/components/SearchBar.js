import React from "react";
import {View,StyleSheet, TextInput} from 'react-native'
import colors from "../misc/colors";
import {AntDesign} from '@expo/vector-icons'
const SearchBar =({containerStyle,value,onClear,onChangeText})=>{
    return (
        <View style={[styles.container,{...containerStyle}]}>
            <TextInput  value={value} 
                        onChangeText={onChangeText} 
                        style={styles.searchBar} 
                        placeholder='Search here...'/>
            {value?<AntDesign 
                        name="close" 
                        size={20} 
                        color={colors.Primary} 
                        onPress={onClear}
                        style ={styles.clearIcon}/>:null}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center'
    },
    searchBar:{
        borderWidth : 3,
        borderColor : 'lightskyblue',
        height: 40,
        borderRadius : 20,
        paddingLeft : 15,
        fontSize: 20,
        paddingRight:30,
    },
    clearIcon:{
        position :"absolute",
        right : 10,
    }
    
})

export default SearchBar;