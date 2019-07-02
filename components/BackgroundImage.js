import React from 'react';
import { View, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import defaultImage from '../assets/dark.jpg';
import { getApiData } from './util';
import apiKeys from '../apiKeys';
import { googleImgApi } from '../apiUrls';

export default class BackgroundImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            imgUrl: null, // use it to set the image link, with its change the component re-renders
            error: null,
            loading: false,
		}
    }

    imageSearch(city) {
        var randomNumber = Math.round(Math.random() * 9); // random number used for getting a random picture
        const imageParams = {
          q: city,
          num: 10,
          imgSize: 'xlarge',
          searchType: 'image',
          key: apiKeys.googleSearch,
          cx: apiKeys.googleCx
        }
            this.setState({ error: null, loading: true });
        getApiData(googleImgApi, imageParams)
          .then(data => {
                    if (data.error) {
                        this.setState({
                            error: true,
                            loading: false,
                        });
                        return;
                    }
            let imgUrl = data.items[randomNumber].link;
            this.setState({
                        imgUrl,
                        error: false,
                        loading: false,
            });
          })
    }

    static propTypes = {
        city: PropTypes.string.isRequired, // make props required using prop types
    }

    componentDidUpdate(prevProps) {
        if (prevProps.city !== this.props.city) { // if previous prop is different from current prop call function
            this.imageSearch(this.props.city);
        }
	}

	render() {
		const {
            imgUrl,
            loading,
            error,
		} = this.state;

        const {
            children,
		} = this.props;

        if (loading || error || this.props.city == '') { // on loading | error set default background
            return (
				<View style={{ backgroundColor: 'black', width: '100%', height: '100%', flex: 1 }}>
					{children}
				</View>
			);
		}

		return (
			<ImageBackground // if url exist than set it else set the default image
				source={imgUrl ? { uri: imgUrl } : defaultImage}
                style={{ width: '100%', height: '100%', flex: 1 }}
                onError={() => this.setState({ error: true })}
                defaultSource={require('../assets/dark.jpg')}
			>
				{children}
			</ImageBackground>
		);
	}
}

