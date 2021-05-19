import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import classes from './Bookmark.module.css';
import SideBar from '../SideBar/SideBar';
import * as actionCreator from '../../store/actions';
import Post from '../Post/Post';
import ReplyPost from '../Post/ReplyPost';
import CompletePost from '../Post/CompletePost/CompletePost';
import Spinner from '../../components/Spinner/Spinner';

class Search extends Component {
	componentDidMount() {
		// We need to decide here what shoud be the starting selected tab
		this.myRef = React.createRef();

		this.props.getBookmarkedPosts(this.props.token);
	}

	componentDidUpdate(prevProps, prevState) {}

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

	render() {
		let posts = (
			<div className={classes.NoResults}>
				<h3>You haven’t added any Tweets to your Bookmarks yet</h3>
				<p>When you do, they’ll show up here.</p>
			</div>
		);

		if (this.props.loading) {
			posts = (
				<div className="SpinnerWrapper">
					<Spinner />
				</div>
			);
		}

		if (this.props.posts?.length) {
			posts = this.props.posts.map((post) => {
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
			});
		}

		return (
			<div className={classes.Bookmark}>
				<div className="SidebarWrapper">
					<SideBar scrollHandler={this.windowScrollToTop} />
				</div>
				<div className={classes.MainBookmarks} ref={this.myRef}>
					<div className={classes.BookmarkHeader}>
						<KeyboardBackspaceIcon
							className={classes.BackIcon}
							onClick={this.goBack}
						/>
						<div className="col" onClick={this.windowScrollToTop}>
							<h3>Bookmarks</h3>
							<p>{this.props.username}</p>
						</div>
					</div>
					<div className={classes.BookmarkPosts}>{posts}</div>
				</div>
				<div className="Recommendations"></div>

				{/**
				 * For displaying the bookmarked posts in a nested way so that bookmarked posts are not gone when pressed back from CompletePost component
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
		loading: state.bookmarks.loading,
		posts: state.bookmarks.posts,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getBookmarkedPosts: (token) =>
			dispatch(actionCreator.getBookmarkedPosts(token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
