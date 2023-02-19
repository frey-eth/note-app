import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,AsyncStorage } from 'react-native';
import React, {useEffect, useState} from 'react';
import Intro from './app/screens/Intro';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import NoteScreen from './app/screens/NoteScreen';
import NoteDetail from './app/components/NoteDetail';
import NoteProvider from './app/contexts/NoteProvider';
import Recycle from './app/screens/Recycle';


const Stack = createNativeStackNavigator()
export default function App() {
  const [user,setUser] = useState({})
  const [isAppFirstTimeOpen,setIsAppFirstTimeOpen] = useState(false)
  const findUser = async () =>{
    const result = await AsyncStorage.getItem('user')
    if(result===null) return setIsAppFirstTimeOpen(true)
    setUser(JSON.parse(result))
    setIsAppFirstTimeOpen(false)
  }

  useEffect(() =>  {
    findUser()
  }, [])

  const RenderNoteScreen=(props)=> <NoteScreen {...props} user={user}/>

  if(isAppFirstTimeOpen) return <Intro onFinish={findUser}/>
  return (
  <NavigationContainer>
    <NoteProvider>
        <Stack.Navigator screenOptions={{headerTitle:'',headerTransparent:true}}>
          <Stack.Screen component={RenderNoteScreen} name='NoteScreen '/>
          <Stack.Screen component={NoteDetail} name='NoteDetail'/>
          <Stack.Screen component={Recycle} name='Recycle'/>
        </Stack.Navigator>
    </NoteProvider>
  </NavigationContainer>
   )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
