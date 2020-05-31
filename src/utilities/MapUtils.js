import * as _ from "lodash";

export const navigateMap = (mapRef,placeItem) => {
	if (!mapRef || _.isEmpty(placeItem)) {
		return
	}
	const {latitude, longitude} = placeItem || {}
	mapRef.panTo(
		new window.google.maps.LatLng(latitude, longitude)
	);
}
