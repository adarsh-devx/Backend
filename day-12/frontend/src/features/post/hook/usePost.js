import { createPost, getFeed, likePost, unlikePost } from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setLoading, post, setPost, feed, setFeed } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    const data = await getFeed();
    setFeed(data.posts);
    setLoading(false);
  };

  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    const data = await createPost(imageFile, caption);
    setLoading(false);
    return data; // bas return karo, Feed mount hote hi khud fetch karega
  };

  const handleLikePost = async (postId) => {
    setLoading(true);
    const data = await likePost(postId);
    await handleGetFeed()
    
    return data;
  }

  const handleUnlikePost = async (postId) => {
    setLoading(true);
    const data = await unlikePost(postId);
    await handleGetFeed()
    
    return data;
  }

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
