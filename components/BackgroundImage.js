import React from 'react';
import {
	View,
	ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import apiKeys from '../apiKeys';
import defaultImage from '../assets/defaultImg.jpg';

const googleImgApi = 'https://www.googleapis.com/customsearch/v1';

export default class BackgroundImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            imgUrl: null,
			error: null,
		}
    }

    // Props passed from Content
    // are required
    static propTypes = {
        city: PropTypes.string.isRequired,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.city !== this.props.city) {
            this.imageSearch(this.props.city);
        }
	}

    checkIfObj = (params) => {
        return typeof params == 'object' && params instanceof Object && !(params instanceof Array)
    }

    objToQueryString = (obj) => {
        const keyValuePairs = [];
        for (const key in obj) {
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
        return keyValuePairs.join('&');
    }

    getApiData = (url, params) => {
        if (params) {
            if (this.checkIfObj(params)) {
                const queryString = this.objToQueryString(params);
                url = `${url}?${queryString}`;
                console.log(url);
            } else {
                console.error('Parameters error.', 'Parameters need to be send as plain object.');
                return;
            }
        }
    
        return fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return {
                        error: 'Bad request'
                    };
                }
    
                return response.json();
            })
            .then(data => data)
            .catch(error => console.log(error));
    }

	imageSearch = (city) => {
		var randomNumber = Math.round(Math.random() * 9);
		const imageParams = {
			q: city,
			num: 10,
			imgSize: 'xlarge',
			searchType: 'image',
			key: apiKeys.googleSearch,
			cx: apiKeys.googleCx
		}
        this.setState({ error: null, loading: true });
		this.getApiData(googleImgApi, imageParams)
			.then(data => {
                if (data.error) {
                    this.setState({
                        error: true,
                        loading: false,
                    });
                    return;
                }
				let imgUrl = data.items[randomNumber].link;
				console.log(imgUrl);
				this.setState({
                    imgUrl,
                    error: false,
                    loading: false,
				});
			})
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

        if (loading || error || this.props.city == '') {
            return (
				<View style={{ backgroundColor: 'black', width: '100%', height: '100%', flex: 1 }}>
					{children}
				</View>
			);
		}

		return (
			<ImageBackground
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

