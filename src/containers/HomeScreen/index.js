import React, {Component} from 'react'
import CustomMap from "../../components/GoogleMap";
import {API_RESPONSE, MAP_CENTER} from "../../utilities/Constants";
import {withStyles} from '@material-ui/core/styles';
import {LocationSearchInput, SettingDialog} from "../../components";
import {navigateMap} from "../../utilities/MapUtils";
import {toast} from "react-toastify";
import * as _ from 'lodash'
import {searchGoogleMapNearbyPlacesWithPagination} from "../../utilities/ApiCaller";


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

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: API_RESPONSE,
			mapCenter: MAP_CENTER,
			businessStatus: '',
			businessType: '',
			radius: 1500
		};
		this.mapRef = null
	}
	
	onChange = ({target: {value} = {}}) => {
	};
	
	onSelectBusinessType = (businessType) => {
		this.setState({businessType})
	};
	
	onSelectBusinessStatus = (businessStatus) => {
		this.setState({businessStatus})
	};
	
	searchHandler = async () => {
		const {closeModal} = this.props;
		const {mapCenter, businessType, businessStatus, radius} = this.state;
		if (_.isEmpty(businessStatus)) {
			return toast.error('Business Status is required')
		}
		if (_.isEmpty(businessType)) {
			return toast.error('Business Type is required')
		}
		this.setState({dataList: []});
		closeModal();
		searchGoogleMapNearbyPlacesWithPagination({
			mapCenter, businessType, businessStatus, radius,
			successHandler: this.successHandler
		})
	};
	
	successHandler = (updatedList = [], isNext) => {
		const {dataList = []} = this.state;
		const updatedStateList = [ ...dataList, ...updatedList ];
		if (_.isEmpty(updatedStateList) && isNext === false) {
			toast.error('No result is found')
		}
		this.setState({dataList: updatedStateList})
	};
	
	onRadiusChanged = (_, radius) => {
		this.setState({radius: parseInt(radius)})
	};
	
	render() {
		const {isModal, closeModal} = this.props;
		return (
			<div className='flex h-100 position-relative'>
				<CustomMap
					getMapRef={ (ref) => (this.mapRef = ref) }
					dataList={ this.state.dataList }
					radius={ this.state.radius }
					mapCenter={ this.state.mapCenter }
					isCircle
					isMarkerInfoWindowAllowed={true}
				/>
				<div className='position-absolute d-flex justify-content-center'
				     style={ {right: 0, left: 0, top: 10, zIndex: 999} }>
					<div className='row'>
						<div className='col-8 mt-5 mt-md-0'>
							<LocationSearchInput onSelectHandler={ (item) => {
								this.setState({mapCenter: item});
								navigateMap(this.mapRef, item);
							} }/>
						</div>
					</div>
				</div>
				<SettingDialog
					isModal={ isModal }
					closeModal={ closeModal }
					businessType={ this.state.businessType }
					businessStatus={ this.state.businessStatus }
					onSelectBusinessStatus={ this.onSelectBusinessStatus }
					onSelectBusinessType={ this.onSelectBusinessType }
					onSave={ this.searchHandler }
					radius={ this.state.radius }
					onRadiusChanged={ this.onRadiusChanged }
				/>
			</div>
		)
	}
}

export default withStyles(styles)(HomeScreen)
