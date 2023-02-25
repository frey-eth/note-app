import {React,useState} from "react";
import { View,Text, StyleSheet,Dimensions, TouchableOpacity } from "react-native";
import colors from "../misc/colors";
import RoundIconBtn from "./RoundIconBtn";
import Heart2 from "./Heart2";
import Heart1 from "./Heart1";
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
                highlightStyle={{backgroundColor:'white'}}></HighlightText>
            <HighlightText 
                searchWords={searchQuery} 
                numberOfLines={3} 
                style={styles.description}
                textToHighlight={description}
                highlightStyle={{backgroundColor:'white'}}></HighlightText>
            {selected && <View style={styles.overlay}></View>}
        </TouchableOpacity>
        {bgcolor?
        <Heart1 onPress={handle} antIconName={'hearto'} size={19}
        style={styles.heart1}></Heart1>:
        <Heart2 onPress={handle} antIconName={'heart'} size={19}
        style={styles.heart2}></Heart2>
}
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
        borderRadius:10,
    },
    heart1:{
        position:'absolute',
        right:6,
        marginTop:17,
    },
    heart2:{
        position:'absolute',
        right:6,
        marginTop:17,
        
    }
})

export default Note 