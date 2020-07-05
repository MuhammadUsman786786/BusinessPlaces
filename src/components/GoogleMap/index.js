/* eslint-disable no-undef */
import React, {Component} from 'react'
import {Circle, DirectionsRenderer, GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs} from "react-google-maps"
import * as _ from 'lodash'
import {Link} from 'react-router-dom'
import {MAP_CENTER, MARKER_ICONS, PLACE_API_KEY} from "../../utilities/Constants";
import {generateGoogleMapPlaceLink} from "../../utilities/Transform";
import Directions from "../Directions";

class CustomMarker extends Component {
	state = {
		showInfoWindow: false
	};
	handleMouseOver = e => {
		const {
			onMarkerClickHandler = () => {
			}
		} = this.props;
		this.setState({showInfoWindow: true});
		onMarkerClickHandler()
	};
	handleMouseExit = e => {
		this.setState({
			showInfoWindow: false
		});
	};
	
	render() {
		const {showInfoWindow,} = this.state;
		const {item = {}, isMarkerInfoWindowAllowed} = this.props;
		const {geometry = {}, vicinity, name, business_status, photos, place_id} = item || {};
		const {location,} = geometry || {};
		let imageUrl = '';
		let icon = this.props.icon;
		if (typeof _.get(photos, '[0].getUrl') === "function") {
			imageUrl = photos[0].getUrl()
		}
		
		let scaledSize = new google.maps.Size(30, 30);
		if (place_id === this.props.hoverPlaceId) {
			scaledSize = new google.maps.Size(50, 50)
		}
		
		if (place_id === this.props.selectedPlaceId) {
			scaledSize = new google.maps.Size(50, 50);
			icon = require('../../images/hotelGreenIcon.png')
		}
		// if (_.isEmpty(icon)) {
		// 	icon = MARKER_ICONS.RED
		// }
		
		return (
			<Marker
				icon={ {
					url: icon,
					scaledSize
					// eslint-disable-next-line no-undef
				} }
				position={ location }
				onClick={ this.handleMouseOver }>
				{ isMarkerInfoWindowAllowed && showInfoWindow && (
					<InfoWindow onCloseClick={ this.handleMouseExit }>
						<div>
							<img src={ imageUrl } style={ {
								width: '220px',
								height: '100px',
								objectFit: 'cover'
							} }/>
							<p className='font-weight-bold mt-2 ' style={ {width: '220px'} }>{ name }</p>
							<p className='font-weight-bold' style={ {marginTop: -8, width: '220px'} }>{ vicinity }</p>
							<p className='font-weight-bold' style={ {marginTop: -8, width: '220px'} }>{ business_status }</p>
							<Link to={ {pathname: generateGoogleMapPlaceLink(place_id)} } target="_blank">
								<button className='btn btn-sm btn-primary'>Visit</button>
							</Link>
						</div>
					</InfoWindow>
				) }
			</Marker>
		);
	}
}


const MyMapComponent = withScriptjs(withGoogleMap((props) => {
		const {dataList = [], dataList1 = [], mapCenter, radius} = props || {};
		const {hoverPlaceId, selectedPlaceId } = props || {};
		const {
			onMarkerClickHandler = () => {
			},
			onMarkerClickHandler1 = () => {
			}
		} = props || {}
		return <GoogleMap
			defaultZoom={ 15 }
			ref={ (ref) => props.getMapRef(ref) }
			defaultCenter={ MAP_CENTER }>
			{
				_.map(dataList, (item) => {
					return <CustomMarker
						item={ item }
						key={ item.place_id }
						icon={ MARKER_ICONS[item.types[0]] }
						hoverPlaceId={ hoverPlaceId }
						isMarkerInfoWindowAllowed={ props.isMarkerInfoWindowAllowed }
						onMarkerClickHandler={ () => {
							onMarkerClickHandler(item)
						} }
					/>
				})
			}
			{
				_.map(dataList1, (item) => {
					return <CustomMarker
						item={ item }
						key={ item.place_id }
						icon={ require('../../images/hotelBlackIcon.png') }
						hoverPlaceId={ hoverPlaceId }
						selectedPlaceId={ selectedPlaceId }
						isMarkerInfoWindowAllowed={ props.isMarkerInfoWindowAllowed }
						onMarkerClickHandler={ () => {
							onMarkerClickHandler1(item)
						} }
					/>
				})
			}
			{ props.isCircle &&
			<Circle
				center={ {
					lat: parseFloat(mapCenter.lat),
					lng: parseFloat(mapCenter.lng)
				} }
				radius={ radius }
				options={ {strokeColor: "#ff0000"} }
			/> }
			{
				!_.isEmpty(props.directionsPath) &&
				<DirectionsRenderer directions={ props.directionsPath }/>
			}
		</GoogleMap>
	}
));

class CustomMap extends Component {
	render() {
		return (
			<MyMapComponent
				{ ...this.props }
				googleMapURL={ `https://maps.googleapis.com/maps/api/js?key=${ PLACE_API_KEY }&v=3.exp&libraries=geometry,drawing,places` }
				loadingElement={ <div style={ {height: `100%`} }/> }
				containerElement={ <div style={ {height: `100%`} }/> }
				mapElement={ <div style={ {height: `100%`} }/> }
			/>
		)
	}
}

export default CustomMap
