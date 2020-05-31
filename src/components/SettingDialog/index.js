import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {BUSINESS_STATUS_LIST, PLACE_TYPES_LIST} from "../../utilities/Constants";

const AutocompleteSearch = (props) => {
	const {dataList, label} = props || {}
	return (
		<Autocomplete
			id="combo-box-demo"
			options={ dataList }
			getOptionLabel={ (option) => option.title }
			renderInput={ (params) => <TextField { ...params } label={ label } variant="outlined"/> }
			onSelect={ (event = {}) => {
				const {target = {}} = event || {}
				const {value} = target || {}
				props.onSelect(value)
			} }
		/>
	);
}

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const {children, classes, onClose, ...other} = props;
	return (
		<MuiDialogTitle disableTypography className={ classes.root } { ...other }>
			<Typography variant="h6">{ children }</Typography>
			{ onClose ? (
				<IconButton aria-label="close" className={ classes.closeButton } onClick={ onClose }>
					<CloseIcon/>
				</IconButton>
			) : null }
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(MuiDialogActions);

const SettingDialog = (props) => {
	return (
		<div>
			<Dialog
				onClose={ props.closeModal }
				aria-labelledby="customized-dialog-title"
				open={ props.isModal }
				fullWidth={ true }
				maxWidth={ 'sm' }
				style={{marginTop:'-15%'}}
			>
				<div>
					<DialogTitle id="customized-dialog-title" onClose={ props.closeModal }>
						Set Search Parameters
					</DialogTitle>
					<DialogContent dividers>
						<Typography gutterBottom>Business Status *</Typography>
						<AutocompleteSearch
							{ ...props }
							dataList={ BUSINESS_STATUS_LIST }
							label={ 'Business Status' }
							onSelect={ props.onSelectBusinessStatus }/>
						<Typography gutterBottom className='mt-3'>Business Type *</Typography>
						<AutocompleteSearch
							{ ...props }
							dataList={ PLACE_TYPES_LIST }
							label={ 'Business Type' }
							onSelect={ props.onSelectBusinessType }/>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={ props.closeModal} color="primary">
							Cancel
						</Button>
						<Button onClick={props.onSave} color="primary" autoFocus>
							Save
						</Button>
					</DialogActions>
				</div>
			</Dialog>
		</div>
	);
}

export default SettingDialog
