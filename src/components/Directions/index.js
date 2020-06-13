/* eslint-disable no-undef */
import {DirectionsRenderer} from "react-google-maps";
import React, {Component} from "react";
import * as _ from 'lodash'

class Directions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			directions: null,
			error: null
		}
	}
	
	componentDidMount() {
		const {places, travelMode} = this.props;
		this.handleFetchData(places, travelMode)
	}
	
	componentWillReceiveProps(nextProps, nextContext) {
		const {places, travelMode} = nextProps;
		this.handleFetchData(places, travelMode)
	}
	
	// shouldComponentUpdate(nextProps) {
	// 	console.log({nextProps,props:this.props})
	// 	return !_.isEqual(this.props, nextProps);
	// }
	
	handleFetchData = (places, travelMode) => {
		if (_.size(places) < 2) {
			return
		}
		
		const waypoints = places.map(p => ({
			location: {lat: p.lat, lng: p.lng},
		}));
		const origin = waypoints.shift().location;
		const destination = waypoints.pop().location;
		
		
		const directionsService = new google.maps.DirectionsService();
		directionsService.route(
			{
				origin: origin,
				destination: destination,
				travelMode: travelMode,
				waypoints: waypoints,
			},
			(result, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					this.setState({directions: result});
				} else {
					this.setState({error: result});
				}
			}
		);
	};
	
	render() {
		if (!_.isEmpty(this.state.error)) {
			return <h1>Error is found </h1>;
		}
		if (_.size(this.props.places) < 2) {
			return null
		}
		return <DirectionsRenderer directions={ this.state.directions }/>
	}
}

export default Directions
