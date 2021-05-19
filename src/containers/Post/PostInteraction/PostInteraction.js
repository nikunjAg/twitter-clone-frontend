import React, { Component } from 'react';
import { connect } from 'react-redux';
import TwitterIcon from '@material-ui/icons/Twitter';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import RepeatOutlinedIcon from '@material-ui/icons/RepeatOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import CreateIcon from '@material-ui/icons/Create';
import RepeatIcon from '@material-ui/icons/Repeat';

import classes from './PostInteraction.module.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import Modal from '../../../components/Modal/Modal';
import NewPost from '../../NewPost/NewPost';
import Post from '../Post';
import Dropdown from '../../../components/Dropdown/Dropdown';
import * as actionCreator from '../../../store/actions';
import { convertToInternationalCurrencySystem } from '../../../utility/numberFormatter';

/**
 * PROPS MEANING
 * post -> post which this component represent
 * isVerified -> (temporary prop) means the user is verified
 * currentUser -> The user which is logged in currently
 * isModalPost -> Means this component will not work on clicks because this props signifies that this post is used inside a modal
 * isCompletePost -> Means that this PostInteraction component is used inside the HERO post on the complete modal component so this PostInteraction component will have bigger icons, no labels on icons, ...
 */

const retweetDropdownItems = [
	{
		value: 'Retweet',
		icon: <RepeatIcon />,
		type: 'retweet',
	},
	{
		value: 'Quote tweet',
		icon: <CreateIcon />,
		type: 'quote tweet',
	},
];

class PostInteraction extends Component {
	state = {
		openRetweetDropdown: false,
		showModal: false,
		modalType: null,
	};

	/* isQuotePost = () => {
		return this.props.post.isRetweetPost && this.props.post.content;
	}; */

	onReplyBtnClickHandler = (event) => {
		event.stopPropagation();
		if (this.props.isModalPost) return;
		this.setState({
			showModal: true,
			modalType: 'Reply',
		});
	};

	onModalCloseHandler = () => {
		this.setState({ showModal: false, modalType: null });
	};

	createReply = (content, images) => {
		console.log('Create a reply with content ' + content);
		// Create a reply with this content and this.state.replyOnPost._id
		this.props.onReplyToPost(
			this.props.post._id,
			content,
			images,
			this.props.token
		);
		this.onModalCloseHandler();
	};

	retweetIconClickHandler = (event) => {
		event.stopPropagation();
		if (this.props.isModalPost) return;
		console.log('Hello');
		if (event.target.classList.contains(classes.IsRetweeted)) {
			// Show dropdown with Delete Retweet and create another quote tweet options
			retweetDropdownItems[0].value = 'Delete Retweet';
			retweetDropdownItems[0].type = 'deleteRetweet';
		} else {
			retweetDropdownItems[0].value = 'Retweet';
			retweetDropdownItems[0].type = 'retweet';
		}

		// Open the dropdown
		this.setState({ openRetweetDropdown: true });
	};

	closeRetweetDropdown = () => {
		// Then outside of the dropdown is clicked
		// Need to close the dropdown
		this.setState({ openRetweetDropdown: false });
	};

	retweetTypeSelected = (type, event) => {
		// To avoid invoking unnecessary click handler
		// Required !!!
		event.stopPropagation();
		if (type === 'retweet') {
			console.log('Want to retweet the post');
			this.createRetweetPost();
		} else if (type === 'deleteRetweet') {
			console.log('Want to delete the retweet');
			this.deleteCreatedRetweet();
		} else {
			console.log('Want to do quote post');
			this.onQuoteBtnClickHandler();
		}
		// To close the dropdown
		this.closeRetweetDropdown();
	};

	// From Dropdown
	// Retweet -> Quote
	onQuoteBtnClickHandler = () => {
		// If it is a quote post we need to setState to retweetData
		// console.log(this.props.post);
		this.setState({
			showModal: true,
			modalType: 'Quote',
		});
	};

	// From modal
	createQuote = (content, images) => {
		// console.log('Created Quote with content ' + content);
		this.props.onQuotePost(
			this.props.post._id,
			content,
			images,
			this.props.token
		);
		this.onModalCloseHandler();
	};

	// create quote post
	createRetweetPost = () => {
		// Here content will be empty
		const parentPostId = this.props.post._id;
		console.log('Want to create a Retweet Post of post ' + parentPostId);
		this.props.onRetweetPost(parentPostId, this.props.token);
	};

	// Clicking on retweet icon if already retweeted
	deleteCreatedRetweet = () => {
		console.log('Want to delete a retweet of ID ' + this.props.post._id);
		this.props.deleteRetweetPost(this.props.post._id, this.props.token);
	};

	onLikeClickHandler = (event) => {
		event.stopPropagation();
		if (this.props.isModalPost) return;

		// call the like post redux method
		this.props.onLikePost(this.props.post._id, this.props.token);
	};

	onShareClickHandler = (event) => {
		event.stopPropagation();
		console.log('Share btn clicked');
		if (this.props.isModalPost) return;
		// create a link of the post
	};

	render() {
		let helperModal = null;
		if (this.state.showModal)
			helperModal = (
				<Backdrop>
					<Modal onModalClose={this.onModalCloseHandler}>
						<div className={classes.ModalHeader}>
							<TwitterIcon className={classes.TwitterIcon} />
						</div>
						<div className={classes.ModalContent}>
							<div className={classes.MContent}>
								<h2>
									{this.state.modalType === 'Quote' ? 'Quote On' : 'Reply To'}
								</h2>
								<NewPost
									onPost={
										this.state.modalType === 'Quote'
											? this.createQuote
											: this.createReply
									}
								/>
								<Post
									isModalPost
									post={this.props.post}
									isVerified
									currentUser={this.props.currentUser}
								/>
							</div>
						</div>
					</Modal>
				</Backdrop>
			);

		let postInteractions = null;

		const { likes, retweets, comments, commentedBy } = this.props.post;

		const isLiked = likes.includes(this.props.currentUser)
			? classes.IsLiked
			: '';
		const isRetweeted = retweets.includes(this.props.currentUser)
			? classes.IsRetweeted
			: '';
		const isCommented = commentedBy.includes(this.props.currentUser)
			? classes.IsCommented
			: '';

		const commentBtnClss = [classes.Icon].concat(isCommented).join(' ');
		const retweetBtnClss = [classes.Icon, classes.Retweet]
			.concat(isRetweeted)
			.join(' ');
		const likeBtnClss = [classes.Icon, classes.Like].concat(isLiked).join(' ');

		const commentIcon = isCommented ? (
			<ModeCommentIcon className={commentBtnClss} />
		) : (
			<ModeCommentOutlinedIcon className={commentBtnClss} />
		);
		const retweetIcon = <RepeatOutlinedIcon className={retweetBtnClss} />;
		const likeIcon = isLiked ? (
			<FavoriteIcon className={likeBtnClss} />
		) : (
			<FavoriteBorderRoundedIcon className={likeBtnClss} />
		);

		let retweetDropdown = null;
		if (this.state.openRetweetDropdown)
			retweetDropdown = (
				<Dropdown
					posStyle={{ bottom: '0%', left: '50%' }}
					handleCloseDropdown={this.closeRetweetDropdown}
					items={retweetDropdownItems}
					onItemSelected={this.retweetTypeSelected}
				/>
			);

		postInteractions = (
			<div className={classes.PostInteraction}>
				<div
					className={
						classes.PostActivity +
						' ' +
						(this.props.isCompletePost ? classes.CompPostActivity : null)
					}
					onClick={this.onReplyBtnClickHandler}
				>
					<div className={classes.Comment}>{commentIcon}</div>
					<span className={classes.CommentCount + ' ' + isCommented}>
						{!this.props.isCompletePost
							? convertToInternationalCurrencySystem(comments.length) || ''
							: null}
					</span>
				</div>
				<div
					className={
						classes.PostActivity +
						' ' +
						(this.props.isCompletePost ? classes.CompPostActivity : null)
					}
					onClick={this.retweetIconClickHandler}
				>
					{retweetIcon}
					{retweetDropdown}
					<span className={classes.RetweetCount + ' ' + isRetweeted}>
						{!this.props.isCompletePost
							? convertToInternationalCurrencySystem(retweets.length) || ''
							: null}
					</span>
				</div>
				<div
					className={
						classes.PostActivity +
						' ' +
						(this.props.isCompletePost ? classes.CompPostActivity : null)
					}
					onClick={this.onLikeClickHandler}
				>
					{likeIcon}
					<span className={classes.LikeCount + ' ' + isLiked}>
						{!this.props.isCompletePost
							? convertToInternationalCurrencySystem(likes.length) || ''
							: null}
					</span>
				</div>
				<div
					className={
						classes.PostActivity +
						' ' +
						(this.props.isCompletePost ? classes.CompPostActivity : null)
					}
					onClick={this.onShareClickHandler}
				>
					<ShareOutlinedIcon className={classes.Icon + ' ' + classes.Share} />
				</div>
			</div>
		);

		return (
			<div className={classes.PostInteraction}>
				{helperModal}
				{postInteractions}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLikePost: (postId, token) =>
			dispatch(actionCreator.likePost(postId, token)),
		onRetweetPost: (postId, token) =>
			dispatch(actionCreator.retweetOnPost(postId, token)),
		onQuotePost: (postId, content, images, token) =>
			dispatch(actionCreator.quoteOnPost(postId, content, images, token)),
		deleteRetweetPost: (postId, token) =>
			dispatch(actionCreator.deleteRetweetPost(postId, token)),
		onReplyToPost: (postId, content, images, token) =>
			dispatch(actionCreator.replyOnPost(postId, content, images, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostInteraction);
