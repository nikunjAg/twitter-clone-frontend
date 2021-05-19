import React from 'react';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import classes from './SearchBar.module.css';

const SearchBar = (props) => {
	let timerId = null;

	const onKeyDownHandler = (event) => {
		event.stopPropagation();

		const targetInput = event.target;

		clearTimeout(timerId);

		timerId = setTimeout(() => {
			props.onSearch(targetInput.value.trim());
		}, 1000);
	};

	return (
		<div className={classes.SearchBar}>
			<SearchOutlinedIcon className={classes.Icon} />
			<input
				type="text"
				name="searchInput"
				placeholder={props.searchPlaceholder}
				onKeyDown={onKeyDownHandler}
				tabIndex={0}
			/>
		</div>
	);
};

export default SearchBar;
