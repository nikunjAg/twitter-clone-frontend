import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './CustomNavLink.module.css';
// Do act as a NavLink when it is supposed to change the url
// But act as a scrollToTop button if the link is already matched with the link in url
const CustomNavLink = (props) => {
	let content = (
		<NavLink to={props.to} exact={props.exact}>
			{props.children}
		</NavLink>
	);

	if (props.location.pathname === props.to) {
		content = (
			<div
				onClick={props.scrollHandler.bind(null, props.to)}
				className={classes.FakeLink}
			>
				{props.children}
			</div>
		);
	}

	// Custom logic for adding active class to CustomNavLink
	const isActive = props.exact
		? props.location.pathname === props.to
		: props.location.pathname.startsWith(props.to);

	const customClassList = [
		classes.CustomNavLink,
		isActive ? classes.Active : '',
	].join(' ');

	return <div className={customClassList}>{content}</div>;
};

export default CustomNavLink;
