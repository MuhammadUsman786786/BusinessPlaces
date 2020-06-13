import React, {Component} from 'react'
import CustomMap from "../../components/GoogleMap";
import {API_RESPONSE, API_RESPONSE_1, MAP_CENTER, TEST_IMAGE_URL} from "../../utilities/Constants";
import {withStyles} from '@material-ui/core/styles';
import {LocationSearchInput, SettingDialog} from "../../components";
import {navigateMap} from "../../utilities/MapUtils";
import {toast} from "react-toastify";
import * as _ from 'lodash'
import {searchGoogleMapNearbyPlaces} from "../../utilities/ApiCaller";
import Typography from "@material-ui/core/Typography";
import './index.css'

const styles = ((theme) => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400,
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

const HOTELS_KEYS = [ 'restaurant' ];

class RealStateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			dataList1: [],
			mapCenter: MAP_CENTER,
			businessType: '',
			radius: 1500,
			hoverPlaceId: '',
			selectedPlaceId: '',
			destinationId: '',
		};
		this.mapRef = null
	}
	
	onSelectBusinessType = (businessType) => {
		this.setState({businessType})
	};
	
	fetchDataHandler = async () => {
		const {mapCenter, radius} = this.state;
		let {businessType} = this.state;
		try {
			businessType = _.map(businessType, (item) => item.title);
			const selectedPlaces = await searchGoogleMapNearbyPlaces({mapCenter, businessType, radius});
			const hostelsList = await searchGoogleMapNearbyPlaces({mapCenter, businessType: HOTELS_KEYS, radius});
			this.setState({
				dataList: selectedPlaces,
				dataList1: hostelsList,
				hoverPlaceId: '',
				selectedPlaceId: '',
				destinationId: ''
			})
		} catch (e) {
		}
	};
	
	searchHandler = () => {
		const {closeModal} = this.props;
		const {businessType} = this.state;
		if (_.isEmpty(businessType)) {
			return toast.error('Business Type is required')
		}
		this.setState({dataList: [], dataList1: []});
		closeModal();
		this.fetchDataHandler()
	};
	
	getDirectionsList = () => {
		const {dataList, dataList1, selectedPlaceId, destinationId} = this.state;
		if (_.isEmpty(selectedPlaceId) || _.isEmpty(destinationId)) {
			return []
		}
		const directionsPointList = [];
		const mergedDataMap = _.keyBy([ ...dataList, ...dataList1 ], 'id');
		const sourceItem = mergedDataMap[selectedPlaceId];
		const destinationItem = mergedDataMap[destinationId];
		
		const sourceLocationItem = _.get(sourceItem, 'geometry.location', {});
		const destinationLocationItem = _.get(destinationItem, 'geometry.location', {});
		
		directionsPointList.push({
			...sourceLocationItem,
			lat: typeof sourceLocationItem.lat === 'function' ? sourceLocationItem?.lat() : '',
			lng: typeof sourceLocationItem.lng === 'function' ? sourceLocationItem?.lng() : ''
		});
		directionsPointList.push({
			...destinationLocationItem,
			lat: typeof destinationLocationItem.lat === 'function' ? destinationLocationItem?.lat() : '',
			lng: typeof destinationLocationItem.lng === 'function' ? destinationLocationItem?.lng() : ''
		});
		return directionsPointList
	};
	
	renderImages =()=>{
		const {dataList = [], dataList1 = []} = this.state;
		const mergedDataList=[...dataList, ...dataList1 ]
		if(_.isEmpty(mergedDataList)){
			return <h6 className='pt-3 text-center w-25'>No Place is found</h6>
		}
		return <div className='d-flex flex-wrap' style={ {width: '25%', height: '517px', overflow: 'scroll'} }>
			{ _.map(mergedDataList, (item) => {
				const {photos} = item || {};
				// eslint-disable-next-line no-unused-vars
				let imageUrl = null;
				if (typeof _.get(photos, '[0].getUrl') === "function") {
					imageUrl = photos[0].getUrl()
				}
				return <div
					className='image-style'
					onMouseOver={ () => {
						this.setState({hoverPlaceId: item.id})
					} }
					onMouseLeave={ () => {
						this.setState({hoverPlaceId: ''})
					} }
				>
					<img
						style={ {width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4} }
						src={ imageUrl }/>
				</div>
			})
			}
		</div>
	}
	
	render() {
		const {isModal, closeModal} = this.props;
		const {dataList = [], dataList1 = []} = this.state;
		const directionsList = this.getDirectionsList();
		return (
			<div className='flex h-100 position-relative'>
				<div className='d-flex' style={ {height: '70%'} }>
					{this.renderImages()}
					<div style={ {width: '75%'} }>
						<CustomMap
							getMapRef={ (ref) => (this.mapRef = ref) }
							dataList={ this.state.dataList }
							dataList1={ this.state.dataList1 }
							radius={ this.state.radius }
							mapCenter={ this.state.mapCenter }
							hoverPlaceId={ this.state.hoverPlaceId }
							selectedPlaceId={ this.state.selectedPlaceId }
							directionsList={ directionsList }
							onMarkerClickHandler={ (item) => {
								if (!_.isEmpty(this.state.selectedPlaceId)) {
									this.setState({destinationId: item.id})
								}
							} }
							onMarkerClickHandler1={ (item) => {
								this.setState({selectedPlaceId: item.id})
							} }
						/>
					</div>
				</div>
				<SettingDialog
					isModal={ isModal }
					closeModal={ closeModal }
					isBusinessStatus={ false }
					isSlider={ false }
					isMultipleBusinessType={ true }
					businessType={ this.state.businessType }
					onSelectBusinessType={ this.onSelectBusinessType }
					onSave={ this.searchHandler }
				>
					<div>
						<Typography gutterBottom>Search Place</Typography>
						<LocationSearchInput
							listContainer={ {width: '100%'} }
							onSelectHandler={ (item) => {
								this.setState({mapCenter: item});
								navigateMap(this.mapRef, item);
							} }/>
					</div>
				</SettingDialog>
			</div>
		)
	}
}

export default withStyles(styles)(RealStateScreen)