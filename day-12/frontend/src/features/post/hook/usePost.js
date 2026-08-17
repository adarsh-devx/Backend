import { createPost, getFeed, likePost, unlikePost } from "../services/post.api";
import { useContext, useCallback } from "react";
import { PostContext } from "../context";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setLoading, post, setPost, feed, setFeed } = context;

  const handleGetFeed = useCallback(async () => {
    setLoading(true);
    const data = await getFeed();
    setFeed(data.posts);
    setLoading(false);
  }, [setFeed, setLoading]);

  const handleCreatePost = useCallback(async (imageFile, caption) => {
    setLoading(true);
    const data = await createPost(imageFile, caption);
    setLoading(false);
    return data; // bas return karo, Feed mount hote hi khud fetch karega
  }, [setLoading]);

  const handleLikePost = useCallback(async (postId) => {
    setLoading(true);
    const data = await likePost(postId);
    await handleGetFeed();
    
    return data;
  }, [handleGetFeed, setLoading]);

  const handleUnlikePost = useCallback(async (postId) => {
    setLoading(true);
    const data = await unlikePost(postId);
    await handleGetFeed();
    
    return data;
  }, [handleGetFeed, setLoading]);

  return {
    handleCreatePost,
    handleGetFeed,
    handleLikePost,
    handleUnlikePost,
    loading,
    post,
    feed,
  };
};
