import React from 'react'

const LeftDrawer = (props) => {
	const {currentIndex, setTabIndex} = props;
	return <nav id="sidebar">
		<div className="p-4">
			<h1><a className="logo">Portfolic <span>Portfolio Agency</span></a></h1>
			<ul className="list-unstyled components mb-5">
				<li className="active">
					<p style={ {cursor: 'pointer'} }
					   onClick={ () => {
						   // if (currentIndex === 1) {
						   setTabIndex(1)
						   props.openModal(1)
						   // }
					   } }>
						Home
					</p>
				</li>
				<li>
					<p style={ {cursor: 'pointer'} }
					   onClick={ () => {
						   setTabIndex(2)
						   props.openModal(2)
					   } }
					>
						About
					</p>
				</li>
				<li>
					<p style={ {cursor: 'pointer'} }
					   onClick={ () => {
						   setTabIndex(3)
						   props.openModal(3)
					   } }
					>Works</p>
				</li>
			</ul>
		</div>
	</nav>
};

export default LeftDrawer

LeftDrawer.propTypes = {};

LeftDrawer.defaultProps = {};
