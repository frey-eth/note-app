import React, { useEffect, useState } from "react";
import { View,SafeAreaView,Alert, StyleSheet,Dimensions, Modal,Text, StatusBar, TextInput, TouchableWithoutFeedback,Keyboard, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import Ionicons from 'react-native-ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PopupMenu=(count)=>{
    const [visible, setvisible] = useState(false);

    const options=[
        {
            title:'Notes',
            icon:'file',
            action:() => count.count(1)

        },
        {
            title:'Recycle Bin',
            icon:'trash',
            action:()=>count.count(2)
        },
        {
            title:'Favorite',
            icon:'heart',
            action:()=>count.count(0)
        },
    ]
    return<>
    <TouchableOpacity onPress={()=>setvisible(true)}>
        <Icon name='plus-circle' size={50} color='#6476fb'></Icon>
    </TouchableOpacity>
    <Modal transparent visible={visible}>
        <SafeAreaView style={{flex:1}}
        onTouchEnd ={()=>setvisible(false)}>
            <View style={styles.popup}>
                {options.map((op,i)=>(
                    <TouchableOpacity style={[styles.option,{ borderBottomWidth:i===options.length-1?0:1}]} key={i} onPress={op.action}>
                        <Text style={{fontSize:18,fontWeight:'600'}}>{op.title}</Text>
                        <Icon name={op.icon} size={30} color='#6476fb' style={{marginLeft:windowWidth*0.1}}></Icon>
                    </TouchableOpacity>
                ))}
            </View>
            
        </SafeAreaView>
    </Modal>
    </>
}

const styles=StyleSheet.create({
    popup:{
        borderRadius:10,
        borderColor:colors.Primary,
        borderWidth:2,
        backgroundColor:'#fff',
        paddingHorizontal:windowWidth*0.04,
        position:'absolute',
        top:windowHeight*0.1,
        right:windowWidth*0.13,

    },
    option:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:windowHeight*0.01,
        borderBottomColor:colors.Primary,
    }
})

export default PopupMenu
