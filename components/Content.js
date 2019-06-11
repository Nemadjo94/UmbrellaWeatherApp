/* eslint-disable class-methods-use-this */
/* eslint-disable no-else-return */
/* eslint-disable vars-on-top */
/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable global-require */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-spacing */
/* eslint-disable prefer-template */
/* eslint-disable keyword-spacing */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable semi */
/* eslint-disable linebreak-style */
/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable lines-between-class-members */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */
import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
  } from 'react-native';
import moment from 'moment';
import { dayOfTheWeek } from './util';
import BackgroundImage from './BackgroundImage';
import Toolbar from './Toolbar';
import Icon from './Icon';
import TimeLastUpdated from './TimeLastUpdated';

const API_KEY = 'dc45874b05239b0dd78000d5ded088da';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&mode=json&APPID=' + API_KEY;
const FORECAST_URL = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&mode=json&APPID=' + API_KEY;


export default class Content extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          hourlyBoxes: [],
          Boxes: [],
          city: '',
          cityToPass: ' ',
          weather: null,
          loading: false,
          currentDay: '',
          gestureY: new Animated.Value(-125),
        };
    }

    getWeather(){
      //Set loading flag to true
      this.setState({loading: true});
      //Send Api request
       fetch(`${BASE_URL}&q=${this.state.city}`)
        .then((res) => res.json())//get results
        .then(result => {
          //display error message
          if(!result.main || typeof result.main.temp === 'undefined'){
            if(result.message){
              Alert.alert(result.message);
            }else{
              Alert.alert('Something went wrong');
            }
            this.setState({loading: false});
            return;
          }
          //update state
          this.setState({
            loading: false,
            cityToPass: result.name,
            weather: {
              currentTemp: result.main.temp,
              minTemp: result.main.temp_min,
              maxTemp: result.main.temp_max,
              city: result.name,
              status: result.weather[0].description,
              updateTime: result.dt,
              icon: result.weather[0].icon,
            },
          })

        }).catch((error) => {
          //If server is not available call this method
          Alert.alert(error.message);
        })
    }

    //Get current day of the week in string
    getCurrentDay(){
      //return number of the day of the week
      const currentDay = moment().day();
      this.setState({//return day of the week in string
                    //imported from util
        currentDay: dayOfTheWeek(currentDay),
      })  
    }

    getForecast(){
      var Boxes = [];
      var hourlyBoxes = [];
      var minNumArray = [];
      var maxNumArray = [];  
      var minNum = 0;
      var maxNum = 0;
      var Icon = '';
      var Status = '';
      var date = new Date();
      var Day = (date.getDay() + 1); 
      var curDate = moment().format('YYYY-MM-DD');
      var hourlyStatus = '';
      var hourlyIcon = '';
      var hourlyTemp = 0;
      var hours = 3;
  
        //Send API request
       fetch(`${FORECAST_URL}&q=${this.state.city}`)
        .then((res) => res.json()) //get results
        .then(result => {      
          // Go through the elements of the list array
          for(let i = 0; i < result.list.length - 1; i++){
            if(i < 8){
              
              hourlyStatus = result.list[i].weather[0].description;
              hourlyIcon = result.list[i].weather[0].icon;
              hourlyTemp = result.list[i].main.temp;

              hourlyBoxes.push(
                <View style={styles.smallBoxes}>
                  <Text style={{ color: 'white' }}>Next: {hours}h</Text>
                  <Image
                    source =
                    {{
                      uri: `http://openweathermap.org/img/w/${hourlyIcon.toString()}.png`,
                    }}
                      style={{width:50, height:50, marginVertical: -10}}
                  />
                  <Text style={{ color: 'white' }}>{hourlyStatus}</Text>
                  <Text style={{ color: 'white' }}>{hourlyTemp.toFixed()}°C</Text>
                </View>,
              );
              hours += 3;
            }

            //Get todays date from the list
            var arrayDate = result.list[i].dt_txt.split(" ");
            //We are skipping todays forecasts
            //because we need forecasts for the next 5 days
            if(curDate == arrayDate[0]){
              //just skip
            }else{
              var n = result.list[i].dt_txt.split(" ");//Ovo radi
              var m = result.list[i + 1].dt_txt.split(" ");//Radi dobavlja sva vremena 
              if(n[0] == m[0]){//Ako je datum isti dobavi mi min i max za taj datum
                minNumArray.push(result.list[i].main.temp_min);
                maxNumArray.push(result.list[i].main.temp_max);  
                Icon = '';
                Status = '';         
              }else{//Ako ne daj mi min i max vrednosti, ikonu i status i izgenerisi jednu kocku
                minNum = Math.min(...minNumArray);
                maxNum = Math.max(...maxNumArray);
                minNumArray = [];
                maxNumArray = [];
                Icon = result.list[i-3].weather[0].icon;//i-3 bi bilo za tacno u podne ikonu i status
                Status = result.list[i-3].weather[0].description; //nepotrebno
                Boxes.push(
                  <View style={styles.boxes}>
                    <Text style={{ color: 'white' }}>{dayOfTheWeek(Day)}</Text>
                    <Image
                      source=
                      {{
                        uri: `http://openweathermap.org/img/w/${Icon.toString()}.png`
                      }}
                        style={{width:50, height:50}}
                    />
                    <Text style={{ color: 'white' }}>{Status}</Text>
  
                    <View>
  
                      <Text style={{ color: 'white' }}>Min:
                        <Text style={{ fontWeight: 'bold' }}>
                          {minNum.toFixed()}°C
                        </Text>
                      <Text> Max:
                        <Text style={{ fontWeight: 'bold' }}>
                          {maxNum.toFixed()}°C
                        </Text>
                      </Text>
                      </Text>
                    </View>
  
                  </View>,
                );
                if (Day == 7){
                  Day = 1;
                }
                else
                {
                  Day++;
                }
               
              }
            }        
          }
          this.setState({
            hourlyBoxes: hourlyBoxes.slice(0),
            Boxes: Boxes.slice(0),

          })
          console.log(this.state.hourlyBoxes.length);
          console.log(this.state.Boxes.length);
      }).catch((error) => {
        //If server is not available call this method
        //Alert.alert(error.message);
      })
  
    }
  
    generateBoxes(boxes){
      const Boxes = boxes.slice(0);
      return Boxes;
    }


    render(){
      let translateY = this.state.gestureY.interpolate({
        inputRange: [-125, 125],
        outputRange: [200, 0],
        extrapolate: 'clamp',
      });
  
      let opacity = this.state.gestureY.interpolate({
        inputRange: [-125, 20],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

            return(
          <BackgroundImage
				    city={this.state.cityToPass}
			    >
          <Toolbar>

              <View style={styles.container}>

                <View style={styles.searchContainer}>

                  <TextInput
                      style={styles.textInput}
                      placeholder=" Insert city here.."
                      //Call func on change text
                      onChangeText={(text) => {
                        this.setState({
                          city: text,
                        })
                      }}
                      //Set input value
                      value={this.state.city}                   
                  />

                  <TouchableOpacity 
                    style={styles.searchBtn} 
                    onPress={() => {
                      this.getWeather();
                      this.getForecast();
                      this.getCurrentDay();
                      this.setState({city: ''})
                    }}>
                    <Text style={styles.searchBtnText}>Search</Text>
                  </TouchableOpacity>

                </View>

                <View style={styles.contentContainer}>{this.state.loading ? <ActivityIndicator size='large' color='#fff' /> : null}
                    {this.state.weather ? <View //show weather if available else hide the elements
                    style={styles.content}
                    > 
                      <Text style={styles.name}>{this.state.weather.city.toUpperCase()}</Text>
                      <View>
                        <Text style={styles.currentDay}>{this.state.currentDay.toUpperCase()}</Text>
                      </View>
                      <Icon size="large" icon={this.state.weather.icon} />
                      <Text style={styles.status}>{this.state.weather.status.toUpperCase()}</Text>
                      <Text style={styles.currentTemp}>{this.state.weather.currentTemp.toFixed()}°C</Text>

                    <TimeLastUpdated time={this.state.weather.updateTime} />

                    {this.state.hourlyBoxes ?
                    <ScrollView horizontal contentContainerStyle={styles.nextWeatherContainer}>
                      {
                        this.generateBoxes(this.state.hourlyBoxes)
                      }
                    </ScrollView>
                    : null}
                    

        <AnimatedTouchable
					style={{
						position: 'absolute',
						bottom: -20,
						left: 0,
						right: 0,
						zIndex: 3,
						height: 200,
						backgroundColor: 'rgba(0,0,0,0.5)',
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						transform: [{ translateY }]
					}}
          delayPressIn={500}
					onPress={
						() => Animated.spring(this.state.gestureY, {
							toValue: -125,
							speed: 2,
							bounciness: 0,
							useNativeDriver: true
						}).start(() => this.state.gestureY.setValue(-125))
					}
				>
         <Animated.ScrollView horizontal contentContainerStyle={styles.contentContainer2}>
                      {
                        this.generateBoxes(this.state.Boxes)
                      }
         </Animated.ScrollView>
				</AnimatedTouchable>

				<AnimatedTouchable
					style={{
						position: 'absolute',
						bottom: -20,
						left: 0,
						right: 0,
						zIndex: 3,
						height: 50,
						backgroundColor: 'rgba(0,0,0,0.5)',
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						opacity,
					}}
					onPress={
						() => Animated.spring(this.state.gestureY, {
							toValue: 125,
							speed: 2,
							bounciness: 0,
							useNativeDriver: true,
						}).start(() => this.state.gestureY.setValue(125))
					}
				>
					<Animated.Text
						style={{
							color: '#fff',
							fontSize: 20,
						}}
					>
						Show more
					</Animated.Text>
				</AnimatedTouchable>
                    
                    </View>
                  
                    : null }
                    
                </View>

                </View>

                </Toolbar>
                
                </BackgroundImage>
            );
        }
}

const styles = StyleSheet.create({
    container: {
      flex: 2,
    },
    searchContainer: {
      flex: 0.1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(0,0,0,0.3)',
      flexDirection: 'row',
    },
    contentContainer: {
      flex: 0.9,
      paddingTop: '6%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    searchBtn: {
      height: 70,
      width: '80%',
      backgroundColor: 'dodgerblue',       
    },
    searchBtnText: {
      fontSize: 22,
      color: '#fff',
      marginTop: '4%',
      marginLeft: '2%',
    },
    content: {
      alignItems: 'center',
      marginBottom: 10,
    },
    name: {
      fontSize: 44,
      color: '#fff',
      marginBottom: -15,
      fontWeight: 'bold',
    },
    navigator: {
      flex: 1,
    },
    status: {
      color: '#fff',
      fontSize: 18,
      marginTop: -35,
      marginBottom: 5,
    },
    currentDay: {
      color: '#fff',
      fontSize: 18,
      
    },
    currentTemp: {
      color: '#fff',
      fontSize: 32,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    minmaxTemp: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 5,
    },
    minmaxTempBold: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    textInput: {
      height: 70,
      width: '80%',
      fontSize: 22,
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignSelf: 'center',
    },
    contentContainer2: {
      alignContent: 'flex-end',
      marginBottom: -20,
      backgroundColor: 'rgba(0,0,0,0.3)',
      height: 200,
    },
    nextWeatherContainer: {
      alignContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.3)',
      height: 200,
    },
    boxes: {
      marginVertical: '1.5%',
      height: 150,
      width: 220,
      backgroundColor: 'rgba(0,0,0,0.5)',
      marginHorizontal: 10,
      borderRadius: 20,
      alignItems: 'center',
    },
    smallBoxes: {
      marginVertical: '1.5%',
      height: 150,
      width: 220,
      backgroundColor: 'rgba(0,0,0,0.5)',
      marginHorizontal: 10,
      borderRadius: 20,
      alignItems: 'center',
    },
  });
