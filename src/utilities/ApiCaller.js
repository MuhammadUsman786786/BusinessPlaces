/* eslint-disable no-undef */
import {toast} from "react-toastify";

export const searchGoogleMapNearbyPlaces = (props) => {
	const {mapCenter, businessType, businessStatus, radius, successHandler} = props || {}
	const location = {lat: mapCenter.lat, lng: mapCenter.lng};
	const map = new google.maps.Map(document.getElementById('map'), {center: location, zoom: 17});
	const service = new google.maps.places.PlacesService(map);
	let showMessage = true;
	
	
	console.log({location, radius, type:[businessType]})
	service.nearbySearch(
		{location, radius, type:[businessType],keyword:businessType},
		function (results, status, pagination) {
			if (status === 'ZERO_RESULTS') {
				showMessage = false
				return toast.info('No result is found')
			}
			if (status !== 'OK') {
				showMessage = false
				return toast.error('Error is found')
			}
			
			const filteredResults = _.filter(results, item => item.business_status === businessStatus)
			
			if (pagination.hasNextPage) {
				pagination.nextPage();
			}
			successHandler(filteredResults,pagination.hasNextPage)
		});
}

