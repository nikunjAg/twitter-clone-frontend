import axios from '../../axios';

import * as actionTypes from './actionTypes';

const getBookmarkedPostsStart = () => {
	return {
		type: actionTypes.GET_BOOKMARKED_POSTS_START,
	};
};

const getBookmarkedPostsSuccess = (posts) => {
	return {
		type: actionTypes.GET_BOOKMARKED_POSTS_SUCCESS,
		posts,
	};
};

const getBookmarkedPostsFail = (error) => {
	return {
		type: actionTypes.GET_BOOKMARKED_POSTS_FAIL,
		error,
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

export const getBookmarkedPosts = (token) => {
	return (dispatch) => {
		dispatch(getBookmarkedPostsStart());
		axios
			.get('/user/bookmarks', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(getBookmarkedPostsSuccess(response.data.posts));
			})
			.catch((err) => {
				dispatch(errorHandler(err, getBookmarkedPostsFail));
			});
	};
};
