import './index.css'
import * as _ from 'lodash'
import React, {Component} from 'react'
import {toast} from "react-toastify";
import CustomMap from "../../components/GoogleMap";
import {withStyles} from '@material-ui/core/styles';
import {navigateMap} from "../../utilities/MapUtils";
import {MAP_CENTER} from "../../utilities/Constants";
import Typography from "@material-ui/core/Typography";
import {LocationSearchInput, SettingDialog} from "../../components";
import {getDirections, getPlaceDetails, searchGoogleMapNearbyPlaces} from "../../utilities/ApiCaller";
import ReviewsList from "../../components/ReviewList";
import Rating from "react-star-rating-component";
import {Link} from "react-router-dom";

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

const INITIAL_STATE = {
	selectedPlaceId: '',
	destinationId: '',
	directionsPath: [],
	destinationPlaceInfo: {},
	isDestinationPlaceInfo: false,
}

class RealStateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			dataList1: [],
			mapCenter: MAP_CENTER,
			// businessType: [ {title: 'bank'} ],
			businessType: [],
			radius: 1500,
			...INITIAL_STATE
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
			this.props.setImagesList([ ...selectedPlaces, ...hostelsList ])
			this.setState({dataList: selectedPlaces, dataList1: hostelsList,})
		} catch (e) {
		}
	};
	
	searchHandler = () => {
		const {closeModal, setHoverPlaceId} = this.props;
		const {businessType} = this.state;
		if (_.isEmpty(businessType)) {
			return toast.error('Business Type is required')
		}
		this.setState({
			dataList: [],
			dataList1: [],
			...INITIAL_STATE
		});
		closeModal();
		this.props.setImagesList([])
		setHoverPlaceId('')
		this.fetchDataHandler()
	};
	
	getDirectionsList = () => {
		const {dataList, dataList1, selectedPlaceId, destinationId} = this.state;
		if (_.isEmpty(selectedPlaceId) || _.isEmpty(destinationId)) {
			return []
		}
		const directionsPointList = [];
		const mergedDataMap = _.keyBy([ ...dataList, ...dataList1 ], 'place_id');
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
	
	getDirectionsHandler = async () => {
		const {destinationId} = this.state
		const directionsPath = await getDirections(this.getDirectionsList())
		let destinationPlaceInfo = {}
		if (!_.isEmpty(destinationId)) {
			destinationPlaceInfo = await getPlaceDetails({mapCenter: this.state.mapCenter, placeId: destinationId})
		}
		this.setState({directionsPath, destinationPlaceInfo, isDestinationPlaceInfo: true})
	}
	
	componentWillUnmount() {
		this.props.setImagesList([])
	}
	
	renderPlaceInfo = () => {
		const {destinationPlaceInfo = {}} = this.state
		const {
			formatted_address,
			name,
			rating,
			photos,
			reviews,
			url,
			types = []
		} = destinationPlaceInfo || {}
		return <div style={ {width: '25%', height: '517px', overflow: 'scroll'} } className='px-1'>
			<button
				onClick={ () => {
					this.setState({isDestinationPlaceInfo: false})
				} }
				className='btn btn-outline-info btn-sm mb-2 mt-2'>
				{ `< Back` }
			</button>
			{ !_.isEmpty(destinationPlaceInfo) && <div>
				<Link to={ {pathname: url} } target="_blank">
					<p className='font-weight-bold text-dark'>{ name }</p>
					<p className='font-weight-bold text-dark' style={ {marginTop: -20} }>{ (types || [])[0] }</p>
					<p className='text-dark' style={ {marginTop: -20} }>{ formatted_address }</p>
				</Link>
				<div className='d-flex'>
					<span className='d-inline-block mr-2'>{ rating }</span>
					<Rating value={ rating } editing={ false }/>
					<span className='d-inline-block ml-2'>({ _.size(reviews) })</span>
				</div>
				<div className='d-flex flex-wrap'>
					{ _.map(photos, (item) => {
						const imageUrl = typeof item.getUrl === "function" ? item.getUrl() : ''
						return <div style={ {width: '48%', height: 100, marginLeft: '2%'} } className='mb-1'>
							<img src={ imageUrl } style={ {width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4} }/>
						</div>
					}) }
				</div>
				<ReviewsList reviews={ reviews }/>
			</div>
			}
		</div>
	}
	
	renderHeader = () => {
		return <div className='w-100 h-100 pl-3 pt-2'>
			<p className='custom-text-blue font-weight-bold' style={ {marginBottom: 0} }>info is here</p>
			<div className='d-flex w-100' style={ {height: '70%'} }>
				<div style={ {width: 300, height: '100%'} } className='mb-1'>
					<img src={ require('../../images/defaultHotel.jpeg') }
					     style={ {width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4} }/>
				</div>
				<div className='d-flex justify-content-between w-100 px-3'>
					<div className='flex-grow-1'>
						<p className='text-dark font-weight-bold' style={ {marginBottom: 0} }>Single family home</p>
						<h4 className='custom-text-blue font-weight-bold' style={ {marginBottom: 0} }>Dark Avenue</h4>
						<p className='text-dark font-weight-bold' style={ {marginBottom: 0} }>South River City Austin</p>
						<div className='w-50 my-2' style={{backgroundColor:'rgba(0,0,0,0.11)',height:1}}/>
						<div className='d-flex'>
							<div className='d-flex align-items-center'>
								<img src={ require('../../images/bedIcon.png') } style={ {width: 20, height: 20, objectFit: 'contain', borderRadius: 4} }/>
								<p className='text-dark ml-2 mb-0'>4 Beds</p>
							</div>
							<div className='d-flex align-items-center ml-4'>
								<img src={ require('../../images/bathIcon.png') } style={ {width: 20, height: 20, objectFit: 'contain', borderRadius: 4} }/>
								<p className='text-dark ml-2 mb-0'>4 Baths</p>
							</div>
							<div className='d-flex align-items-center ml-4'>
								<img src={ require('../../images/areaIcon.png') } style={ {width: 20, height: 20, objectFit: 'contain', borderRadius: 4} }/>
								<p className='text-dark ml-2 mb-0'>2472 Sqft</p>
							</div>
						</div>
						<h4 className='custom-text-blue font-weight-bold' style={ {marginBottom: 0} }>$879,500</h4>
					</div>
					<div>
						<div className='d-flex mb-2'>
							<button className='btn btn-sm  btn-outline-info ml-2 py-3 px-3 custom-text-blue custom-border-blue '>Mon</button>
							<button className='btn btn-sm btn-outline-info ml-2 py-3 px-3 custom-text-blue custom-border-blue '>Tue</button>
							<button className='btn btn-sm btn-outline-info ml-2 py-3 px-3 custom-text-blue custom-border-blue '>Wed</button>
						</div>
						<div className='d-flex justify-content-center'>
							<button className='btn btn-info custom-btn-blue'>Schedule Call</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
	
	render() {
		const {isModal, closeModal} = this.props;
		const {isDestinationPlaceInfo} = this.state
		return (
			<div className='flex h-100 position-relative'>
				<div className='' style={ {height: '30%'} }>
					{ this.renderHeader() }
				</div>
				<div className='d-flex' style={ {height: '70%'} }>
					{ isDestinationPlaceInfo && this.renderPlaceInfo() }
					<div style={ {width: isDestinationPlaceInfo ? '75%' : '100%'} }>
						<CustomMap
							getMapRef={ (ref) => (this.mapRef = ref) }
							dataList={ this.state.dataList }
							dataList1={ this.state.dataList1 }
							radius={ this.state.radius }
							mapCenter={ this.state.mapCenter }
							hoverPlaceId={ this.props.hoverPlaceId }
							selectedPlaceId={ this.state.selectedPlaceId }
							directionsPath={ this.state.directionsPath }
							onMarkerClickHandler={ (item) => {
								if (!_.isEmpty(this.state.selectedPlaceId)) {
									this.setState({destinationId: item.place_id}, this.getDirectionsHandler)
								}
							} }
							onMarkerClickHandler1={ (item) => {
								const {destinationId} = this.state
								this.setState({selectedPlaceId: item.place_id}, () => {
									if (!_.isEmpty(destinationId)) {
										this.getDirectionsHandler()
									}
								})
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
