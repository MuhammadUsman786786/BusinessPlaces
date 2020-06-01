import React, {useState} from 'react';
import LeftDrawer from "./components/LeftDrawer";
import HomeScreen from "./containers/HomeScreen";
import {BrowserRouter as Router} from "react-router-dom";

const App=()=> {
	const [isModal,setModal]=useState(false)
	const openModal=()=>setModal(true)
	const closeModal=()=>setModal(false)
	return (
		<Router>
			<div>
				<div className="wrapper d-flex align-items-stretch">
					<LeftDrawer isModal={isModal} openModal={openModal} closeModall={closeModal}/>
					<div id="content">
						<HomeScreen isModal={isModal} openModal={openModal} closeModal={closeModal}/>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
