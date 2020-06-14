import React, {useState} from 'react';
import LeftDrawer from "./components/LeftDrawer";
import HomeScreen from "./containers/HomeScreen";
import {BrowserRouter as Router} from "react-router-dom";
import RealStateScreen from "./containers/RealStateScreen";
import * as _ from "lodash";


const App = () => {
	const [ modalIndex, setModal ] = useState(-1)
	const [ index, setTabIndex ] = useState(1)
	const [ hoverPlaceId, setHoverPlaceId ] = useState(1)
	const [ imagesList, setImagesList ] = useState([])
	const closeModal = () => setModal(-1)
	return (
		<Router>
			<div>
				<div className="wrapper d-flex align-items-stretch h-100">
					<LeftDrawer
						openModal={ (index) => setModal(index) }
						closeModall={ closeModal }
						currentIndex={ index }
						imagesList={ imagesList }
						hoverPlaceId={ hoverPlaceId }
						setHoverPlaceId={ setHoverPlaceId }
						setTabIndex={ (newIndex) => setTabIndex(newIndex) }
					/>
					<div id="content">
						{ index === 1 && <HomeScreen isModal={ modalIndex === 1 } closeModal={ closeModal }/> }
						{ index === 2 &&
						<RealStateScreen
							isModal={ modalIndex === 2 }
							closeModal={ closeModal }
							setImagesList={ setImagesList }
							hoverPlaceId={ hoverPlaceId }
							setHoverPlaceId={ setHoverPlaceId }
						/> }
						{ index === 3 && <div>3</div> }
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
