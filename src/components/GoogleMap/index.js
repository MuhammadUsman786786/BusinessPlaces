import React, {Component} from 'react'
import {GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs} from "react-google-maps"
import * as _ from 'lodash'
import {Link} from 'react-router-dom'
import {MAP_CENTER, PLACE_API_KEY} from "../../utilities/Constants";

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
		const {item = {}} = this.props
		const {geometry = {}, vicinity, name, business_status, photos} = item || {}
		const {location,} = geometry || {}
		let link = _.get(photos, '[0].html_attributions.[0]', '')
		if (!_.isEmpty(link)) {
			link = _.split(_.split(link, 'href="')[1], '">')[0]
		}
		return (
			<Marker position={ location } onClick={ this.handleMouseOver }>
				{ showInfoWindow && (
					<InfoWindow onCloseClick={ this.handleMouseExit }>
						<div>
							<img src={ 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png' } style={ {width: 20, height: 20} }/>
							<p className='font-weight-bold mt-2 '>{ name }</p>
							<p className='font-weight-bold' style={ {marginTop: -8} }>{ vicinity }</p>
							<p className='font-weight-bold' style={ {marginTop: -8} }>{ business_status }</p>
							<Link to={ {pathname: link} } target="_blank">
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
		const {dataList = []} = props || {}
		return <GoogleMap
			defaultZoom={ 15 }
			ref={ (ref) => props.getMapRef(ref) }
			defaultCenter={ MAP_CENTER }>
			{
				_.map(dataList, (item) => {
					return <CustomMarker
						key={ item.id }
						item={ item }
					/>
				})
			}
		</GoogleMap>
	}
));

class CustomMap extends Component {
	render() {
		return (
			<MyMapComponent
				isMarkerShown
				{ ...this.props }
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${PLACE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={ <div style={ {height: `100%`} }/> }
				containerElement={ <div style={ {height: `100%`} }/> }
				mapElement={ <div style={ {height: `100%`} }/> }
			/>
		)
	}
}

export default CustomMap
