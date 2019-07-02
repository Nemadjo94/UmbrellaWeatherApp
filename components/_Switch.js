import React from 'react';
import { View, Switch, StyleSheet, Text, AsyncStorage } from 'react-native';
import GLOBAL from './GLOBAL';

export default class _Switch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            switchValue: false,
            tempValue: 'metric',//default value
        };
    }
    //After components mounts fetch our values from async storage
    componentDidMount = () => {
      AsyncStorage.getItem('SWITCH_VALUE').then(
        (value) => this.setState({'switchValue': value == 'true' ? true : false }) //In async storage bool values cannot be stored as string
      );
      AsyncStorage.getItem('TEMP_VALUE').then(
        (value) => this.setState({'tempValue': value})
      );
    }

    _saveToStorage = (switchValue, tempValue) => { // save to storage
      AsyncStorage.setItem('SWITCH_VALUE', switchValue);
      AsyncStorage.setItem('TEMP_VALUE', tempValue);
    }

    _handleToggleSwitch = () =>{
      this.setState(state => ({switchValue: !state.switchValue}//change the switch 
        ),() => callback()
      );

    callback = () => { // callback function after the switch changes
      if(this.state.switchValue){
        GLOBAL.TempState = 'imperial';
        this.state.tempValue = 'imperial';
      }else{
        GLOBAL.TempState = 'metric';
        this.state.tempValue = 'metric';
      }
      //we need this in callback because set state is async func and with callback we execute everything in order
      this._saveToStorage(this.state.switchValue.toString(), this.state.tempValue);//save as string because of warning, and save temp value
      console.log('Global temp value: ' + GLOBAL.TempState);
      console.log('Local temp value ' + this.state.tempValue);
    }
  }


  render() {
    //This picks up the object of our component together with its state and becomes global
    GLOBAL.TempState = this;
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Show temperature in: °{this.state.switchValue ? 'F' : 'C'}</Text>
        <Switch
          onValueChange={this._handleToggleSwitch}
          value={this.state.switchValue}
          style={styles.switchStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textStyle: {
    alignSelf: 'center',
    color: 'dodgerblue',
    fontSize: 14,
    paddingVertical: 8,
    fontFamily: 'sans-serif-light',
  },
  switchStyle: {
    margin: 10,
  }
});