import {React,useState} from "react";
import { View,Text, StyleSheet,Dimensions, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import HighlightText from '@sanar/react-native-highlight-text';

const Note = ({item,selected, onLongPress, onPress , searchText})=>{
    const {title,description} = item
    const searchQuery=[searchText]
    const [bgcolor, setbgcolor] = useState(true);

    const handle=()=>{
        setbgcolor(!bgcolor)
        if(item.type===1)
            item.type=0
        else if(item.type===0)
            item.type=1
    }
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
        {bgcolor?
        <RoundIconBtn onPress={handle} antIconName={'heart'} size={15}
        style={styles.heart1}></RoundIconBtn>:
        <RoundIconBtn onPress={handle} antIconName={'heart'} size={15}
        style={styles.heart2}></RoundIconBtn>
}
    </>)
}

const styles= StyleSheet.create({
    container:{
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 20,
        borderColor : 'lightskyblue',
        overflow:'hidden',

    },
    title:{
        fontWeight:'bold',
        fontSize: 18,
        color:'grey',
        paddingHorizontal: 15,
        paddingHorizontal : 10,
    },
    description:{
        fontSize :15,
        paddingHorizontal: 15,
        paddingHorizontal : 10,
    },
    overlay:{
        position:'absolute',
        width:'100%',height:'100%',
        backgroundColor:'rgba(0, 90, 110, 0.5)',
        top:0, left:0,
        borderRadius:10,
    },
    heart1:{
        position:'absolute',
        right:0,
        marginTop:10,
        backgroundColor:'white',
    },
    heart2:{
        position:'absolute',
        right:0,
        marginTop:10,
        backgroundColor:'pink',
    }
})

export default Note 