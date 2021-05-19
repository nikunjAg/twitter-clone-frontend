import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import TwitterIcon from '@material-ui/icons/Twitter';

import classes from './Landing.module.css';
import Button from '../../components/Button/Button';
import SignUp from '../Auth/SignUp/SignUp';
// import Spinner from '../../components/Spinner/Spinner';

class Landing extends Component {
	signUpBtnHandler = () => {
		this.props.history.push('/signup');
	};

	loginBtnHandler = () => {
		this.props.history.push('/login');
	};

	render() {
		let redirection = null;
		let spinner = null;

		if (this.props.isAuthenticated) redirection = <Redirect to="/home" />;

		if (this.props.loading && this.props.location.pathname !== '/signup')
			spinner = (
				<div className={classes.FullSpinner}>
					<TwitterIcon className={classes.Icon} />
				</div>
			);

		return (
			<div className={classes.Landing}>
				{redirection}
				{spinner}
				<div className={classes.LandingRow1}>
					<div className={classes.SideImage}>
						<img
							className={classes.HeroImg}
							src="https://abs.twimg.com/sticky/illustrations/lohp_en_850x623.png"
							alt="Landing Twitter"
						/>
						<TwitterIcon className={classes.SideTwitterIcon} />
					</div>
					<div className={classes.WhatsHappenning}>
						<TwitterIcon className={classes.Icon} />
						<h1>Happening now</h1>
						<h3>Join Twitter today.</h3>
						<div className={classes.ActionButtons}>
							<Button width={80} btnBlock onClick={this.signUpBtnHandler}>
								Sign up
							</Button>
							<Button
								width={80}
								btnBlock
								sty="Outline"
								onClick={this.loginBtnHandler}
							>
								Log in
							</Button>
						</div>
					</div>
				</div>
				<div className={classes.LandingRow2}>
					<div className={classes.FooterLinks}>
						<Link to="/">About</Link>
						<Link to="/">Help Center</Link>
						<Link to="/">Terms of Service</Link>
						<Link to="/">Privacy Policy</Link>
						<Link to="/">Cookie Policy</Link>
						<Link to="/">Ads Info</Link>
						<Link to="/">Blog</Link>
						<Link to="/">Status</Link>
						<Link to="/">Carrers</Link>
						<Link to="/">Brand Resources</Link>
						<Link to="/">Advertising</Link>
						<Link to="/">Marketing</Link>
						<Link to="/">Twitter for Business</Link>
						<Link to="/">Developers</Link>
						<Link to="/">Directory</Link>
						<Link to="/">Settings</Link>
					</div>
					<p>© 2021 Twitter, Inc.</p>
				</div>
				<Route path="/signup" component={SignUp} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
		loading: state.auth.loading,
	};
};

export default connect(mapStateToProps)(Landing);
