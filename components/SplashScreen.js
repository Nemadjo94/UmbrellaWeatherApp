import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

export default class SplashScreen extends React.Component {
    render() {
  
      return (
        <View style={styles.container}>
           <Image
            style={{width: 250, height: 250}}
            source={require('../assets/umbrella.png')}
           />
          <Text style={styles.textStyle}>
            UMBRELLA
          </Text>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#91c988',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold'
      },

});
