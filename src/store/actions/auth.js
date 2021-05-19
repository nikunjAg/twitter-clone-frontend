import axios from '../../axios';
import * as actionTypes from './actionTypes';

const userSignupStart = () => {
	return {
		type: actionTypes.USER_SIGNUP_START,
	};
};
const userSignupSuccess = (token, user) => {
	return {
		type: actionTypes.USER_SIGNUP_SUCCESS,
		token,
		user,
	};
};
const userSignupFail = (error) => {
	return {
		type: actionTypes.USER_SIGNUP_FAIL,
		error: error,
	};
};

const userLoginStart = () => {
	return {
		type: actionTypes.USER_LOGIN_START,
	};
};

const userLoginSuccess = (token, user) => {
	return {
		type: actionTypes.USER_LOGIN_SUCCESS,
		token,
		user,
	};
};

const userLoginFail = (error) => {
	return {
		type: actionTypes.USER_LOGIN_FAIL,
		error: error,
	};
};

const userAutoLoginFail = (err) => {};

const pinPostSuccess = (message, post, oldPinnedPost, pinnedPostId) => {
	return {
		type: actionTypes.PIN_POST_SUCCESS,
		message,
		post,
		oldPinnedPost,
		pinnedPostId,
	};
};

const pinPostFail = (error) => {
	return {
		type: actionTypes.PIN_POST_FAIL,
		error: error,
	};
};

const updatedUserSuccess = (user) => {
	return {
		type: actionTypes.USER_UPDATE_SUCCESS,
		user,
	};
};

const updatedUserFail = (error) => {
	return {
		type: actionTypes.USER_UPDATE_FAIL,
		error,
	};
};

const bookmarkPostSuccess = (message, bookmarkedPosts) => {
	return {
		type: actionTypes.BOOKMARK_POST_SUCCESS,
		message,
		bookmarkedPosts,
	};
};

const bookmarkPostFail = (error) => {
	return {
		type: actionTypes.BOOKMARK_POST_FAIL,
		error: error,
	};
};

const setAuthTimeout = (timeoutIn) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout());
		}, timeoutIn * 1000);
	};
};

const storeTokenInStorage = (token, userId, expiresIn) => {
	return (dispatch) => {
		localStorage.setItem('token', token);
		localStorage.setItem('userId', userId);
		const expirationDate = new Date(
			new Date().getTime() + expiresIn * 1000
		).toISOString();
		localStorage.setItem('expirationDate', expirationDate);
		dispatch(setAuthTimeout(expiresIn));
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

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('expirationDate');
	return {
		type: actionTypes.USER_LOGOUT,
	};
};

export const userSignup = (userData) => {
	return (dispatch) => {
		dispatch(userSignupStart());
		axios
			.post('/user/signup', userData)
			.then((response) => {
				dispatch(
					storeTokenInStorage(
						response.data.token,
						response.data.user.userId,
						+response.data.expiresIn
					)
				);
				dispatch(userSignupSuccess(response.data.token, response.data.user));
			})
			.catch((err) => {
				dispatch(errorHandler(err, userSignupFail));
			});
	};
};

export const userLogin = (userDetails) => {
	return (dispatch) => {
		dispatch(userLoginStart());
		axios
			.post('/user/login', userDetails)
			.then((response) => {
				dispatch(
					storeTokenInStorage(
						response.data.token,
						response.data.user.userId,
						+response.data.expiresIn
					)
				);
				dispatch(userLoginSuccess(response.data.token, response.data.user));
			})
			.catch((err) => {
				dispatch(errorHandler(err, userLoginFail));
			});
	};
};

export const authCheckState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(logout());
		} else {
			const userId = localStorage.getItem('userId');
			const expirationDate = new Date(localStorage.getItem('expirationDate'));

			if (expirationDate > new Date()) {
				// Here we can send a request to server to get the token verified and get the user data
				dispatch(userLoginStart());
				axios
					.post(
						'/user/verifyToken',
						{ userId: userId },
						{
							headers: {
								Authorization: 'Bearer ' + token,
							},
						}
					)
					.then((response) => {
						dispatch(
							storeTokenInStorage(
								response.data.token,
								response.data.user.userId,
								+response.data.expiresIn
							)
						);
						dispatch(userLoginSuccess(response.data.token, response.data.user));
					})
					.catch((err) => {
						dispatch(logout());
						dispatch(errorHandler(err, userAutoLoginFail));
					});
			} else {
				dispatch(logout());
			}
		}
	};
};

export const pinPost = (postId, token) => {
	return (dispatch) => {
		axios
			.patch(`/posts/${postId}/pin`, null, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(
					pinPostSuccess(
						response.data.message,
						response.data.post,
						response.data.oldPinnedPost,
						response.data.pinnedPostId
					)
				);
			})
			.catch((err) => {
				dispatch(errorHandler(err, pinPostFail));
			});
	};
};

export const updateUser = (
	name,
	shortBio,
	location,
	dateOfBirth,
	coverImage,
	profileImage,
	token
) => {
	return (dispatch) => {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('shortBio', shortBio);
		formData.append('location', location);
		formData.append('dateOfBirth', dateOfBirth);
		formData.append('coverImage', coverImage);
		formData.append('profileImage', profileImage);

		axios
			.patch('/user', formData, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(updatedUserSuccess(response.data.user));
			})
			.catch((err) => {
				dispatch(errorHandler(err, updatedUserFail));
			});
	};
};

export const bookmarkPost = (postId, token) => {
	return (dispatch) => {
		axios
			.patch(`/posts/${postId}/bookmark`, null, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				dispatch(
					bookmarkPostSuccess(
						response.data.message,
						response.data.bookmarkedPosts
					)
				);
			})
			.catch((err) => {
				dispatch(errorHandler(err, bookmarkPostFail));
			});
	};
};
