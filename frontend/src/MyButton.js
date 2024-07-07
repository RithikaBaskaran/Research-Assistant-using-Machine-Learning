import "./css/NavBar.module.css";
import React, { Component }  from 'react';

const MyButton = ({ to }) => {

	return (
		<a href={`/${to}`}>
			<li className="my-button">
				<span>{to === '' ? "resources" : to}</span>
			</li>
		</a>
	)
}

export default MyButton;
