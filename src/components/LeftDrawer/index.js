import React from 'react'
import './index.css'
import * as _ from "lodash";

const ImageGrid = (props) => {
	const {imagesList} = props || {}
	if (_.isEmpty(imagesList)) {
		return null
	}
	return <div className='d-flex flex-wrap' style={ {height: 'calc(100vh - 235px)', overflow: 'scroll',marginRight:4} }>
		{ _.map(imagesList, (item) => {
			const {photos} = item || {};
			// eslint-disable-next-line no-unused-vars
			let imageUrl = null;
			if (typeof _.get(photos, '[0].getUrl') === "function") {
				imageUrl = photos[0].getUrl()
			}
			return <div
				id={item.id}
				className='image-style'
				onMouseOver={ () => {
					const {setHoverPlaceId=()=>{}}=props||{}
					setHoverPlaceId(item.place_id)
				} }
				onMouseLeave={ () => {
					const {setHoverPlaceId=()=>{}}=props||{}
					setHoverPlaceId('')
				} }
			>
				<img
					style={ {width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4} }
					src={ imageUrl }/>
			</div>
		})
		}
	</div>
}
const LeftDrawer = (props) => {
	const {currentIndex, setTabIndex} = props;
	return <nav id="sidebar">
		<div className="">
			<h1 className='pl-4'>
				<a className="logo">Portfolic <span>Portfolio Agency</span></a>
			</h1>
			<ul className="list-unstyled components">
				<li className={ currentIndex === 1 ? 'active-tab-style px-4 py-2' : 'px-4 py-2' }>
					<p style={ {cursor: 'pointer', marginBottom: 0} }
					   onClick={ () => {
						   // if (currentIndex === 1) {
						   setTabIndex(1)
						   props.openModal(1)
						   // }
					   } }>
						Home
					</p>
				</li>
				<li className={ currentIndex === 2 ? 'active-tab-style px-4 py-2' : 'px-4 py-2' }>
					<p style={ {cursor: 'pointer', marginBottom: 0} }
					   onClick={ () => {
						   setTabIndex(2)
						   props.openModal(2)
					   } }
					>
						About
					</p>
				</li>
				<li className={ currentIndex === 3 ? 'active-tab-style px-4 py-2' : 'px-4 py-2' }>
					<p style={ {cursor: 'pointer', marginBottom: 0} }
					   onClick={ () => {
						   setTabIndex(3)
						   props.openModal(3)
					   } }
					>Works</p>
				</li>
			</ul>
			<ImageGrid { ...props } />
		</div>
	</nav>
};

export default LeftDrawer

LeftDrawer.propTypes = {};

LeftDrawer.defaultProps = {};
