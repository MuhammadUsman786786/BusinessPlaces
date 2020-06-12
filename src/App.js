import React, {useState} from 'react';
import LeftDrawer from "./components/LeftDrawer";
import HomeScreen from "./containers/HomeScreen";
import {BrowserRouter as Router} from "react-router-dom";
import RealStateScreen from "./containers/RealStateScreen";

const App = () => {
	const [ isModal, setModal ] = useState(false)
	const [ index, setTabIndex ] = useState(1)
	const openModal = () => setModal(true)
	const closeModal = () => setModal(false)
	return (
		<Router>
			<div>
				<div className="wrapper d-flex align-items-stretch h-100">
					<div>
						<LeftDrawer
							isModal={ isModal }
							openModal={ openModal }
							closeModall={ closeModal }
							currentIndex={ index }
							setTabIndex={ (newIndex) => setTabIndex(newIndex) }
						/>
					</div>
					<div id="content">
						{ index === 1 && <HomeScreen isModal={ isModal } openModal={ openModal } closeModal={ closeModal }/> }
						{ index === 2 && <RealStateScreen/> }
						{ index === 3 && <div>3</div> }
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
