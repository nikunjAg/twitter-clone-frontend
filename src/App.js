import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreator from './store/actions';

import classes from './App.module.css';
import Home from './containers/Home/Home';
import Landing from './containers/Landing/Landing';
import Login from './containers/Auth/Login/Login';

class App extends Component {
	componentDidMount() {
		this.props.onTryAuthSignIn();
	}

	render() {
		let routes = (
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/" component={Landing} />
			</Switch>
		);

		if (this.props.isAuthenticated) {
			routes = <Route path="/" component={Home} />;
		}

		return <div className={classes.App}>{routes}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAuthSignIn: () => dispatch(actionCreator.authCheckState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
