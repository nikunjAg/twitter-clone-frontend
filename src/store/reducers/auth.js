import * as actionTypes from '../actions/actionTypes';
import { updatedObject } from '../utility';

const initialState = {
	token: null,
	userId: null,
	name: null,
	username: null,
	profileImage: null,
	error: null,
	loading: false,
	pinnedTweet: null,
	message: '',
	followers: [],
	following: [],
	bookmarkedPosts: [],
};

const userSignupStart = (state, action) => {
	return updatedObject(state, {
		loading: true,
		userId: null,
		token: null,
		error: null,
		name: null,
		username: null,
		profileImage: null,
	});
};

const userSignupSuccess = (state, action) => {
	return updatedObject(state, {
		loading: false,
		error: null,
		token: action.token,
		...action.user,
	});
};

const userSignupFail = (state, action) => {
	return updatedObject(state, {
		loading: false,
		error: action.error,
		token: null,
		userId: null,
		name: null,
		username: null,
		profileImage: null,
	});
};

const userLogout = (state, action) => {
	const updatedState = { ...state };
	Object.keys(updatedState).forEach((key) => (updatedState[key] = null));
	return updatedState;
};

const pinPostSuccess = (state, action) => {
	// Here we can add a message that tweet has been pinned successfully

	return updatedObject(state, {
		error: null,
		message: action.message,
		pinnedTweet: action.pinnedPostId,
	});
};

const pinPostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const followUserSuccess = (state, action) => {
	return updatedObject(state, {
		followers: action.user.followers,
		following: action.user.following,
	});
};

const followUserFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const userUpdateSuccess = (state, action) => {
	return updatedObject(state, {
		name: action.user.name,
		profileImage: action.user.profileImage,
		coverImage: action.user.coverImage,
	});
};

const userUpdateFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const bookmarkPostSuccess = (state, action) => {
	return updatedObject(state, {
		error: null,
		message: action.message,
		bookmarkedPosts: action.bookmarkedPosts,
	});
};

const bookmarkPostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.USER_SIGNUP_START:
			return userSignupStart(state, action);
		case actionTypes.USER_SIGNUP_SUCCESS:
			return userSignupSuccess(state, action);
		case actionTypes.USER_SIGNUP_FAIL:
			return userSignupFail(state, action);
		case actionTypes.USER_LOGIN_START:
			return userSignupStart(state, action);
		case actionTypes.USER_LOGIN_SUCCESS:
			return userSignupSuccess(state, action);
		case actionTypes.USER_LOGIN_FAIL:
			return userSignupFail(state, action);
		case actionTypes.USER_LOGOUT:
			return userLogout(state, action);
		case actionTypes.PIN_POST_SUCCESS:
			return pinPostSuccess(state, action);
		case actionTypes.PIN_POST_FAIL:
			return pinPostFail(state, action);
		case actionTypes.FOLLOW_USER_SUCCESS:
			return followUserSuccess(state, action);
		case actionTypes.FOLLOW_USER_FAIL:
			return followUserFail(state, action);
		case actionTypes.USER_UPDATE_SUCCESS:
			return userUpdateSuccess(state, action);
		case actionTypes.USER_UPDATE_FAIL:
			return userUpdateFail(state, action);
		case actionTypes.BOOKMARK_POST_SUCCESS:
			return bookmarkPostSuccess(state, action);
		case actionTypes.BOOKMARK_POST_FAIL:
			return bookmarkPostFail(state, action);
		default:
			return state;
	}
};

export default reducer;
