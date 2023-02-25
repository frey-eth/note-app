import React from "react";
import {View,StyleSheet} from 'react-native'
import {AntDesign} from '@expo/vector-icons'
import colors from "../misc/colors";
const Heart2 =({antIconName,size,color, onPress,style})=>{

    return <AntDesign 
            name={antIconName} 
            size= {19}
            color={colors.Love}
            style={[styles.icon,{...style}]}
            onPress={onPress}
            />
}

const styles = StyleSheet.create({
    icon:{
        padding: 3,
        borderRadius : 15,
        backgroundColor:'transparent'
    }
})

export default Heart2;