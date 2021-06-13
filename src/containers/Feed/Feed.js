import React, { Component } from 'react';

import classes from './Feed.module.css';
import Post from '../Post/Post';
import Spinner from '../../components/Spinner/Spinner';
import ReplyPost from '../Post/ReplyPost';
import { appName } from '../../appName';

class Feed extends Component {
	render() {
		let feedContent = this.props.posts
			? this.props.posts.map((post) => {
					return !post.replyTo ? (
						// Normal Post or Retweet Post
						<Post
							key={post._id}
							post={{ ...post }}
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
			: null;

		if (feedContent.length === 0 && !this.props.loading) {
			feedContent = (
				<div className={classes.NoFeed}>
					<h3>Write a Post, Follow Someone</h3>
					<p>
						Feed are {appName}s which are posted or interacted by you or by
						someone you follow. Get Started with your {appName}s or following
						someone.
					</p>
				</div>
			);
		}

		let spinner = null;
		if (this.props.loading)
			spinner = (
				<div className="SpinnerWrapper">
					<Spinner />
				</div>
			);

		return (
			<div className={classes.Feed}>
				{spinner}
				{feedContent}
			</div>
		);
	}
}

export default Feed;
