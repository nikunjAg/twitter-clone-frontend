import * as actionTypes from '../actions/actionTypes';
import {
	updatedObject,
	checkAndUpdateInPostArray,
	checkAndDeleteFromPostArray,
} from '../utility';

const initialState = {
	posts: [],
	users: [],
	error: null,
};

const searchPostsSuccess = (state, action) => {
	return updatedObject(state, { posts: action.posts });
};

const searchPostsFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const searchUsersSuccess = (state, action) => {
	return updatedObject(state, { users: action.users });
};

const searchUsersFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const likePostSuccess = (state, action) => {
	const updatedPosts = checkAndUpdateInPostArray(state.posts, action.post);

	return updatedObject(state, {
		posts: updatedPosts,
	});
};

const likePostFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const retweetPostSuccess = (state, action) => {
	const updatedPosts = checkAndUpdateInPostArray(state.posts, action.post);

	return updatedObject(state, {
		posts: updatedPosts,
	});
};

const retweetPostFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const deleteRetweetSuccess = (state, action) => {
	const updatedPosts = checkAndUpdateInPostArray(state.posts, action.post);

	return updatedObject(state, {
		posts: updatedPosts,
	});
};

const deleteRetweetFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const quotePostSuccess = (state, action) => {
	const updatedPosts = checkAndUpdateInPostArray(
		state.posts,
		action.parentPost
	);
	updatedPosts.unshift(action.post);

	return updatedObject(state, {
		posts: updatedPosts,
	});
};

const quotePostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const replyPostSuccess = (state, action) => {
	const updatedPosts = checkAndUpdateInPostArray(
		state.posts,
		action.parentPost
	);
	updatedPosts.unshift(action.post);

	return updatedObject(state, {
		posts: updatedPosts,
		error: null,
	});
};

const replyPostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const deletePostSuccess = (state, action) => {
	const updatedPosts = checkAndDeleteFromPostArray(state.posts, action.post);

	return updatedObject(state, {
		posts: updatedPosts,
		error: null,
	});
};

const deletePostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SEARCH_POSTS_SUCCESS:
			return searchPostsSuccess(state, action);
		case actionTypes.SEARCH_POSTS_FAIL:
			return searchPostsFail(state, action);
		case actionTypes.SEARCH_USERS_SUCCESS:
			return searchUsersSuccess(state, action);
		case actionTypes.SEARCH_USERS_FAIL:
			return searchUsersFail(state, action);
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
		default:
			return state;
	}
};

export default reducer;
