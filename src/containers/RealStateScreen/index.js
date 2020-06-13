import React, {Component} from 'react'
import CustomMap from "../../components/GoogleMap";
import {MAP_CENTER} from "../../utilities/Constants";
import {withStyles} from '@material-ui/core/styles';
import {LocationSearchInput, SettingDialog} from "../../components";
import {navigateMap} from "../../utilities/MapUtils";
import {toast} from "react-toastify";
import * as _ from 'lodash'
import {searchGoogleMapNearbyPlaces, searchGoogleMapNearbyPlacesWithPagination} from "../../utilities/ApiCaller";
import Typography from "@material-ui/core/Typography";


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

class RealStateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			mapCenter: MAP_CENTER,
			businessType: '',
			radius: 1500
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
			businessType=_.map(businessType,(item)=>item.title)
			const results = await searchGoogleMapNearbyPlaces({mapCenter, businessType, radius})
			this.setState({dataList:results})
		} catch (e) {
		}
	}
	
	searchHandler = () => {
		const {closeModal} = this.props;
		const {businessType } = this.state;
		if (_.isEmpty(businessType)) {
			return toast.error('Business Type is required')
		}
		this.setState({dataList: []});
		closeModal();
		this.fetchDataHandler()
	};
	
	render() {
		const {isModal, closeModal} = this.props;
		console.log(this.state)
		return (
			<div className='flex h-100 position-relative'>
				<div className='d-flex' style={{height:'70%'}}>
					<div style={{width:'20%'}}>
						image grid
					</div>
					<div  style={{width:'80%'}}>
						<CustomMap
							getMapRef={ (ref) => (this.mapRef = ref) }
							dataList={ this.state.dataList }
							radius={ this.state.radius }
							mapCenter={ this.state.mapCenter }
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
