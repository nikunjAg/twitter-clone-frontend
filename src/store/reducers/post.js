import * as actionTypes from '../actions/actionTypes';
import {
	updatedObject,
	checkAndUpdatePost,
	checkAndUpdateInPostArray,
	checkAndDeletePost,
	checkAndDeleteFromPostArray,
} from '../utility';

const initialState = {
	currentPost: null,
	posts: [],
	error: null,
	loading: false,
};

const fetchFeedStart = (state, action) => {
	return updatedObject(state, {
		currentPost: null,
		posts: [],
		loading: true,
		error: null,
	});
};

const fetchFeedSuccess = (state, action) => {
	return updatedObject(state, { posts: action.posts, loading: false });
};

const fetchFeedFail = (state, action) => {
	return updatedObject(state, { loading: false, error: action.error });
};

const createPostStart = (state, action) => {
	return updatedObject(state, {
		loading: true,
		error: null,
	});
};

const createPostSuccess = (state, action) => {
	return updatedObject(state, {
		loading: false,
		error: null,
		posts: [action.post].concat(state.posts),
	});
};

const createPostFail = (state, action) => {
	return updatedObject(state, { loading: false, error: action.error });
};

const getPostStart = (state, action) => {
	return updatedObject(state, {
		currentPost: null,
		error: null,
		loading: true,
	});
};

const getPostSuccess = (state, action) => {
	return updatedObject(state, { currentPost: action.post, loading: false });
};

const getPostFail = (state, action) => {
	return updatedObject(state, { error: action.error, loading: false });
};

const likePostSuccess = (state, action) => {
	let updatedCurrentPost = checkAndUpdatePost(state.currentPost, action.post);
	const updatedPosts = checkAndUpdateInPostArray(state.posts, action.post);

	return updatedObject(state, {
		currentPost: updatedCurrentPost,
		posts: updatedPosts,
	});
};

const likePostFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const retweetPostSuccess = (state, action) => {
	const updatedCurrentPost = checkAndUpdatePost(state.currentPost, action.post);
	const updatedPosts = checkAndUpdateInPostArray(state.posts, action.post);

	return updatedObject(state, {
		currentPost: updatedCurrentPost,
		posts: updatedPosts,
	});
};

const retweetPostFail = (state, action) => {
	return updatedObject(state, {
		error: action.error,
	});
};

const deleteRetweetSuccess = (state, action) => {
	const updatedCurrentPost = checkAndUpdatePost(state.currentPost, action.post);
	const updatedPosts = checkAndUpdateInPostArray(state.posts, action.post);

	return updatedObject(state, {
		currentPost: updatedCurrentPost,
		posts: updatedPosts,
	});
};

const deleteRetweetFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const quotePostSuccess = (state, action) => {
	const updatedCurrentPost = checkAndUpdatePost(
		state.currentPost,
		action.parentPost
	);
	const updatedPosts = checkAndUpdateInPostArray(
		state.posts,
		action.parentPost
	);
	updatedPosts.unshift(action.post);

	return updatedObject(state, {
		currentPost: updatedCurrentPost,
		posts: updatedPosts,
	});
};

const quotePostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const replyPostSuccess = (state, action) => {
	let updatedCurrentPost = checkAndUpdatePost(
		state.currentPost,
		action.parentPost
	);

	if (
		updatedCurrentPost &&
		updatedCurrentPost._id &&
		updatedCurrentPost._id.toString() === action.parentPost._id.toString()
	) {
		updatedCurrentPost = {
			...updatedCurrentPost,
			comments: [action.post].concat(updatedCurrentPost.comments),
		};
	}

	const updatedPosts = checkAndUpdateInPostArray(
		state.posts,
		action.parentPost
	);
	updatedPosts.unshift(action.post);

	return updatedObject(state, {
		currentPost: updatedCurrentPost,
		posts: updatedPosts,
		error: null,
	});
};

const replyPostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const deletePostSuccess = (state, action) => {
	const updatedCurrentPost = checkAndDeletePost(state.currentPost, action.post);
	const updatedPosts = checkAndDeleteFromPostArray(state.posts, action.post);

	return updatedObject(state, {
		currentPost: updatedCurrentPost,
		posts: updatedPosts,
		error: null,
	});
};

const deletePostFail = (state, action) => {
	return updatedObject(state, { error: action.error });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.FETCH_FEED_START:
			return fetchFeedStart(state, action);
		case actionTypes.FETCH_FEED_SUCCESS:
			return fetchFeedSuccess(state, action);
		case actionTypes.FETCH_FEED_FAIL:
			return fetchFeedFail(state, action);
		case actionTypes.CREATE_POST_START:
			return createPostStart(state, action);
		case actionTypes.CREATE_POST_SUCCESS:
			return createPostSuccess(state, action);
		case actionTypes.CREATE_POST_FAIL:
			return createPostFail(state, action);
		case actionTypes.GET_POST_START:
			return getPostStart(state, action);
		case actionTypes.GET_POST_SUCCESS:
			return getPostSuccess(state, action);
		case actionTypes.GET_POST_FAIL:
			return getPostFail(state, action);
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
// 474
