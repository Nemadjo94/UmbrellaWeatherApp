/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
/* eslint-disable key-spacing */
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
    AsyncStorage
  } from 'react-native';
import moment from 'moment';
import { dayOfTheWeek, iconHandler, generateBoxes } from './util';
import BackgroundImage from './BackgroundImage';
import Toolbar from './Toolbar';
import Icon from './Icon';
import TimeLastUpdated from './TimeLastUpdated';
import GlobalWeather from './GlobalWeather';
import { BASE_URL, FORECAST_URL} from '../apiUrls';
import GLOBAL from './GLOBAL';


export default class Content extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          hourlyBoxes: [], // use it to store the elements for hourly weather
          Boxes: [], // use it to store the elements for daily weather 
          favoriteCities: [], // use it to store favorite city list
          city: '', 
          cityToPass: ' ',
          weather: null, // weather obj use it to store the data from api
          loading: false, // loading for spinner
          currentDay: '',
          display: true,
          favoriteCity: false,
          gestureY: new Animated.Value(-125), // animation for show more panel
        };
    }

    getWeather(){ // get the current weather
      this.setState({loading: true});// set loading flag to true
       fetch(`${BASE_URL}&q=${this.state.city}&units=${GLOBAL.TempState.state.tempValue}`)// send Api request
        .then((res) => res.json())// get results
        .then(result => {
          if(!result.main || typeof result.main.temp === 'undefined'){// display error message
            if(result.message){
              Alert.alert(result.message);
            }else{
              Alert.alert('Something went wrong');
            }
            this.setState({loading: false});
            return;
          }
          this.setState({// update state
            loading: false,
            cityToPass: result.name,
            weather: { // update weather obj
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
          Alert.alert(error.message);// if server is not available call this method
        })
    }

    getCurrentDay(){ // get current day of the week in string
      const currentDay = moment().day(); // return number of the day of the week
      this.setState({ // return day of the week in string
        currentDay: dayOfTheWeek(currentDay), //imported func from util.js
      })  
    }

    getForecast(){ //get hourly and daily weather
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
      var hours = '';
  
      fetch(`${FORECAST_URL}&q=${this.state.city}&units=${GLOBAL.TempState.state.tempValue}`) //send api request
        .then((res) => res.json()) //get results
        .then(result => {      
          for(let i = 1; i < result.list.length - 1; i++){   // go through the elements of the list array
            if(i < 7){ // api shows weather every 3h, so 8 x 3 = 24h, we get the weather for the next 24h
              // this part is for hourly weather       
              hourlyStatus = result.list[i].weather[0].description;
              hourlyIcon = result.list[i].weather[0].icon;
              hourlyTemp = result.list[i].main.temp;
              var n = result.list[i].dt_txt.split(" ")[1]; // dt_txt: date hours so we split and get the hours to display
              hours = n.slice(0, -3); // 12:00:00 so cut the last 3 chars, we want 12:00

              hourlyBoxes.push(
                <View style={styles.smallBoxes} onStartShouldSetResponder={() => true}>
                  <Text style={{ color: 'white' }}>{hours}</Text>
                  <Image
                    source =
                    {
                      iconHandler(hourlyIcon)
                    }
                      style={{width:45, height:45, marginVertical: -10}}
                  />
                  
                  <Text style={{ color: 'white' }}>{hourlyTemp.toFixed()}°C</Text>
                </View>,
              );
            }
            // this part is for daily weather
            var arrayDate = result.list[i].dt_txt.split(" ");  // get todays date from the list
            if(curDate == arrayDate[0]){ // if the current dates matches just skip it because we need the next 5days
              //just skip today
            }else{
              var n = result.list[i].dt_txt.split(" "); 
              var m = result.list[i + 1].dt_txt.split(" ");
              if(n[0] == m[0]){ // compare current date in array with the upcomming date
                minNumArray.push(result.list[i].main.temp_min); // while the same date push the temp values for the same date
                maxNumArray.push(result.list[i].main.temp_max);  
                Icon = ''; // reset
                Status = ''; // reset
              }else{ // else means that we are going to enter the next date so get the values for that date
                minNum = Math.min(...minNumArray); // get the max temp for that date
                maxNum = Math.max(...maxNumArray); // get min temp
                minNumArray = []; // reset
                maxNumArray = []; // reset 
                Icon = result.list[i-3].weather[0].icon;//i-3 is for 12:00 weather
                console.log(result.list[i-3]);
                Boxes.push( // push the data in array
                  <View style={styles.dailyWeatherContainer}>

                    <View style={styles.weekBox}>
                      <Text style={styles.boxesText}>{dayOfTheWeek(Day)}</Text>
                    </View>

                    <View style={styles.imageBox}>
                      <Image
                        source =
                        {
                        iconHandler(Icon)
                        }
                          style={{width:45, height:45, alignSelf: 'center', }}
                      />     
                    </View>

                    <View style={styles.tempBox}>           
                      <Text style={[styles.boxesText, {justifyContent: 'flex-end'}]}>
                        {minNum.toFixed() + '°C / '}  
                      </Text>              
                      <Text style={[styles.boxesText, {justifyContent: 'flex-end', fontWeight: 'bold'}]}>
                        {maxNum.toFixed()}°C
                      </Text>
                    </View>

                  </View>,
                );
                if (Day == 7){ // sunday is 7 so reset to monday = 1
                  Day = 1;
                }
                else
                {
                  Day++;
                }
               
              }
            }        
          }
          this.setState({ // update state
            hourlyBoxes: hourlyBoxes.slice(0), // hourly weather
            Boxes: Boxes.slice(0), // daily weather

          })
      }).catch((error) => { //If server is not available call this method
        console.log(error.message);
      })
  
    }

    FavoriteCityHandler(city){ // responsible for our favorite cities array

      let exists = 0; // if city exists in list then ++
      this.setState(
        () => {
          const { favoriteCities } = this.state;
          if(favoriteCities.length == 0){ // check if empty array
            return{
              favoriteCities: favoriteCities.concat(city), // add to list
              favoriteCity: true,
            };
          }else{ // if not empty
            for(let i = 0; i < favoriteCities.length; i++){
              if(favoriteCities[i] === city){ // check if city already on list
                exists++;
              }
            }
            if(exists == 0){ // if city is not on the list then add to list
              return{            
                favoriteCities: favoriteCities.concat(city),
                favoriteCity: true,
              };
            }else{ // display error message
              Alert.alert('City already on the list.');
            }   
          }
        }, () => AsyncStorage.setItem('FAVORITE_CITIES', JSON.stringify(this.state.favoriteCities)) // callback save to async storage

      )
    }

    getfavoriteCityIcon = () => {
      const { favoriteCities, city } = this.state;
      let exists = 0;

      if(favoriteCities.length == 0){ // if the fav city list is empty do nothing
        return;
      }else{ // else check if the selected city is on the list
        for(let i = 0; i < favoriteCities.length; i++){
          if(favoriteCities[i] === city){ 
            exists++;
          }
        }
        if(exists == 0){
          this.setState({favoriteCity: false});
        }else{
          this.setState({favoriteCity: true})
        }
      }
    }
 
    selectCity = (item) => { // is passed to toolbar component as prop to handle city selection
      this.setState(
        {city:item, display: false}, // update city state
        () => callback() // update content
      );

      callback = () => {
        this.getWeather();
        this.getCurrentDay();
        this.getForecast();
        this.getfavoriteCityIcon();
        this.setState({city: ''});
      }
    }

    deleteCity = (index) => { // passed to toolbar component as prop to handle city deletion     
        this.setState(
          prevState => {
            let prev = prevState.favoriteCities.slice(); // copy entire array
            prev.splice(index, 1); // splice 
            return { favoriteCities: prev};
          }, () => AsyncStorage.setItem('FAVORITE_CITIES', JSON.stringify(this.state.favoriteCities))
        )
    }

    handleDisplay = () => {
      this.setState({
        display: !this.state.display,
      }, () => console.log('Display ' + this.state.display));
    }

    componentDidMount(){
      AsyncStorage.getItem('FAVORITE_CITIES', (error, result) => { // fetch favorite cities from async storage 
        this.setState({ favoriteCities: JSON.parse(result) || [] }) // else set to empty array 
      })
    }

    render(){
      let translateY = this.state.gestureY.interpolate({
        inputRange: [-125, 125],
        outputRange: [450, 0],
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
        <Toolbar favoriteCities={this.state.favoriteCities} selectCity={this.selectCity} deleteCity={this.deleteCity} handleDisplay={this.handleDisplay} >
        
         

            <View style={styles.container}>

              <View style={styles.searchContainer}>

                <TextInput
                    style={styles.textInput}
                    placeholder=" Insert city here..."
                    onChangeText={(text) => { // update state on text change
                      this.setState({
                        city: text,
                      })
                    }}
                    value={this.state.city} // set input value                   
                />

                <TouchableOpacity 
                  style={styles.searchBtn} 
                  onPress={() => { // on button press call these functions
                    this.getWeather();
                    this.getForecast();
                    this.getCurrentDay();
                    this.getfavoriteCityIcon();
                    this.setState({city: ''}) // reset city state
                  }}>
                  <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity>

              </View>

              <View style={[styles.contentContainer, {display: this.state.display ? 'flex' : 'none'}]}>
                <ScrollView style={{flex: 1, zIndex: 4, backgroundColor: 'black'}}>
                    <GlobalWeather selectCity={this.selectCity} />
                </ScrollView>
              </View>

              <View style={[styles.contentContainer, {display: this.state.display ? 'none' : 'flex'}]}>
                
                {this.state.loading ? <ActivityIndicator size='large' color='#fff' /> : null /* loader handling */} 
               
                {this.state.weather ? // if weather obj is available display data
                  <>
                    <View style={styles.content}> 
                      <View style={{ width: '80%'}}>
                        <Text style={styles.name}>{this.state.weather.city.toUpperCase()}</Text>         
                        <Text style={styles.currentDay}>{this.state.currentDay.toUpperCase()}</Text>
                      </View>
                    </View>        

                    <Text style={styles.currentTemp}>{this.state.weather.currentTemp.toFixed()}°</Text>    
                    <Icon size="large" icon={this.state.weather.icon} />
                    <Text style={styles.status}>{this.state.weather.status}</Text>
                    <TimeLastUpdated time={this.state.weather.updateTime} /> 
                    

                  
                    <View style={{marginTop: 15, justifyContent: 'center', flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {this.FavoriteCityHandler(this.state.weather.city)}}
                        style={{borderWidth: 0.5, borderColor: '#fff', padding: 10, flexDirection: 'row', borderRadius: 10}}>
                        <Text style={{color: '#fff', fontFamily: 'sans-serif-light'}}>Add to favorites</Text>
                        <Image 
                        source={this.state.favoriteCity ? require('../assets/addedToFav.png') : require('../assets/addToFav.png')}
                        style={{width: 25, height: 25, alignSelf: 'center', marginLeft: 10, marginTop: -1}}
                        />
                      </TouchableOpacity>
                    </View>

                  </>
                : (null)

                  
                }

                
                
              </View>      
             </View>
             



                  
        {this.state.weather ? ( // this part handles the show more pane
           <>
              <AnimatedTouchable
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: this.state.display ? -5 : 3,
                    display: this.state.display ? 'none' : 'flex',
                    height: 450,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ translateY }]
                  }}
                  delayPressIn={50000}
                  onPress={
                    () => Animated.spring(this.state.gestureY, {
                      toValue: -125,
                      speed: 2,
                      bounciness: 0,
                      useNativeDriver: true
                    }).start(() => this.state.gestureY.setValue(-125))
                  }
                >
                    {this.state.hourlyBoxes ? //If there are hourly boxes display weather
                    <>
                      <Text style={styles.forecastText}>Forecast</Text>           
                      <View style={styles.forecastLine} />

                      <ScrollView horizontal alwaysBounceHorizontal={false} disableScrollViewPanResponder contentContainerStyle={styles.nextWeatherContainer}>
                      {
                        generateBoxes(this.state.hourlyBoxes)
                      }
                      </ScrollView>
                      </>
                      : null}

                    {this.state.Boxes ? //If there are boxes generate weather content
                    (<>             
                      <View style={styles.contentContainer2}>
                        {
                          generateBoxes(this.state.Boxes)
                        }
                      </View>
                    <Text style={{color: '#fff', marginBottom: '1%'}}>Tap again to close</Text>
                    </>
                    )
                    : null}

              </AnimatedTouchable>

              <AnimatedTouchable
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: this.state.display ? -5 : 3,
                      height: 50,
                      backgroundColor: 'rgba(0,0,0,0.6)',
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
                  <Animated.Text style={{color: '#fff', fontSize: 20, fontFamily: 'sans-serif-thin', fontWeight: 'bold',}}>Show more</Animated.Text>
              </AnimatedTouchable>
            </>
            ): null}
  

             
          </Toolbar>     
                     
        </BackgroundImage>
       
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    searchContainer: {
      flex: 0.1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(0,0,0,0.4)',
      flexDirection: 'row',
    },
    contentContainer: {
      flex: 0.9,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    searchBtn: {
      height: 70,
      width: '80%',
      backgroundColor: 'dodgerblue',       
    },
    searchBtnText: {
      fontFamily: 'sans-serif-light',
      fontSize: 22,
      color: '#fff',
      marginTop: '4%',
      marginLeft: '2.5%',
    },
    content: {
      flexDirection: 'row',
    },
    name: {
      fontSize: 45,
      color: '#fff',
      marginBottom: -15,
      paddingLeft: 5,
      fontWeight: 'bold',
      fontFamily: 'sans-serif-thin',
    },
    navigator: {
      flex: 1,
    },
    status: {
      fontFamily: 'sans-serif-light',
      color: '#fff',
      fontSize: 18,
      marginBottom: 5,
      alignSelf: 'center',
    },
    currentDay: {
      paddingLeft: 6,
      fontFamily: 'sans-serif-thin',
      color: '#fff',
      fontSize: 18,
      
    },
    currentTemp: {
      color: '#fff',
      fontSize: 75,
      fontFamily: 'sans-serif-thin',
      alignSelf: 'center',
      marginLeft: '5%',
    },
    minmaxTemp: {
      fontFamily: 'sans-serif-thin',
      color: '#fff',
      fontSize: 16,
      marginBottom: 5,
    },
    minmaxTempBold: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    textInput: {
      fontFamily: 'sans-serif-light',
      marginTop: -2,
      height: 70,
      width: '80%',
      fontSize: 22,
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignSelf: 'center',
    },
    nextWeatherContainer: {
      alignContent: 'flex-end',      
      height: 100,
      marginBottom: 50,
    },
    boxesText: {
      fontFamily: 'sans-serif-light',
      color: 'white',
      alignSelf: 'center',
      fontSize: 18,
    },
    smallBoxes: {
      height: 100,
      width: 80,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    forecastText: {
      fontFamily: 'sans-serif-light',
      width: '93%',
      margin: 15,
      borderBottomWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
      marginBottom: 5,
      fontSize: 25,
      color: '#fff', 
      alignSelf: 'flex-start',
    },
    //container for daily weather
    contentContainer2: {
      width: '93%',  
      marginBottom: '3%',  
    },
    //Holder for daily weather
    //inside are three views
    dailyWeatherContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
      height: 60,
    },
    tempBox: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      width: '30%',
    },
    weekBox: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
      width: '50%',
    },
    imageBox: {
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
