import React from 'react'
import * as _ from "lodash";
import Rating from 'react-star-rating-component';
import {generateGoogleMapPlaceLink} from "../../utilities/Transform";
import {Link} from "react-router-dom";


const ReviewsList = (props) => {
	const {reviews = []} = props;
	return <div>
		{ _.map(reviews, (item) => {
			const {
				author_name,
				author_url,
				language,
				profile_photo_url,
				rating,
				relative_time_description,
				text,
				time,
			} = item || {}
			return <div style={ {marginTop: 15} }>
				<div className='d-flex align-content-center' style={ {marginBottom: -10} }>
					<div style={ {width: 30, height: 30} }>
						<Link to={ {pathname: author_url} } target="_blank">
							<img
								src={ profile_photo_url }
								className='w-100 h-100'
								style={ {objectFit: 'cover', borderRadius: 4} }/>
						</Link>
					</div>
					<Link to={ {pathname: author_url} } target="_blank">
						<p className='pl-2 text-dark'>{ author_name }</p>
					</Link>
				</div>
				<div className='d-flex' style={ {marginTop: 0} }>
					<Rating value={ rating } editing={false}/>
					<p className='pl-2 text-dark'>{ relative_time_description }</p>
				</div>
				<p className='text-dark' style={ {marginTop: -20} }>
					{ text }
				</p>
			</div>
		}) }
	</div>
};

export default ReviewsList

ReviewsList.propTypes = {};

ReviewsList.defaultProps = {};
