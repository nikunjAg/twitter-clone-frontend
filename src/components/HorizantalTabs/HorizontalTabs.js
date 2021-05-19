import React from 'react';

import classes from './HorizontalTabs.module.css';

const HorizontalTabs = (props) => {
	return (
		<div className={classes.HorizontalTabs}>
			{props.tabs.map((t, i) => (
				<div
					key={i}
					className={
						classes.Tab +
						' ' +
						(props.selected?.toLowerCase() === t.name.toLowerCase()
							? classes.Selected
							: '')
					}
					onClick={props.onTabSelected.bind(null, t.name)}
				>
					{t.name}
				</div>
			))}
		</div>
	);
};

export default HorizontalTabs;
