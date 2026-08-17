import React, { useState, useRef } from "react";
import { usePost } from "../hook/usePost";
import { useNavigate } from "react-router";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageInputRef = useRef(null);

  const {loading , handleCreatePost } = usePost();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = postImageInputRef.current.files[0]
    const res = await handleCreatePost(file, caption);
    if (res) {
      setCaption("");
      navigate('/');
    }
  }

  if (loading) {
    return (
      <main>
        <h1>Creating post.....</h1>
      </main>
    )
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}> 
          <label htmlFor="postImage">Choose Image</label>
          <input ref={postImageInputRef}  type="file" name="postImage" id="postImage" />
          <label htmlFor="caption">Caption</label>
          <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
            type="text"
            name="caption"
            id="caption"
            placeholder="Enter caption..."
          />
          <button className="button primary-btn submit-btn">Post</button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
