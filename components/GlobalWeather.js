import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { iconHandler, getApiData, generateBoxes } from './util';
import apiKeys from '../apiKeys';
import defaultImage from '../assets/defaultImg.jpg';
import { BASE_URL, googleImgApi } from '../apiUrls';

const Cities = [{id:1, name: 'Athens'}, {id:2, name: 'Belgrade'}, {id:3, name: 'Budapest'}, {id:4, name: 'Paris'}, {id:5, name: 'Rome'}, {id:6, name: 'London'}, {id:7, name: 'Tokyo'}, {id:8, name: 'Moscow'}, {id:9, name: 'Istanbul'}, {id:10, name: 'Washington'}];

export default class GlobalWeather extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            boxes: [],
        };
    }   

    getWeather(){
        var Boxes = [];
        var City = '';
        var Temp = 0;
        var Icon = '';
        var Status = '';
        var randomNumber = Math.round(Math.random() * 9);

        for(let i = 0; i < Cities.length; i++){      
            const imageParams = {
                q: Cities[i].name,
                num: 10,
                imgSize: 'xlarge',
                searchType: 'image',
                key: apiKeys.googleSearch,
                cx: apiKeys.googleCx
            }
            getApiData(googleImgApi, imageParams)
                .then(data => {
                    if (data.error) {
                         console.log(data.error);
                         return;
                    }           
                fetch(`${BASE_URL}&q=${Cities[i].name}&units=${'metric'}`) // send Api request
                .then((res) => res.json())// get results
                .then(result => { 
                        City = Cities[i].name;
                        Temp = result.main.temp;
                        Icon = result.weather[0].icon;
                        Status = result.weather[0].description;
                        
                Boxes.push( // push data to array
                        <View style={styles.smallBoxes}>
                            <ImageBackground source={data.items[randomNumber].link ? { uri: data.items[randomNumber].link } : defaultImage}
                            style={{ width: '100%', height: '100%', flex: 1 }}
                            >
                                <TouchableOpacity 
                                    style={styles.smallBoxesContent}
                                    onPress={this.props.selectCity.bind(this, City)}
                                >                   
                                    <Text style={{ color: 'white' }}>{City}</Text>
                                    <Image
                                    source =
                                    {
                                        iconHandler(Icon)
                                    }
                                    style={{width:45, height:45}} 
                                    />                                      
                                    <Text style={{ color: 'white' }}>{Temp.toFixed(0)}°C</Text>
                                    <Text style={{ color: 'white', alignSelf: 'center' }}>{Status}</Text>                
                                </TouchableOpacity>                                
                            </ImageBackground>
                        </View>,
                );
                this.setState({boxes: Boxes.slice(0)}) // update state
          })
        })
      }
    }

      componentWillMount(){
          this.getWeather();
      }

      render(){
          return(         
                <View style={styles.contentContainer}>
                    {
                        generateBoxes(this.state.boxes)
                    }
                </View>
          );
      }
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    smallBoxes: {
        height: 200,
        width: '49%',
        margin: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
      },
    smallBoxesContent: {
        backgroundColor: 'rgba(0,0,0, 0.3)',
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1,
    }
})

