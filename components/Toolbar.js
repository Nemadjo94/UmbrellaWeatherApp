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
  Button,
  Text,
  UIManager,
  Platform,
  ScrollView,
  LayoutAnimation,
}
  from 'react-native';
import ExpandableList from './ExpandableList';

//Hamburger menu and toolbar definition
export default class Toolbar extends React.Component {
  constructor() {
    super();
    this.openDrawer = this.openDrawer.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const array = [
      {
        expanded: false, cities: [{ id: 1, name: 'Belgrade' }, { id: 2, name: 'Novi Sad' }, { id: 3, name: 'Indjija' },
          { id: 4, name: 'Stara Pazova' }]
      },
    ];

    this.state = { AccordionData: [...array] };
  }

  updateLayout = (index) => {
 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
 
    const array = [...this.state.AccordionData];
 
    array[index]['expanded'] = !array[index]['expanded'];
 
    this.setState(() => {
      return {
        AccordionData: array
      }
    });
  }

  openDrawer() {
    this.drawer.openDrawer();
  }

  render() {
    let drawer = (
      <View style={{flex: 1, backgroundColor: '#91c988', justifyContent: 'flex-start'}}>

        <Text style={styles.menuTitle}>Menu</Text>
        <View style={styles.menuButtons}>
        <Button title="Settings" onPress={() => null}/>
        </View>
        <View style={styles.menuButtons}>
        <Button title="About us" onPress={() => null} />

        <ScrollView style={styles.menuButtons}>
          {
            this.state.AccordionData.map((item, key) =>
              (
                <ExpandableList key={item.id} onClickFunction={this.updateLayout.bind(this, key)} item={item} />
              ))
          }
        </ScrollView>

        </View>
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
  menuTitle: {
    alignSelf: 'center',
    marginTop: 20,
    color: '#fff',
    fontSize: 32,
  },
  menuButtons: {
    marginTop: 4,
  },
});
