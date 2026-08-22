import { useState, useMemo } from "react";
import { PostContext } from "./context";

export const PostContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [feed, setFeed] = useState(null);

  const contextValue = useMemo(
    () => ({ loading, setLoading, post, setPost, feed, setFeed }),
    [loading, post, feed]
  );

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
};
