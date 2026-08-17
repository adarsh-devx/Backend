import React from "react";
import { usePost } from "../hook/usePost";

const Post = ({ user, post }) => {
  const { handleLikePost, handleUnlikePost } = usePost();

  const handleLike = () => {
    handleLikePost(post._id);
  };

  const handleUnlike = () => {
    handleUnlikePost(post._id);
  };

  return (
    <div className="post">
      <div className="user">
        <div className="img-wrapper">
          <img src={user.profileImage} alt={user.username} />
        </div>
        <p>{user.username}</p>
      </div>
      <img src={post.imgURL} alt={post.caption} />
      <div className="icons">
        <div className="left">
          <button
            onClick={() => {
              post.isLiked ? handleUnlike(post._id) : handleLike(post._id);
            }}
            aria-label={post.isLiked ? "Unlike post" : "Like post"}
          >
            <svg
              className={post.isLiked ? "like" : ""}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 4.5C14.4 2.4 18 2.5 20.2 4.8C22.5 7 22.6 10.6 20.5 13L12 21.5L3.5 13C1.4 10.6 1.5 7 3.8 4.8C6 2.5 9.6 2.4 12 4.5ZM18.8 6.2C17.3 4.7 14.9 4.6 13.3 6L12 7.2L10.7 6C9.1 4.6 6.7 4.7 5.2 6.2C3.7 7.7 3.6 10 5 11.6L12 18.7L19 11.6C20.4 10 20.3 7.7 18.8 6.2Z"></path>
            </svg>
          </button>
          <button aria-label="Comment">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.3 20.8L2 22L3.2 16.7C2.4 15.3 2 13.7 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C10.3 22 8.7 21.6 7.3 20.8ZM7.6 18.7L8.2 19.1C9.4 19.7 10.7 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12C4 13.3 4.3 14.6 4.9 15.8L5.3 16.4L4.6 19.4L7.6 18.7Z"></path>
            </svg>
          </button>
          <button aria-label="Share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.5 2C20.1 2 20.7 2.2 21.2 2.5C22.9 3.4 23.5 5.6 22.5 7.3L15 20.2C14.1 21.9 11.9 22.5 10.2 21.5C9.4 21 8.9 20.3 8.6 19.4L6.9 12.8L2 8C0.7 6.6 0.7 4.4 2 3C2.7 2.4 3.5 2 4.5 2H19.5ZM4.5 4C4.1 4 3.7 4.2 3.4 4.4C2.9 5 2.9 6 3.4 6.6L7.9 11L14.9 7C15.4 6.7 16 6.9 16.3 7.4C16.5 7.9 16.4 8.5 15.9 8.7L8.9 12.8L10.6 18.9C10.7 19.3 10.9 19.6 11.2 19.8C11.9 20.2 12.9 20 13.3 19.2L20.8 6.3C21.2 5.5 21 4.6 20.2 4.2C20 4.1 19.8 4 19.5 4H4.5Z"></path>
            </svg>
          </button>
        </div>
        <div className="right">
          <button aria-label="Save">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 2H19C19.6 2 20 2.4 20 3V22.1C20 22.4 19.8 22.6 19.5 22.6C19.4 22.6 19.3 22.6 19.2 22.6L12 18L4.8 22.6C4.5 22.7 4.2 22.6 4.1 22.4C4 22.3 4 22.2 4 22.1V3C4 2.4 4.4 2 5 2ZM18 4H6V19.4L12 15.7L18 19.4V4Z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="bottom">
        <p className="caption">{post.caption}</p>
      </div>
    </div>
  );
};

export default Post;
