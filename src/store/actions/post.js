import axios from '../../axios';

import * as actionTypes from './actionTypes';

const fetchFeedStart = () => {
	return {
		type: actionTypes.FETCH_FEED_START,
	};
};

const fetchFeedSuccess = (posts) => {
	return {
		type: actionTypes.FETCH_FEED_SUCCESS,
		posts: posts,
	};
};

const fetchFeedFail = (error) => {
	return {
		type: actionTypes.FETCH_FEED_FAIL,
		error: error,
	};
};

const createPostStart = () => {
	return {
		type: actionTypes.CREATE_POST_START,
	};
};

const createPostSuccess = (postData) => {
	return {
		type: actionTypes.CREATE_POST_SUCCESS,
		post: postData,
	};
};

const createPostFail = (error) => {
	return {
		type: actionTypes.CREATE_POST_FAIL,
		error: error,
	};
};

const getPostStart = () => {
	return {
		type: actionTypes.GET_POST_START,
	};
};

const getPostSuccess = (post) => {
	return {
		type: actionTypes.GET_POST_SUCCESS,
		post: post,
	};
};

const getPostFail = (error) => {
	return {
		type: actionTypes.GET_POST_FAIL,
		error: error,
	};
};

const likePostSuccess = (updatedPost, result) => {
	return {
		type: actionTypes.LIKE_POST_SUCCESS,
		post: updatedPost,
		result,
	};
};

const likePostFail = (error) => {
	return {
		type: actionTypes.LIKE_POST_FAIL,
		error: error,
	};
};

const retweetPostSuccess = (updatedPost) => {
	return {
		type: actionTypes.RETWEET_POST_SUCCESS,
		post: updatedPost,
	};
};

const retweetPostFail = (error) => {
	return {
		type: actionTypes.RETWEET_POST_FAIL,
		error: error,
	};
};

const quotePostSuccess = (updatedParentPost, createdPost) => {
	return {
		type: actionTypes.QUOTE_POST_SUCCESS,
		parentPost: updatedParentPost,
		post: createdPost,
	};
};

const quotePostFail = (error) => {
	return {
		type: actionTypes.QUOTE_POST_FAIL,
		error: error,
	};
};

const deleteRetweetSuccess = (updatedPost) => {
	return {
		type: actionTypes.DELETE_RETWEET_SUCCESS,
		post: updatedPost,
	};
};

const deleteRetweetFail = (error) => {
	return {
		type: actionTypes.DELETE_RETWEET_FAIL,
		error: error,
	};
};

const replyPostSuccess = (parentPost, replyPost) => {
	return {
		type: actionTypes.REPLY_POST_SUCCESS,
		parentPost: parentPost,
		post: replyPost,
	};
};

const replyPostFail = (error) => {
	return {
		type: actionTypes.REPLY_POST_FAIL,
		error: error,
	};
};

const deletePostSuccess = (deletedPost) => {
	return {
		type: actionTypes.DELETE_POST_SUCCESS,
		post: deletedPost,
	};
};

const deletePostFail = (error) => {
	return {
		type: actionTypes.DELETE_POST_FAIL,
		error: error,
	};
};

const errorHandler = (err, errorActionCreator) => {
	return (dispatch) => {
		console.log(err);
		if (err.response) {
			// This means the status code is not in range of 2XX
			dispatch(
				errorActionCreator({
					message: err.response.data.message,
					statusCode: err.response.status,
				})
			);
		} else if (err.request) {
			// This means the request was sent but no response was received
			dispatch(errorActionCreator({ message: 'Server is down' }));
		} else {
			// This means we were not even able to send the request
			dispatch(
				errorActionCreator({
					message: 'Unable to send request, Check your connection',
				})
			);
		}
	};
};

export const fetchFeed = (token) => {
	return (dispatch) => {
		dispatch(fetchFeedStart());

		axios
			.get('/posts/feed', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(fetchFeedSuccess(response.data.posts));
			})
			.catch((err) => {
				dispatch(errorHandler(err, fetchFeedFail));
			});
	};
};

export const createPost = (postContent, images, token) => {
	return (dispatch) => {
		dispatch(createPostStart());

		const formData = new FormData();
		formData.append('content', postContent);
		for (let image of images) formData.append('images', image);

		axios
			.post('/posts', formData, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(createPostSuccess(response.data.post));
			})
			.catch((err) => {
				dispatch(errorHandler(err, createPostFail));
			});
	};
};

export const getPost = (postId, token) => {
	return (dispatch) => {
		dispatch(getPostStart());
		axios
			.get(`/posts/${postId}`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(getPostSuccess(response.data.post));
			})
			.catch((err) => {
				dispatch(errorHandler(err, getPostFail));
			});
	};
};

export const likePost = (postId, token) => {
	return (dispatch) => {
		axios
			.put(`/posts/${postId}/like`, null, {
				headers: { Authorization: 'Bearer ' + token },
			})
			.then((response) => {
				dispatch(likePostSuccess(response.data.post, response.data.result));
			})
			.catch((err) => {
				dispatch(errorHandler(err, likePostFail));
			});
	};
};

export const retweetOnPost = (postId, token) => {
	return (dispatch) => {
		axios
			.patch(`/posts/${postId}/retweet`, null, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(retweetPostSuccess(response.data.post));
			})
			.catch((err) => {
				dispatch(errorHandler(err, retweetPostFail));
			});
	};
};

export const quoteOnPost = (postId, content, images, token) => {
	return (dispatch) => {
		const formData = new FormData();
		formData.append('content', content);
		for (let image of images) formData.append('images', image);

		axios
			.post(`/posts/${postId}/quote`, formData, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(
					quotePostSuccess(response.data.parentPost, response.data.post)
				);
			})
			.catch((err) => {
				dispatch(errorHandler(err, quotePostFail));
			});
	};
};

export const deleteRetweetPost = (postId, token) => {
	return (dispatch) => {
		axios
			.delete(`/posts/${postId}/retweet`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(deleteRetweetSuccess(response.data.post));
			})
			.catch((err) => {
				dispatch(err, deleteRetweetFail);
			});
	};
};

export const replyOnPost = (postId, content, images, token) => {
	return (dispatch) => {
		// Here we need tosend a request to server for creating a reply

		const formData = new FormData();
		formData.append('content', content);
		for (let image of images) formData.append('images', image);

		axios
			.post(`/posts/${postId}/reply`, formData, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(
					replyPostSuccess(response.data.parentPost, response.data.post)
				);
			})
			.catch((err) => {
				dispatch(errorHandler(err, replyPostFail));
			});
	};
};

export const deletePost = (postId, token) => {
	console.log(postId, token);
	return (dispatch) => {
		axios
			.delete(`/posts/${postId}`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(deletePostSuccess(response.data.deletedPost));
			})
			.catch((err) => {
				dispatch(errorHandler(err, deletePostFail));
			});
	};
};
