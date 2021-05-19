export const updatedObject = (initialState, updatedState) => {
	return {
		...initialState,
		...updatedState,
	};
};

export const checkAndUpdatePost = (currentPost, newPost) => {
	if (!currentPost) return currentPost;
	else if (!currentPost._id) {
		// Means data is not populated
		return currentPost;
	} else if (currentPost._id.toString() === newPost._id.toString()) {
		// Then we have to directly update this post
		return {
			...currentPost,
			...newPost,
			comments: currentPost.comments,
		};
	} else if (
		currentPost.isQuotePost &&
		currentPost.quoteData?._id?.toString() === newPost._id.toString()
	) {
		// This means we have a quoteData update
		return { ...currentPost, quoteData: newPost };
	} else if (currentPost.replyTo?._id?.toString() === newPost._id.toString()) {
		// this means we have a replyTo section update
		return { ...currentPost, replyTo: newPost };
	} else {
		// We can also check the comments section
		return {
			...currentPost,
			comments: checkAndUpdateInPostArray(currentPost.comments, newPost),
		};
	}
};

export const checkAndUpdateInPostArray = (posts, newPost) => {
	if (!posts || posts.length === 0) return posts;
	else if (!posts[0]._id) {
		// Means data is not populated
		return [...posts];
	} else {
		const updatedPosts = [];
		for (let post of posts) {
			updatedPosts.push(checkAndUpdatePost(post, newPost));
		}
		return updatedPosts;
	}
};

export const checkAndDeletePost = (currentPost, deletePost) => {
	if (!currentPost) return currentPost;
	else if (!currentPost._id) {
		// means not populated
		return currentPost;
	} else if (currentPost._id.toString() === deletePost._id.toString()) {
		return null;
	} else if (
		currentPost.isQuotePost &&
		currentPost.quoteData?._id?.toString() === deletePost._id.toString()
	) {
		return { ...currentPost, quoteData: null };
	} else if (
		currentPost.replyTo?._id?.toString() === deletePost._id.toString()
	) {
		return { ...currentPost, replyTo: null };
	} else {
		return {
			...currentPost,
			comments: checkAndDeleteFromPostArray(currentPost.comments, deletePost),
		};
	}
};

export const checkAndDeleteFromPostArray = (posts, deletePost) => {
	if (!posts || posts.length === 0) return posts;
	else if (!posts[0]._id) return [...posts];
	else {
		const updatedPosts = [];
		for (let post of posts) {
			// if (post._id?.toString() === deletePost._id.toString()) {
			// Do nothing as we have to delete this post
			// } else {
			// Means when the post is not populated(no _id field)
			// or post id do not match try deleting the nested field if id matches
			// }
			const updatedPost = checkAndDeletePost(post, deletePost);
			// Means updatedPost exists
			if (updatedPost) updatedPosts.push(updatedPost);
		}
		return updatedPosts;
	}
};

export const addPostAtProfilePostsStart = (
	profile,
	postType,
	newPost,
	parentPost
) => {
	if (!profile) return profile;
	else if (!profile._id) return profile;
	else {
		switch (postType) {
			case 'NEW_POST':
				return {
					...profile,
					tweets: [newPost].concat(profile.tweets),
				};
			case 'LIKE_POST':
			case 'DISLIKE_POST':
				console.log(postType);
				return {
					...profile,
					tweets: checkAndUpdateInPostArray(profile.tweets, newPost),
					comments: checkAndUpdateInPostArray(profile.comments, newPost),
					likes:
						postType === 'LIKE_POST'
							? [newPost].concat(profile.likes)
							: checkAndDeleteFromPostArray(profile.likes, newPost),
					quoteTweets: checkAndUpdateInPostArray(profile.quoteTweets, newPost),
					retweets: checkAndUpdateInPostArray(profile.retweets, newPost),
				};
			case 'RETWEET_POST':
				return {
					...profile,
					tweets: checkAndUpdateInPostArray(profile.tweets, newPost),
					comments: checkAndUpdateInPostArray(profile.comments, newPost),
					likes: checkAndUpdateInPostArray(profile.likes, newPost),
					quoteTweets: checkAndUpdateInPostArray(profile.quoteTweets, newPost),
					retweets: [newPost].concat(profile.retweets),
				};
			case 'DELETE_RETWEET_POST':
				return {
					...profile,
					tweets: checkAndUpdateInPostArray(profile.tweets, newPost),
					comments: checkAndUpdateInPostArray(profile.comments, newPost),
					likes: checkAndUpdateInPostArray(profile.likes, newPost),
					quoteTweets: checkAndUpdateInPostArray(profile.quoteTweets, newPost),
					retweets: checkAndDeleteFromPostArray(profile.retweets, newPost),
				};
			case 'QUOTE_POST':
				// As quote post will only update quote count
				return {
					...profile,
					quoteTweets: [newPost].concat(profile.quoteTweets),
				};
			case 'REPLY_POST':
				return {
					...profile,
					tweets: checkAndUpdateInPostArray(profile.tweets, parentPost),
					comments: [newPost].concat(
						checkAndUpdateInPostArray(profile.comments, parentPost)
					),
					likes: checkAndUpdateInPostArray(profile.likes, parentPost),
					quoteTweets: checkAndUpdateInPostArray(
						profile.quoteTweets,
						parentPost
					),
					retweets: checkAndUpdateInPostArray(profile.retweets, parentPost),
				};
			case 'DELETE_POST':
				return {
					...profile,
					tweets: checkAndDeleteFromPostArray(profile.tweets, newPost),
					comments: checkAndDeleteFromPostArray(profile.comments, newPost),
					likes: checkAndDeleteFromPostArray(profile.likes, newPost),
					quoteTweets: checkAndDeleteFromPostArray(
						profile.quoteTweets,
						newPost
					),
					retweets: checkAndDeleteFromPostArray(profile.retweets, newPost),
				};
			default:
				return profile;
		}
	}
};
