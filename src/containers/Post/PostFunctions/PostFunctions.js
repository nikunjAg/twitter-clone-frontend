import React, { Component } from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaceIcon from '@material-ui/icons/Place';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';

import classes from './PostFunctions.module.css';
import MoreDropdown from '../../../components/MoreDropdown/MoreDropdown';
import * as actionCreator from '../../../store/actions';
import Modal from '../../../components/Modal/Modal';
import Backdrop from '../../../components/Backdrop/Backdrop';

/**
 * This component is for the MoreIcons available in the post
 * Here we open a dropdown on that icon click and depending upon the post offer the user a list of actions he can perform
 * EXAMPLE -> Pin post(unpin), Delete Post, Bookmark Post
 */

class PostFunctions extends Component {
	state = {
		openModal: false,
		modalFor: '',
	};

	isPinnedPost = () => {
		return (
			this.props.pinnedTweet?.toString() === this.props.post._id.toString()
		);
	};

	isBookmarkedPost = () => {
		return (
			this.props.bookmarkedPosts.findIndex(
				(p) => p.toString() === this.props.post._id.toString()
			) !== -1
		);
	};

	stopEventPropagation = (event) => {
		event?.stopPropagation();
	};

	closeModal = (event) => {
		this.stopEventPropagation(event);
		this.setState({ openModal: false, modalFor: '' });
	};

	deleteTweetHandler = (event) => {
		this.stopEventPropagation(event);
		console.log('Want to delete tweet ' + this.props.post._id);
		this.closeModal();
		this.props.onDeleteTweetHandler(this.props.post._id, this.props.token);
	};

	pinTweetHandler = (event) => {
		this.stopEventPropagation(event);
		console.log('Want to pin tweet ' + this.props.post._id);
		this.props.onPinTweetHandler(this.props.post._id, this.props.token);
		this.closeModal();
	};

	unfollowUserHandler = (event) => {
		this.stopEventPropagation(event);
		console.log('Want to unfollow user ' + this.props.post.postedBy.username);
		this.closeModal();
	};

	bookmarkTweetHandler = (event) => {
		this.stopEventPropagation(event);
		console.log('Want to bookmark tweet ' + this.props.post._id);
		this.props.onBookmarkTweetHandler(this.props.post._id, this.props.token);
		this.closeModal();
	};

	onMorePostItemTypeSelected = (type) => {
		this.setState({ openModal: true, modalFor: type });
	};

	render() {
		const ownerPostFunctions = [
			{
				value: 'Delete Tweet',
				icon: <DeleteIcon />,
				type: 'deleteTweet',
			},
			{
				value: (this.isPinnedPost() ? 'Unpin' : 'Pin') + ' this tweet',
				icon: this.isPinnedPost() ? <RoomTwoToneIcon /> : <PlaceIcon />,
				type: 'pinTweet',
			},
			{
				value: (this.isBookmarkedPost() ? 'Remove' : 'Add') + ' Bookmark',
				icon: this.isBookmarkedPost() ? <TurnedInNotIcon /> : <BookmarkIcon />,
				type: 'bookmarkTweet',
			},
		];

		const othersPostFunctions = [
			{
				value: 'Unfollow ' + this.props.post.postedBy.username,
				icon: <PersonAddDisabledIcon />,
				type: 'unfollowUser',
			},
			{
				value: (this.isBookmarkedPost() ? 'Remove' : 'Add') + ' Bookmark',
				icon: this.isBookmarkedPost() ? <TurnedInNotIcon /> : <BookmarkIcon />,
				type: 'bookmarkTweet',
			},
		];

		const modalContent = {
			deleteTweet: {
				heading: 'Delete Tweet?',
				content:
					'This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results. ',
				select: 'Delete',
				selectedHandler: this.deleteTweetHandler,
			},
			pinTweet: {
				heading: this.isPinnedPost()
					? 'Unpin Tweet from profile?'
					: 'Pin Tweet to profile?',
				content: this.isPinnedPost()
					? 'This will no longer appear automatically at the top of your profile. '
					: 'This will appear at the top of your profile and replace any previously pinned Tweet. ',
				select: this.isPinnedPost() ? 'Unpin' : 'Pin',
				selectedHandler: this.pinTweetHandler,
			},
			bookmarkTweet: {
				heading: this.isBookmarkedPost()
					? 'Remove Bookmark from Tweet?'
					: 'Add Bookmark to Tweet?',
				content: this.isBookmarkedPost()
					? 'This tweet will no longer appear in your bookmarked tweets list.'
					: 'This will appear in your bookmarked tweets list.',
				select: this.isBookmarkedPost() ? 'Remove' : 'Bookmark',
				selectedHandler: this.bookmarkTweetHandler,
			},
		};

		let modalPopup = null;
		if (this.state.openModal) {
			modalPopup = (
				<Backdrop>
					<Modal onModalClose={this.closeModal} smallModal>
						<div className={classes.ModalContent}>
							<h3>{modalContent[this.state.modalFor].heading}</h3>
							<p>{modalContent[this.state.modalFor].content}</p>
							<div className={classes.ModalActions}>
								<button onClick={this.closeModal}>Cancel</button>
								<button
									onClick={modalContent[this.state.modalFor].selectedHandler}
								>
									{modalContent[this.state.modalFor].select}
								</button>
							</div>
						</div>
					</Modal>
				</Backdrop>
			);
		}

		return (
			<div className={classes.PostFunctions}>
				<MoreDropdown
					items={
						this.props.ownerPost ? ownerPostFunctions : othersPostFunctions
					}
					onItemTypeSelected={this.onMorePostItemTypeSelected}
				/>
				{modalPopup}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		bookmarkedPosts: state.auth.bookmarkedPosts,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteTweetHandler: (postId, token) =>
			dispatch(actionCreator.deletePost(postId, token)),
		onPinTweetHandler: (postId, token) =>
			dispatch(actionCreator.pinPost(postId, token)),
		onBookmarkTweetHandler: (postId, token) =>
			dispatch(actionCreator.bookmarkPost(postId, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFunctions);
