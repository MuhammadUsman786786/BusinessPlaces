import React, {Component} from 'react'
import {GoogleMap, Circle, InfoWindow, Marker, withGoogleMap, withScriptjs} from "react-google-maps"
import * as _ from 'lodash'
import {Link} from 'react-router-dom'
import {MAP_CENTER, MAP_CONFIGURATION, MARKER_ICONS, PLACE_API_KEY} from "../../utilities/Constants";
import {buildImageUrl, generateGoogleMapPlaceLink} from "../../utilities/Transform";

class CustomMarker extends Component {
	state = {
		showInfoWindow: false
	};
	handleMouseOver = e => {
		this.setState({
			showInfoWindow: true
		});
	};
	handleMouseExit = e => {
		this.setState({
			showInfoWindow: false
		});
	};
	
	render() {
		const {showInfoWindow,} = this.state;
		const {item = {},isMarkerInfoWindowAllowed} = this.props
		const {geometry = {}, vicinity, name, business_status, photos, place_id} = item || {}
		const {location,} = geometry || {}
		let imageUrl = ''
		if (typeof _.get(photos, '[0].getUrl') === "function") {
			imageUrl = photos[0].getUrl()
		}
		return (
			<Marker
			icon={{
				url:this.props.icon,
				// eslint-disable-next-line no-undef
				// anchor: new google.maps.Point(0, 100),
				// eslint-disable-next-line no-undef
				// scaledSize:  new google.maps.Size(100,100)
			}}
				position={ location } onClick={ this.handleMouseOver }>
				{isMarkerInfoWindowAllowed&& showInfoWindow && (
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
								<button className='btn btn-sm btn-primary'>Visit ></button>
							</Link>
						</div>
					</InfoWindow>
				) }
			</Marker>
		);
	}
}


const MyMapComponent = withScriptjs(withGoogleMap((props) => {
		const {dataList = [], mapCenter, radius} = props || {}
		return <GoogleMap
			defaultZoom={ 15 }
			ref={ (ref) => props.getMapRef(ref) }
			defaultCenter={ MAP_CENTER }>
			{
				_.map(dataList, (item) => {
					return <CustomMarker
						key={ item.id }
						item={ item }
						icon={MARKER_ICONS}
						isMarkerInfoWindowAllowed={props.isMarkerInfoWindowAllowed}
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
