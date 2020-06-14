import {PLACE_API_KEY} from "./Constants";

const googleMapBaseLink = 'https://www.google.com/maps/place/?q=place_id:'
export const generateGoogleMapPlaceLink = (placeId) => {
	let url = `${ googleMapBaseLink }${ placeId }`
	return url
}


export const getImageUriFromReference = (props) => {
	const {maxwidth, photoReference} = props || {}
	return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${ maxwidth }&photoreference=${ photoReference }&key=${ PLACE_API_KEY }`
}
