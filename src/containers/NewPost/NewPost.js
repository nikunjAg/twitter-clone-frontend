import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';

import classes from './NewPost.module.css';
import Editor from '../../components/Editor/Editor';
import { getBorderStyleWithProps } from '../../utility/styleWithProps';
import { serverBaseURL } from '../../axios';

class NewPost extends Component {
	state = {
		html: '',
		images: [],
		pickEmoji: false,
	};

	closeEmojiPicker = () => {
		this.setState((prevState) => ({
			...prevState,
			pickEmoji: false,
		}));
	};

	onToggleEmojiPicker = (event) => {
		event.stopPropagation();
		this.setState((prevState) => ({
			...prevState,
			pickEmoji: !prevState.pickEmoji,
		}));
	};

	onChangeText = (html) => {
		html = html.replace('<br>', '<br />');

		this.setState((prevState) => ({ ...prevState, html: html }));
	};

	imageSelectedHandler = (e) => {
		this.setState({
			images: [...this.state.images, ...e.target.files].slice(0, 4),
		});
	};

	imageRemoveHandler = (index, event) => {
		event.stopPropagation();
		const updatedImages = this.state.images.filter(
			(image, imageIndex) => imageIndex !== index
		);
		this.setState({ images: updatedImages });
	};

	onPostHandler = () => {
		const postContent = this.state.html;
		this.props.onPost(postContent, this.state.images);
		this.setState({ pickEmoji: false, html: '', images: [] });
	};

	render() {
		return (
			<div
				className={classes.NewPost}
				style={{ ...getBorderStyleWithProps(this.props) }}
			>
				<Avatar
					className={classes.AccountIcon}
					src={`${serverBaseURL}${this.props.profileImage}`}
					alt="Profile Pic"
				/>
				<div className={classes.Post}>
					<Editor
						html={this.state.html}
						onChange={this.onChangeText}
						images={this.state.images}
						onImageChange={this.imageSelectedHandler}
						removeImage={this.imageRemoveHandler}
						showEmojiPicker={this.state.pickEmoji}
						onToggleEmojiPicker={this.onToggleEmojiPicker}
						closeEmojiPicker={this.closeEmojiPicker}
						onPost={this.onPostHandler}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profileImage: state.auth.profileImage,
	};
};

export default connect(mapStateToProps)(NewPost);
