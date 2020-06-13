import {PLACE_API_KEY} from "./Constants";

let url = 'https://maps.googleapis.com/maps/api/place/photo';
const googleMapBaseLink='https://www.google.com/maps/place/?q=place_id:'
export const buildImageUrl=(reference,maxwidth)=>{
	return `${url}?maxwidth=${maxwidth}&photoreference=${reference}&key=${PLACE_API_KEY}`
}

export const generateGoogleMapPlaceLink=(placeId)=>{
	return `${googleMapBaseLink}${placeId}`
}
