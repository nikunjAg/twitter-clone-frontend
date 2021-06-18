import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';

import classes from './CompletePost.module.css';
import * as actionCreators from '../../../store/actions';
import Post from '../Post';
import QuotePost from '../QuotePost';
import Spinner from '../../../components/Spinner/Spinner';
import SideBar from '../../SideBar/SideBar';
import { Avatar } from '@material-ui/core';
import PostInteraction from '../PostInteraction/PostInteraction';
import { getPostTime } from '../../../utility/timeDifference';
import PostFunctions from '../PostFunctions/PostFunctions';
import ImagePreview from '../../../components/ImagePreview/ImagePreview';
import Backdrop from '../../../components/Backdrop/Backdrop';
import { appName } from '../../../appName';
import { serverBaseURL } from '../../../axios';

class CompletePost extends Component {
	state = {
		showImagePreview: '',
	};

	componentDidMount() {
		this.props.onGetPost(this.props.match.params.postId, this.props.token);
		this.myRef = React.createRef();
	}

	windowScrollToTop = (event) => {
		if (event) event.stopPropagation();
		if (this.myRef?.current)
			this.myRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	componentDidUpdate(prevProps, prevState) {
		// console.log(prevProps);
		// console.log(this.props);
		if (prevProps.match.params.postId !== this.props.match.params.postId)
			this.props.onGetPost(this.props.match.params.postId, this.props.token);
	}

	goBack = () => {
		this.props.history.goBack();
	};

	showImagePreviewHandler = (imageSrc, event) => {
		event.stopPropagation();
		this.setState({ showImagePreview: imageSrc });
	};

	closeImagePreviewHandler = () => {
		this.setState({ showImagePreview: '' });
	};

	render() {
		let loadedPost = null;
		let reviews = null;
		let imagePreview = null;

		if (this.props.post) {
			loadedPost = (
				<div className={classes.CurrentPost}>
					<div className={classes.PostAddOn}>
						{this.props.post.replyTo ? (
							<React.Fragment>
								<ModeCommentOutlinedIcon className={classes.Icon} />
								<Link to={`/post/${this.props.post.replyTo._id}`}>
									<p>{this.props.post.replyTo.postedBy.name} Replied</p>
								</Link>
							</React.Fragment>
						) : null}
					</div>
					{this.props.post.replyTo ? (
						<Post
							post={this.props.post.replyTo}
							currentUser={this.props.userId}
							style={{ noBorder: true }}
							isVerified
							hasReply
						/>
					) : null}
					<div className={classes.PostHeader}>
						<Link
							to={this.props.post.postedBy.username}
							className={classes.ProfileIcon}
						>
							<Avatar
								src={`${serverBaseURL}${
									this.props.post.postedBy.profileImage !== ''
										? this.props.post.postedBy.profileImage
										: '/images/defaultProfilePic.png'
								}`}
								alt="Profile Pic"
							/>
						</Link>
						<div className={classes.UserDetails}>
							<div className={classes.FirstRow}>
								<p className={classes.DisplayName}>
									<Link to={`/profile/${this.props.post.postedBy.username}`}>
										{this.props.post.postedBy.name}
									</Link>
								</p>
								<VerifiedUserIcon className={classes.VerifiedIcon} />
							</div>
							<p>{this.props.post.postedBy.username}</p>
						</div>
						<div className={classes.MoreIcon}>
							<PostFunctions
								posStyle={{ top: '100%', right: '0%' }}
								ownerPost={
									this.props.post.postedBy.username === this.props.username
								}
								post={this.props.post}
								token={this.props.token}
								pinnedPost={this.props.pinnedPost}
							/>
						</div>
					</div>
					<div
						className={classes.PostContent}
						dangerouslySetInnerHTML={{ __html: this.props.post.content }}
					></div>

					{/* Post Images */}
					{this.props.post.images?.length ? (
						<div className={classes.PostImages}>
							{this.props.post.images.map((i, index) => (
								<div
									key={index}
									style={{
										height: this.props.post.images.length < 3 ? '100%' : '50%',
										width:
											this.props.post.images.length === 4 ||
											this.props.post.images.length === 2
												? '50%'
												: this.props.post.images.length === 1
												? '100%'
												: index !== 2
												? '50%'
												: '100%',
									}}
									className={classes.PostImageDiv}
									onClick={this.showImagePreviewHandler.bind(null, i)}
								>
									<img alt="Post Pic" src={`${serverBaseURL}${i}`} />
								</div>
							))}
						</div>
					) : null}

					{this.props.post.isQuotePost ? (
						<QuotePost
							key={this.props.post._id}
							isVerified
							post={this.props.post.quoteData}
							currentUser={this.props.userId}
						/>
					) : null}
					<div className={classes.PostTimestamp}>
						<p>
							{getPostTime(this.props.post.createdAt)} ·{' '}
							<span>Twitter Web App</span>
						</p>
					</div>
					<div className={classes.PostActivity}>
						<p>
							<b>{this.props.post.retweets.length}</b>
							<span>Re{appName.toLowerCase()}</span>
						</p>
						<p>
							<b>{this.props.post.quotePosts.length}</b>
							<span>Quote {appName}s</span>
						</p>
						<p>
							<b>{this.props.post.likes.length}</b>
							<span>Likes</span>
						</p>
					</div>
					<div className={classes.Interaction}>
						<PostInteraction
							post={this.props.post}
							currentUser={this.props.userId}
							isCompletePost
						/>
					</div>
				</div>
			);
			reviews = this.props.post.comments.map((comment) => (
				<Post
					key={comment._id}
					isVerified
					post={comment}
					currentUser={this.props.userId}
				/>
			));
		}

		if (this.state.showImagePreview !== '') {
			imagePreview = (
				<Backdrop background="rgba(0,0,0,0.65)">
					<ImagePreview
						src={this.state.showImagePreview}
						closePreview={this.closeImagePreviewHandler}
					/>
				</Backdrop>
			);
		}

		return (
			<div className={classes.CompletePost}>
				{imagePreview}
				<div className="SidebarWrapper" style={{ zIndex: 57 }}>
					<SideBar />
				</div>
				<div className={classes.PostWrapper} ref={this.myRef}>
					<div className={classes.TweetHeader}>
						<KeyboardBackspaceIcon
							onClick={this.goBack}
							className={classes.BackIcon}
						/>
						<h3 onClick={this.windowScrollToTop}>{appName}</h3>
					</div>
					{this.props.loading ? (
						<div className={classes.SpinnerWrapper}>
							<Spinner />
						</div>
					) : this.props.post ? (
						<React.Fragment>
							{loadedPost}
							{reviews}
						</React.Fragment>
					) : null}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
		userId: state.auth.userId,
		name: state.auth.name,
		username: state.auth.username,
		profileImage: state.auth.profileImage,
		pinnedPost: state.auth.pinnedPost,
		post: state.posts.currentPost,
		loading: state.posts.loading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetPost: (postId, token) =>
			dispatch(actionCreators.getPost(postId, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CompletePost);
