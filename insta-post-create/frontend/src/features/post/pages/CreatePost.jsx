import React, { useState, useRef, useEffect } from "react";
import { usePost } from "../hook/usePost";
import { useNavigate } from "react-router";
import Nav from "../../shared/components/Nav";
import "../style/createpost.scss";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const postImageInputRef = useRef(null);

  const { loading, handleCreatePost } = usePost();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadZoneClick = () => {
    postImageInputRef.current.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUploadZoneClick();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = postImageInputRef.current.files[0];
    if (!file) {
      alert("Please select an image first!");
      return;
    }
    const res = await handleCreatePost(file, caption);
    if (res) {
      setCaption("");
      setImagePreview(null);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner"></div>
        <h1>Creating post...</h1>
      </main>
    );
  }

  return (
    <main className="create-post-page">
      <Nav />

      <div className="create-container">
        <h1>Create Post</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Custom Upload Zone */}
          <div
            className="upload-zone"
            onClick={handleUploadZoneClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Upload post image"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="preview-img" />
            ) : (
              <>
                <span className="upload-icon">📸</span>
                <p>Choose Image</p>
              </>
            )}
          </div>
          
          <input
            ref={postImageInputRef}
            type="file"
            name="postImage"
            id="postImage"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <div className="input-group">
            <label htmlFor="caption">Caption</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              type="text"
              name="caption"
              id="caption"
              placeholder="Enter caption..."
            />
          </div>

          <button type="submit" className="submit-btn">Post</button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
