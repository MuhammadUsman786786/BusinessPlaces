const googleMapBaseLink = 'https://www.google.com/maps/place/?q=place_id:'
export const generateGoogleMapPlaceLink = (placeId) => {
	let url= `${ googleMapBaseLink }${ placeId }`
	return url
}
