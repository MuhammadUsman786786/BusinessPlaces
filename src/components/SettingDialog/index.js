import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import { BUSINESS_STATUS_LIST } from "../../utilities/Constants";
import Slider from '@material-ui/core/Slider';
import * as _ from 'lodash'


const AutocompleteSearch = (props) => {
	const { dataList, label, multiple } = props || {}
	const optionalParams = {}
	if (!props.multiple) {
		optionalParams['value'] = { title: props.value }
	} else {
		optionalParams['value'] = props.value || []
	}
	return (
		<Autocomplete
			multiple={props.multiple}
			{...optionalParams}
			id="combo-box-demo"
			options={dataList}
			getOptionLabel={(option) => option.title}
			renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
			onChange={(event, value) => {
				if (!multiple) {
					props.onSelect(value?.title)
				} else {
					props.onSelect(value)
				}
			}}
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
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
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
	const { isBusinessStatus = true, isBusinessType = true, isSlider = true, businessTypeOptions = [] } = props || {}
	return (
		<div>
			<Dialog
				onClose={props.closeModal}
				aria-labelledby="customized-dialog-title"
				open={props.isModal}
				fullWidth={true}
				maxWidth={'sm'}
				style={{ marginTop: '-15%' }}
			>
				<div>
					<DialogTitle id="customized-dialog-title" onClose={props.closeModal}>
						Set Search Parameters
					</DialogTitle>
					<DialogContent dividers>
						{props.children}
						{isBusinessStatus &&
							<div>
								<Typography gutterBottom>Business Status *</Typography>
								<AutocompleteSearch
									{...props}
									multiple={props.isMultipleBusinessStatus || false}
									dataList={BUSINESS_STATUS_LIST}
									label={'Business Status'}
									value={props.businessStatus}
									onSelect={props.onSelectBusinessStatus} />
							</div>}
						{
							isBusinessType &&
							<div>
								<Typography gutterBottom className='mt-3'>Business Type *</Typography>
								<AutocompleteSearch
									{...props}
									multiple={props.isMultipleBusinessType || false}
									dataList={businessTypeOptions}
									label={'Business Type'}
									value={props.businessType}
									onSelect={props.onSelectBusinessType} />
							</div>
						}
						{
							isSlider && <div>
								<Typography gutterBottom className='mt-4'
									style={{ marginBottom: -5 }}>Radius: {props.radius} m</Typography>
								<Slider
									value={props.radius}
									min={0}
									step={0.1}
									max={30000}
									onChange={props.onRadiusChanged}
								/>
							</div>
						}
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={props.closeModal} color="primary">
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
