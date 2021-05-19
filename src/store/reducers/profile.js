import * as actionTypes from '../actions/actionTypes';
import { updatedObject, addPostAtProfilePostsStart } from '../utility';

const initialState = {
	profile: null,
	invalidProfile: false,
	loading: false,
	error: null,
};

const getProfileStart = (state, action) => {
	return updatedObject(state, {
		loading: true,
		error: null,
		profile: null,
		invalidProfile: false,
	});
};

const getProfileSuccess = (state, action) => {
	return updatedObject(state, { loading: false, profile: action.userData });
};

const getProfileFail = (state, action) => {
	return updatedObject(state, {
		invalidProfile: true,
		loading: false,
		error: action.error,
	});
};

const createPostStart = (state, action) => {
	return updatedObject(state, {
		loading: true,
		error: null,
	});
};

const createPostSuccess = (state, action) => {
	return updatedObject(state, {
		loading: true,
		error: null,
		profile: addPostAtProfilePostsStart(state.profile, 'NEW_POST', action.post),
	});
};

const createPostFail = (state, action) => {
	return updatedObject(state, { loading: false, error: action.error });
};

const likePostSuccess = (state, action) => {
	const updatedProfile = addPostAtProfilePostsStart(
		state.profile,
		action.result,
		action.post
	);

	return updatedObject(state, {
		profile: updatedProfile,
	});
};

const likePostFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const retweetPostSuccess = (state, action) => {
	const updatedProfile = addPostAtProfilePostsStart(
		state.profile,
		'RETWEET_POST',
		action.post
	);
	return updatedObject(state, {
		profile: updatedProfile,
	});
};

const retweetPostFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const deleteRetweetSuccess = (state, action) => {
	const updatedProfile = addPostAtProfilePostsStart(
		state.profile,
		'DELETE_RETWEET_POST',
		action.post
	);

	return updatedObject(state, {
		profile: updatedProfile,
	});
};

const deleteRetweetFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const quotePostSuccess = (state, action) => {
	const updatedProfile = addPostAtProfilePostsStart(
		state.profile,
		'QUOTE_POST',
		action.post
	);

	return updatedObject(state, {
		profile: updatedProfile,
	});
};

const quotePostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const replyPostSuccess = (state, action) => {
	const updatedProfile = addPostAtProfilePostsStart(
		state.profile,
		'REPLY_POST',
		action.post,
		action.parentPost
	);

	return updatedObject(state, {
		profile: updatedProfile,
		error: null,
	});
};

const replyPostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const deletePostSuccess = (state, action) => {
	const updatedProfile = addPostAtProfilePostsStart(
		state.profile,
		'DELETE_POST',
		action.post
	);

	return updatedObject(state, {
		profile: updatedProfile,
		error: null,
	});
};

const deletePostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const followUserSuccess = (state, action) => {
	if (!state.profile) return state;
	let updatedFollowers = state.profile.followers;
	let updatedFollowing = state.profile.following;
	if (state.profile?._id?.toString() === action.user._id.toString()) {
		updatedFollowers = action.user.followers;
		updatedFollowing = action.user.following;
	} else if (
		state.profile?._id?.toString() === action.otherUser._id.toString()
	) {
		updatedFollowers = action.otherUser.followers;
		updatedFollowing = action.otherUser.following;
	}

	const updatedProfile = updatedObject(state.profile, {
		followers: updatedFollowers,
		following: updatedFollowing,
	});

	return updatedObject(state, {
		profile: updatedProfile,
	});
};

const followUserFail = (state, action) => {
	if (!state.profile) return state;
	return updatedObject(state, {
		error: action.error,
	});
};

const getUserLinksStart = (state, action) => {
	console.log('YEs');
	return updatedObject(state, { loading: true, error: null });
};

const getUserLinksSuccess = (state, action) => {
	/* const updatedProfile = updatedObject(state.profile, {
		followers: action.user.followers,
		following: action.user.following,
	}); */

	return updatedObject(state, {
		profile: state.user,
	});
};

const getUserLinksFail = (state, action) => {
	return updatedObject(state, { loading: false, error: action.error });
};

const userUpdateSuccess = (state, action) => {
	if (state.profile._id.toString() === action.user._id.toString()) {
		return updatedObject(state, { profile: action.user });
	}
	return state;
};

const userUpdateFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_PROFILE_START:
			return getProfileStart(state, action);
		case actionTypes.GET_PROFILE_SUCCESS:
			return getProfileSuccess(state, action);
		case actionTypes.GET_PROFILE_FAIL:
			return getProfileFail(state, action);
		case actionTypes.CREATE_POST_START:
			return createPostStart(state, action);
		case actionTypes.CREATE_POST_SUCCESS:
			return createPostSuccess(state, action);
		case actionTypes.CREATE_POST_FAIL:
			return createPostFail(state, action);
		case actionTypes.LIKE_POST_SUCCESS:
			return likePostSuccess(state, action);
		case actionTypes.LIKE_POST_FAIL:
			return likePostFail(state, action);
		case actionTypes.RETWEET_POST_SUCCESS:
			return retweetPostSuccess(state, action);
		case actionTypes.RETWEET_POST_FAIL:
			return retweetPostFail(state, action);
		case actionTypes.QUOTE_POST_SUCCESS:
			return quotePostSuccess(state, action);
		case actionTypes.QUOTE_POST_FAIL:
			return quotePostFail(state, action);
		case actionTypes.DELETE_RETWEET_SUCCESS:
			return deleteRetweetSuccess(state, action);
		case actionTypes.DELETE_RETWEET_FAIL:
			return deleteRetweetFail(state, action);
		case actionTypes.REPLY_POST_SUCCESS:
			return replyPostSuccess(state, action);
		case actionTypes.REPLY_POST_FAIL:
			return replyPostFail(state, action);
		case actionTypes.DELETE_POST_SUCCESS:
			return deletePostSuccess(state, action);
		case actionTypes.DELETE_POST_FAIL:
			return deletePostFail(state, action);
		case actionTypes.FOLLOW_USER_SUCCESS:
			return followUserSuccess(state, action);
		case actionTypes.FOLLOW_USER_FAIL:
			return followUserFail(state, action);
		case actionTypes.GET_USER_LINKS_START:
			return getUserLinksStart(state, action);
		case actionTypes.GET_USER_LINKS_SUCCESS:
			return getUserLinksSuccess(state, action);
		case actionTypes.GET_USER_LINKS_FAIL:
			return getUserLinksFail(state, action);
		case actionTypes.USER_UPDATE_SUCCESS:
			return userUpdateSuccess(state, action);
		case actionTypes.USER_UPDATE_FAIL:
			return userUpdateFail(state, action);
		default:
			return state;
	}
};

export default reducer;
