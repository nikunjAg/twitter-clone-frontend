import React from 'react';
import { withRouter } from 'react-router-dom';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import SearchIcon from '@material-ui/icons/Search';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import MoreHorizSharpIcon from '@material-ui/icons/MoreHorizSharp';

import classes from './Navigation.module.css';
import CustomNavLink from '../CustomNavLink/CustomNavLink';

const Navigation = (props) => {
	const scrollOnMatch = (pathname, event) => {
		event.stopPropagation();
		if (props.location.pathname === pathname && props.scrollHandler)
			props.scrollHandler();
	};

	return (
		<div className={classes.Navigation}>
			<CustomNavLink
				to="/home"
				exact
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<HomeOutlinedIcon className={classes.Icon} />
				<p>Home</p>
			</CustomNavLink>
			<CustomNavLink
				to="/search"
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<SearchIcon className={classes.Icon} />
				<p>Explore</p>
			</CustomNavLink>
			<CustomNavLink
				to="/notifications"
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<NotificationsOutlinedIcon className={classes.Icon} />
				<p>Notifications</p>
			</CustomNavLink>
			<CustomNavLink
				to="/messages"
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<EmailOutlinedIcon className={classes.Icon} />
				<p>Messages</p>
			</CustomNavLink>
			<CustomNavLink
				to="/bookmarks"
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<BookmarkBorderOutlinedIcon className={classes.Icon} />
				<p>Bookmarks</p>
			</CustomNavLink>
			<CustomNavLink
				to="/list"
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<ListAltRoundedIcon className={classes.Icon} />
				<p>List</p>
			</CustomNavLink>
			<CustomNavLink
				to={`/profile/${props.username}`}
				scrollHandler={scrollOnMatch}
				location={props.location}
			>
				<PersonOutlineOutlinedIcon className={classes.Icon} />
				<p>Profile</p>
			</CustomNavLink>
			{/* As we only want a dropdown here
					We don't need a link kind of a thing or scrollToTop
			*/}
			<div
				className={classes.FakeLink}
				onClick={props.onClickMore.bind(null, 'forNavigation')}
			>
				<MoreHorizSharpIcon className={classes.Icon} />
				<p>More</p>
				{props.dropdownFor === 'forNavigation' ? props.dropdown : null}
			</div>
		</div>
	);
};

export default withRouter(Navigation);
