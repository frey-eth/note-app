import React, { Component } from 'react';
import { View, Text, Modal, Dimensions, Pressable, FlatList, TouchableOpacity, Alert,Share } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class BottomPopup extends Component {
    static defaultProps = {
        title: '',
        //slide fade  none
        animationType: 'slide',
        haveOutsideTouch: false,
        data: [],
        gift:{},
    }

    generatePdf = async (idx) => {
      const { gift } = this.props;
      if (idx === 0) {
        const file = await printToFileAsync({
          html: `
            <html>
              <head>
                <title>${gift[0].title}</title>
              </head>
              <body>
                <h1>${gift[0].title}</h1>
                <img src="${gift[0].image}" />
                <p>${gift[0].description}</p>
              </body>
            </html>
          `,
          base64: false
        });
        await shareAsync(file.uri);
      } else {
        try {
          const result = await Share.share({
            message:
              `${gift[0].title}` + '\n' + `${gift[0].description}`,
          });
        } catch (error) {
          Alert.alert(error.message);
        }
      };
    };

    renderItem = ({ item, index }) => {  
        return (
            <TouchableOpacity
                onPress={()=>{this.generatePdf(index)}}
                style={{
                height: 50, flex: 1,
                justifyContent: 'center', alignItems: 'flex-start',
                borderBottomColor: 'grey', borderBottomWidth: 0.5
                }}>
                <Text
                style={{
                    fontSize: 18, marginLeft: 18,
                    fontWeight: 'normal', color:'#182E44'
                }}>{item.name}</Text>
            </TouchableOpacity>
            )
        }

    renderContent = () => {
        const { data } = this.props;
        return (
        <View>
            <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            extraData={data}
            keyExtractor={item => `key-${item.id}`}
            contentContainerStyle={{
                paddingBottom: 40
            }}
            />
        </View>
        )
    }

    render() {
    const { show, title, animationType, closePopup, haveOutsideTouch } = this.props;

    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={show}
        onRequestClose={() => { }}
      >
        <View style={{ flex: 1, backgroundColor:'transparent' }}>
          <Pressable
            onPress={() => {
              if (!haveOutsideTouch) return;
              closePopup()
            }}
            style={{ flex: 1 }}>

          </Pressable>

          <View style={{
            bottom: 0,
            position: 'absolute',
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            // height: Dimensions.get('window').height * 0.4,
            maxHeight: Dimensions.get('window').height * 0.4
          }}>
            <Text style={{
              alignSelf: 'center',
              color: '#182E44',
              fontSize: 20,
              fontWeight: '500',
              margin: 15
            }}>{title}</Text>
            {this.renderContent()}
          </View>
        </View>
      </Modal>
    );
  }
}