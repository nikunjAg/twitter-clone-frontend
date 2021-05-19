import axios from '../../axios';

import * as actionTypes from './actionTypes';

const getProfileStart = () => {
	return {
		type: actionTypes.GET_PROFILE_START,
	};
};

const getProfileSuccess = (userData) => {
	return {
		type: actionTypes.GET_PROFILE_SUCCESS,
		userData,
	};
};

const getProfileFail = (error) => {
	return {
		type: actionTypes.GET_PROFILE_FAIL,
		error,
	};
};

const followUserSuccess = (updatedUser, otherUser) => {
	return {
		type: actionTypes.FOLLOW_USER_SUCCESS,
		user: updatedUser,
		otherUser,
	};
};

const followUserFail = (error) => {
	return {
		type: actionTypes.FOLLOW_USER_FAIL,
		error,
	};
};

const getUserLinksStarted = () => {
	console.log('YEs');
	return {
		type: actionTypes.GET_USER_LINKS_START,
	};
};

const getUserLinksSuccess = (user) => {
	return {
		type: actionTypes.GET_USER_LINKS_SUCCESS,
		user,
	};
};

const getUserLinksFail = (error) => {
	return {
		type: actionTypes.GET_USER_LINKS_FAIL,
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

export const getUserProfile = (username, token) => {
	return (dispatch) => {
		dispatch(getProfileStart());
		axios
			.post(
				'/user',
				{ username: username },
				{
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				dispatch(getProfileSuccess(response.data.user));
			})
			.catch((err) => {
				dispatch(errorHandler(err, getProfileFail));
			});
	};
};

export const toggleFollowUser = (userId, token) => {
	return (dispatch) => {
		axios
			.put(
				'/user/follow',
				{ userId: userId },
				{
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				dispatch(
					followUserSuccess(response.data.user, response.data.otherUser)
				);
			})
			.catch((err) => {
				dispatch(errorHandler(err, followUserFail));
			});
	};
};

export const getUserLinks = (username, token) => {
	return (dispatch) => {
		console.log('YEs');
		dispatch(getUserLinksStarted());
		axios
			.post(
				'/user/links',
				{ username: username },
				{
					headers: {
						Authorization: 'Bearer ' + token,
					},
				}
			)
			.then((response) => {
				dispatch(getUserLinksSuccess(response.data.user));
			})
			.catch((err) => {
				dispatch(errorHandler(err, getUserLinksFail));
			});
	};
};
