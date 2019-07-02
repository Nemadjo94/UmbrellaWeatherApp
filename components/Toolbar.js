/* eslint-disable react/no-unused-state */
/* eslint-disable object-property-newline */
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
  StyleSheet,
  View,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  Text,
  UIManager,
  Platform,
  LayoutAnimation,
  Linking,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image
}
  from 'react-native';
import Panel from './Panel';
import _Switch from './_Switch';

export default class Toolbar extends React.Component { // hamburger menu and toolbar definition
  constructor() {
    super();
    this.openDrawer = this.openDrawer.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _keyExtractor = (item, index) => (item).toString(); // keys are required to be in a string to avoid errors

  updateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  openDrawer() {
    this.drawer.openDrawer();
  }

  render() {
    let drawer = (
      <View style={{flex: 1, backgroundColor: '#91c988', justifyContent: 'flex-start'}}>

        <Image 
            source={require('../assets/umbrella.png')}
            style={{width: '60%', height: 120, alignSelf: 'center', marginTop: 25}}
        />

        <Panel title={'Settings'} icon={'settings'}>
          <_Switch/>
        </Panel>

        <Panel title={'About Us'} icon={'about_us'}>
          <Text style={styles.aboutUsText}>Made by nemadjo94</Text>
          <TouchableOpacity 
             onPress={() => Linking.openURL('https://github.com/Nemadjo94')}
             style={styles.aboutButtonStyle}>
            <Text style={styles.buttonTextStyle}>Check out my GitHub</Text>
          </TouchableOpacity>
        </Panel>

        <Panel title={'My Favorite Cities'} icon={'fav_cities'}>
          { this.props.favoriteCities.length > 0 ?
          
            (<FlatList
                data={this.props.favoriteCities}
                keyExtractor={this._keyExtractor}
                renderItem={({item, index}) => 
                <ScrollView>
                    
                    <TouchableOpacity
                      style={styles.listItemStyles}
                      key={index}
                      onPress={this.props.selectCity.bind(this, item)}
                    >
                      <View style={styles.citiesNameHolder}>
                         <Text style={styles.buttonTextStyle}>{item}</Text>
                      </View>
                   
                      <TouchableOpacity 
                        style={styles.deleteButtonHolder}
                        onPress={this.props.deleteCity.bind(this, index)}
                      >

                        <Image 
                            source={require('../assets/delete.png')}
                            style={{width: 40, height: 40, margin: 5, marginRight: '25%'}}
                        />

                      </TouchableOpacity>
                    </TouchableOpacity>
                </ScrollView>
                }
              />
            ) : <Text style={{alignSelf:'center'}}>No cities to display</Text>
          }
        </Panel>

      </View>
    );
    return (
            <DrawerLayoutAndroid renderNavigationView={() => drawer}
              drawerWidth={300}
              statusBarBackgroundColor='#7faf77'
              ref={_drawer => (this.drawer = _drawer)}
            >
              <ToolbarAndroid style={styles.toolbar}
                navIcon={require('../assets/hamburger.png')}
                actions={[{title: 'Umbrella', icon: require('../assets/umbrella.png'), show: 'always'}]} 
                onActionSelected={this.props.handleDisplay.bind(this)}
                onIconClicked={this.openDrawer}
              />
              {this.props.children}
            </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: '#699162',
  },
  aboutUsText: {
    alignSelf: 'center',
    color: 'dodgerblue',
    fontSize: 14,
    paddingVertical: 8,
    fontFamily: 'sans-serif-light',
    
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'dodgerblue',
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  aboutButtonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'dodgerblue',
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemStyles: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderTopWidth: 0.5,
    borderRightWidth: 2,
    borderLeftWidth: 0.5,
    borderColor: '#fff',
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,  
  },
  buttonTextStyle: {
    alignSelf: 'center',
    color: 'dodgerblue',
    fontSize: 20,
  
    paddingVertical: 8,
    fontFamily: 'sans-serif-light',
  },
  citiesNameHolder: {
    marginLeft: 10,
    flexDirection: 'row',
    width: '75%',
  },
  deleteButtonHolder: {
    flexDirection: 'row-reverse',
    width: '25%'
  },
  deleteButtonTextStyle: {
    color: 'dodgerblue',
    fontSize: 25,
    fontWeight: 'bold',
  }
});
