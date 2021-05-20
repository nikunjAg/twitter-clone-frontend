import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import FlareIcon from '@material-ui/icons/Flare';
import { connect } from 'react-redux';

import classes from './Home.module.css';
import SideBar from '../SideBar/SideBar';
import Feed from '../Feed/Feed';
import * as actionCreator from '../../store/actions/index';
import NewPost from '../NewPost/NewPost';
import CompletePost from '../Post/CompletePost/CompletePost';
import Login from '../Auth/Login/Login';
import Landing from '../Landing/Landing';
import Profile from '../Profile/Profile';
import Search from '../Search/Search';
import Bookmark from '../Bookmarks/Bookmark';

class Home extends Component {
	state = {
		posts: [],
	};

	componentDidMount() {
		this.props.onFetchFeed(this.props.token);
		this.myRef = React.createRef();
	}

	windowScrollToTop = (event) => {
		if (event) event.stopPropagation();
		if (this.myRef?.current)
			this.myRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	render() {
		return (
			<div className={classes.Home}>
				<div className="SidebarWrapper" style={{ zIndex: 6 }}>
					<SideBar scrollHandler={this.windowScrollToTop} />
				</div>
				<div className={classes.MainHome} ref={this.myRef}>
					<div className={classes.HomeHeader}>
						<h3 onClick={this.windowScrollToTop}>Home</h3>
						<FlareIcon className={classes.TopTweets} />
					</div>

					<NewPost
						onPost={(content, images) =>
							this.props.createPostHandler(content, images, this.props.token)
						}
						style={{ noBorder: true }}
					/>

					<Feed
						posts={this.props.posts}
						loading={this.props.loadingFeed}
						currentUser={this.props.userId}
					/>
				</div>
				<div className="Recommendations"></div>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Landing} />
					<Route path="/profile/:username" component={Profile} />
					<Route path="/search" component={Search} />
					<Route path="/bookmarks" component={Bookmark} />
					<Route path="/post/:postId" component={CompletePost} />
					<Redirect to="/home" />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		posts: state.posts.posts,
		loadingFeed: state.posts.loading,
		fetchingFeedError: state.posts.error,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchFeed: (token) => dispatch(actionCreator.fetchFeed(token)),
		createPostHandler: (postData, images, token) =>
			dispatch(actionCreator.createPost(postData, images, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
