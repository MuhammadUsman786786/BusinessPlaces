import React, {Component, createRef} from 'react'
import CustomMap from "../../components/GoogleMap";
import {API_RESPONSE, MAP_CENTER} from "../../utilities/Constants";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import {withStyles} from '@material-ui/core/styles';
import {LocationSearchInput, SettingDialog} from "../../components";
import {navigateMap} from "../../utilities/MapUtils";
import {toast} from "react-toastify";
import * as _ from 'lodash'


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
			dataList: API_RESPONSE.results,
			mapCenter: MAP_CENTER,
			businessType: '',
			businessStatus: '',
		};
		this.mapRef = null
	}
	
	onChange = ({target: {value} = {}}) => {
		console.log(value)
	};
	
	renderSearchInputField = () => {
		const {classes} = this.props;
		return <div>
			
			<Paper component="form" className={ classes.root }>
				<IconButton className={ classes.iconButton } aria-label="menu">
					<MenuIcon/>
				</IconButton>
				<InputBase
					className={ classes.input }
					placeholder="Search Google Maps"
					inputProps={ {'aria-label': 'search google maps'} }
					onChange={ this.onChange }
				/>
				<IconButton type="submit" className={ classes.iconButton } aria-label="search">
					<SearchIcon/>
				</IconButton>
			</Paper>
		</div>
	};
	
	onSelectBusinessType = (businessType) => {
		this.setState({businessType})
	};
	
	onSelectBusinessStatus = (businessStatus) => {
		this.setState({businessStatus})
	};
	
	searchHandler = () => {
		const {closeModal} = this.props;
		const {businessType, businessStatus} = this.state;
		if (_.isEmpty(businessStatus)) {
			return toast.error('Business Status is required')
		}
		if (_.isEmpty(businessType)) {
			return toast.error('Business Type is required')
		}
		toast.success('Make api call')
		closeModal()
	};
	
	render() {
		const {isModal, openModal, closeModal} = this.props;
		console.log(this.state);
		return (
			<div className='flex h-100 position-relative'>
				<CustomMap
					getMapRef={ (ref) => (this.mapRef = ref) }
					dataList={ this.state.dataList }/>
				<div className='position-absolute d-flex justify-content-center'
				     style={ {right: 0, left: 0, top: 10, zIndex: 999} }>
					<div className='row'>
						<div className='col-8 mt-5 mt-md-0'>
							<LocationSearchInput onSelectHandler={ (item) => {
								navigateMap(this.mapRef, item);
								this.setState({mapCenter: item})
							} }/>
						</div>
					</div>
				</div>
				<SettingDialog
					isModal={ isModal }
					openModal={ openModal }
					closeModal={ closeModal }
					onSelectBusinessStatus={ this.onSelectBusinessStatus }
					onSelectBusinessType={ this.onSelectBusinessType }
					onSave={ this.searchHandler }
				/>
			</div>
		)
	}
}

export default withStyles(styles)(HomeScreen)
