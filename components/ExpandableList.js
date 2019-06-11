/* eslint-disable brace-style */
/* eslint-disable keyword-spacing */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable global-require */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable spaced-comment */
/* eslint-disable no-var */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-curly-spacing */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import React from 'react';
import
{
  Alert,
  StyleSheet, 
  View, 
  Text,   
  TouchableOpacity, 
  Platform, 
  Button,
  Image,
  Icon,
}
  from 'react-native';

export default class ExpandableList extends React.Component {
  constructor(){
    super();
    this.state = {
      layoutHeight: 0,
    };
  }

  // The componentWillReceiveProps method is used to
  // re-compute the data when a prop value is changed in react native.
  componentWillReceiveProps(nextProps){
      if (nextProps.item.expanded){
          this.setState(() => {
              return {
                layoutHeight: null,
              };
          });
      }else
      {
        this.setState(() => {
            return {
                layoutHeight: 0,
            };
        });
    }
  }

  // shouldComponentUpdate() function is used to increase the app
  // performance by disabling all the items re-rendering each time
  // when user clicks a data. It will make sure the selected items
  // data is loaded only not the complete List.
  shouldComponentUpdate(nextProps, nextState){
      if(this.state.layoutHeight !== nextState.layoutHeight){
          return true;
      }
      return false;
  }

  //This function is used to display the selected item of Expandable List View
  //just for testing purpouse
  showSelectedCategory = (item) => {
      Alert.alert(item);
  }

  render(){
    return(
        <>
        <Button onPress={this.props.onClickFunction} title="Favorite Cities" />
          <View style={{ height: this.state.layoutHeight, overflow: 'hidden'}}>
            {
              this.props.item.cities.map((item, key) => (
                <TouchableOpacity 
                  key={key} 
                  onPress={this.showSelectedCategory.bind(this, item.name)}
                >
                  <Text style={styles.citiesText}>{item.name}</Text>
                  <View style={{width: '100%', height: 1, backgroundColor: '#000'}} />
                </TouchableOpacity>
              ))
            }
          </View>
        </>

    );
  }
}

const styles = StyleSheet.create({
 
    citiesText: {
      backgroundColor: '#fff',
      fontSize: 18,
      color: '#000',
      padding: 10
    },
  
  });
