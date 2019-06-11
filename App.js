import React from 'react';
import Content from './components/Content';
import SplashScreen from './components/SplashScreen';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }
  //Timer for splash screen
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2500
      )
    );
  }

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();
  
    if (data !== null) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading){
      return <SplashScreen />;
    } 

    return(
      <Content />
    );
  }
}

