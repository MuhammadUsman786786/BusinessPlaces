import React from 'react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng,} from 'react-places-autocomplete';
import './index.css'
import * as _ from 'lodash'

class LocationSearchInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { address: '' };
	}
	
	handleChange = address => {
		this.setState({ address });
	};
	
	handleSelect = address => {
		geocodeByAddress(address)
			.then(results => {
				const address=_.get(results,'[0].formatted_address','')
				this.handleChange(address)
				return getLatLng(results[0])
			})
			.then(latLng => {
				const {lat:latitude,lng:longitude}=latLng||{}
				this.props.onSelectHandler({latitude,longitude,lat:latitude,lng:longitude})
			})
			.catch(error => console.error('Error', error));
	};
	
	render() {
		return (
			<PlacesAutocomplete
				value={this.state.address}
				onChange={this.handleChange}
				onSelect={this.handleSelect}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
					<div className='list-container' style={this.props.listContainer} >
						<input
							{...getInputProps({
								placeholder: 'Search Google Maps',
								className: 'location-search-input',
							})}
						/>
						<div className="autocomplete-dropdown-container">
							{loading && <div>Loading...</div>}
							{suggestions.map(suggestion => {
								const className = suggestion.active
									? 'suggestion-item--active'
									: 'suggestion-item';
								const style = suggestion.active
									? { backgroundColor: '#fafafa', cursor: 'pointer' }
									: { backgroundColor: '#ffffff', cursor: 'pointer' };
								return (
									<div
										{...getSuggestionItemProps(suggestion, {
											className,
											style,
										})}
									>
										<span>{suggestion.description}</span>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</PlacesAutocomplete>
		);
	}
}

export default LocationSearchInput
