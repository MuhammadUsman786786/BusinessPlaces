/* eslint-disable no-undef */
import {toast} from "react-toastify";

export const searchGoogleMapNearbyPlacesWithPagination = (props) => {
	const {mapCenter, businessType, businessStatus, radius, successHandler} = props || {}
	const location = {lat: mapCenter.lat, lng: mapCenter.lng};
	const map = new google.maps.Map(document.getElementById('map'), {center: location, zoom: 17});
	const service = new google.maps.places.PlacesService(map);
	let showMessage = true;
	service.nearbySearch(
		{location, radius, keyword: businessType},
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
			successHandler(filteredResults, pagination.hasNextPage)
		});
}

export const searchGoogleMapNearbyPlaces = (props) => new Promise((resolve, reject) => {
	const {mapCenter, businessType, radius} = props || {}
	const location = {lat: mapCenter.lat, lng: mapCenter.lng};
	const map = new google.maps.Map(document.getElementById('map'), {center: location, zoom: 17});
	const service = new google.maps.places.PlacesService(map);
	const type = _.isString(businessType) ? [ businessType ] : businessType
	service.nearbySearch(
		{location, radius, type},
		function (results, status, pagination) {
			if (status === 'ZERO_RESULTS') {
				toast.info('No result is found')
				return reject()
			}
			if (status !== 'OK') {
				toast.error('Error is found')
				return reject()
			}
			return resolve(results)
		});
});

export const getDirections = (places) => new Promise((resolve, reject) => {
	if (_.size(places < 2)) {
		resolve([])
	}
	const waypoints = places.map(p => ({
		location: {lat: p.lat, lng: p.lng},
	}));
	const origin = waypoints.shift().location;
	const destination = waypoints.pop().location;
	const directionsService = new google.maps.DirectionsService();
	directionsService.route(
		{
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.WALKING,
			waypoints: waypoints,
			optimizeWaypoints: true,
		},
		(result, status) => {
			if (status === google.maps.DirectionsStatus.OK) {
				return resolve(result)
			}
			resolve([])
		}
	);
})

export const getPlaceDetails = (props) => new Promise((resolve, reject) => {
	
	const {mapCenter, placeId} = props || {}
	const location = {lat: mapCenter.lat, lng: mapCenter.lng};
	const map = new google.maps.Map(document.getElementById('map'), {
		center: location,
		zoom: 15
	});
	const request = {
		placeId: placeId,
		// fields: [
		// 	'name',
		// 	'formatted_address',
		// 	'place_id',
		// 	'price_level',
		// 	'rating',
		// 	'review',
		// 	'user_ratings_total'
		// ]
	};
	const service = new google.maps.places.PlacesService(map);
	service.getDetails(request, function (place, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			resolve(place)
		}
		resolve({})
	});
})
