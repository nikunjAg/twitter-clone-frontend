import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import classes from './Search.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import HorizontalTabs from '../../components/HorizantalTabs/HorizontalTabs';
import * as actionCreator from '../../store/actions';
import User from '../../components/User/User';
import Post from '../Post/Post';
import ReplyPost from '../Post/ReplyPost';
import CompletePost from '../Post/CompletePost/CompletePost';
import SideBar from '../SideBar/SideBar';

class Search extends Component {
	state = {
		tabSelected: '',
		searchResults: (
			<div className={classes.TrySearching}>
				<h3>Try searching for people, topics, or keywords</h3>
				<p>When you do, they’ll show up here.</p>
			</div>
		),
	};

	componentDidMount() {
		// We need to decide here what shoud be the starting selected tab
		this.myRef = React.createRef();

		if (this.props.match.isExact) {
			this.setState({ tabSelected: 'Posts' });
		} else {
			const currPath = this.props.location.pathname;
			const tabName = currPath.split('/').slice(-1)[0];
			const tabSelected = tabName[0].toUpperCase() + tabName.slice(1);
			this.setState({ tabSelected: tabSelected });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.props.users !== prevProps.users ||
			this.props.posts !== prevProps.posts ||
			this.props.following !== prevProps.following
		) {
			const updatedSearchResult =
				this.state.tabSelected === 'Posts'
					? this.props.posts.map((post) => {
							return !post.replyTo ? (
								// Normal Post or Retweet Post
								<Post
									key={post._id}
									post={post}
									isVerified
									style={{ noBorderLeft: true, noBorderRight: true }}
								/>
							) : (
								// Reply Post
								<ReplyPost
									key={post._id + post.replyTo?._id}
									isVerified
									post={post}
									style={{ noBorderLeft: true, noBorderRight: true }}
								/>
							);
					  })
					: this.props.users.map((u) => (
							<User
								key={u._id}
								user={u}
								currUserId={this.props.userId}
								followingList={this.props.following}
								toggleFollow={this.props.toggleFollowUser.bind(
									null,
									u._id,
									this.props.token
								)}
							/>
					  ));
			this.setState({
				searchResults:
					updatedSearchResult.length === 0 ? (
						<div className={classes.NoResults}>
							<h3>No Results found</h3>
							<p>Try Searching something different</p>
						</div>
					) : (
						updatedSearchResult
					),
			});
		}
	}

	tabSwitchedHandler = (tabName, event) => {
		event.stopPropagation();
		if (this.state.tabSelected === tabName) return;
		this.setState({
			tabSelected: tabName,
			searchResults: (
				<div className={classes.TrySearching}>
					<h3>Try searching for people, topics, or keywords</h3>
					<p>When you do, they’ll show up here.</p>
				</div>
			),
		});
		const endPoint = tabName.toLowerCase();
		this.props.history.push(this.props.match.url + '/' + endPoint);
	};

	windowScrollToTop = (event) => {
		if (event) event.stopPropagation();

		if (this.myRef?.current) {
			this.myRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	goBack = (event) => {
		event.stopPropagation();
		this.props.history.goBack();
	};

	onSearchHandler = (searchString) => {
		if (searchString.length === 0) {
			this.setState({
				searchResults: (
					<div className={classes.TrySearching}>
						<h3>Try searching for people, topics, or keywords</h3>
						<p>When you do, they’ll show up here.</p>
					</div>
				),
			});
		} else {
			// Try searching the result for query string
			this.props.searchString(
				searchString,
				this.state.tabSelected,
				this.props.token
			);
		}
	};

	render() {
		return (
			<div className={classes.Search}>
				<div className="SidebarWrapper" style={{ zIndex: 6 }}>
					<SideBar scrollHandler={this.windowScrollToTop} />
				</div>
				<div className={classes.MainSearch} ref={this.myRef}>
					<div className={classes.SearchHeader}>
						<KeyboardBackspaceIcon
							className={classes.BackIcon}
							onClick={this.goBack}
						/>
						<h3 onClick={this.windowScrollToTop}>Search</h3>
					</div>
					<div className={classes.SearchBar}>
						<SearchBar
							searchPlaceholder="Search for posts or users"
							onSearch={this.onSearchHandler}
						/>
					</div>
					<div className={classes.TabsContainer}>
						<HorizontalTabs
							tabs={[{ name: 'Posts' }, { name: 'Users' }]}
							selected={this.state.tabSelected}
							onTabSelected={this.tabSwitchedHandler}
						/>
					</div>
					<div className={classes.SearchResults}>
						{this.state.searchResults}
					</div>
				</div>
				<div className="Recommendations"></div>

				{/**
				 * For displaying the searched posts in a nested way so that searched results are not gone when preseed back
				 * But, not the same has been done for profile section
				 */}
				<Route
					path={`${this.props.match.path}/post/:postId`}
					component={CompletePost}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		username: state.auth.username,
		userId: state.auth.userId,
		following: state.auth.following,
		token: state.auth.token,
		posts: state.search.posts,
		users: state.search.users,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		searchString: (searchString, searchType, token) =>
			dispatch(actionCreator.search(searchString, searchType, token)),
		toggleFollowUser: (userId, token) =>
			dispatch(actionCreator.toggleFollowUser(userId, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
