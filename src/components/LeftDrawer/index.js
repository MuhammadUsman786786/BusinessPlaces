import React from 'react'

const LeftDrawer = (props) => {
  const { name } = props
  return <nav id="sidebar">
	  <div className="custom-menu">
	  </div>
	  <div className="p-4">
		  <h1><a  className="logo">Portfolic <span>Portfolio Agency</span></a></h1>
		  <ul className="list-unstyled components mb-5">
			  <li className="active">
				  <p style={{cursor:'pointer'}} onClick={()=>props.openModal(true)}><span className="fa fa-home"/> Home</p>
			  </li>
			  <li>
				  <p style={{cursor:'pointer'}}><span className="fa fa-user"/> About</p>
			  </li>
			  <li>
				  <p style={{cursor:'pointer'}}><span className="fa fa-briefcase"/> Works</p>
			  </li>
			  <li>
				  <p style={{cursor:'pointer'}}><span className="fa fa-sticky-note"/> Blog</p>
			  </li>
			  <li>
				  <p style={{cursor:'pointer'}}><span className="fa fa-suitcase"/> Gallery</p>
			  </li>
		  </ul>
		
		  <div className="mb-5">
			  <h3 className="h6 mb-3">Subscribe for newsletter</h3>
			  <form action="#" className="subscribe-form">
				  <div className="form-group d-flex">
					  <div className="icon"><span className="icon-paper-plane"/></div>
					  <input type="text" className="form-control" placeholder="Enter Email Address"/>
				  </div>
			  </form>
		  </div>
		
		  <div className="footer">
			  <p>
				  Copyright &copy;
				  <script>document.write(new Date().getFullYear());</script>
				  All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"/> by <a
				  href="https://colorlib.com" target="_blank">Colorlib.com</a>
			  </p>
		  </div>
	
	  </div>
  </nav>
}

export default LeftDrawer

LeftDrawer.propTypes = {
}

LeftDrawer.defaultProps = {}
