import axios from '../../axios';

import * as actionTypes from './actionTypes';

const searchPostsSuccess = (posts) => {
	return { type: actionTypes.SEARCH_POSTS_SUCCESS, posts };
};

const searchPostsFail = (error) => {
	return {
		type: actionTypes.SEARCH_POSTS_FAIL,
		error,
	};
};

const searchUsersSuccess = (users) => {
	return { type: actionTypes.SEARCH_USERS_SUCCESS, users };
};

const searchUsersFail = (error) => {
	return {
		type: actionTypes.SEARCH_USERS_FAIL,
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

export const search = (searchString, searchType, token) => {
	const URL = searchType === 'Users' ? '/user/search' : '/posts/search';
	return (dispatch) => {
		axios
			.post(
				URL,
				{ search: searchString },
				{
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				dispatch(
					searchType === 'Users'
						? searchUsersSuccess(response.data.users)
						: searchPostsSuccess(response.data.posts)
				);
			})
			.catch((err) => {
				dispatch(
					errorHandler(
						err,
						searchType === 'Users' ? searchUsersFail : searchPostsFail
					)
				);
			});
	};
};
