import React, { useState, useEffect, useCallback } from "react";
import Post from "../components/Post";
import { usePost } from "../hook/usePost";
import Nav from "../../shared/components/Nav";
import {
  getAllUsers,
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
} from "../../follow/services/follow.api";
import "../style/feed.scss";
import "../../follow/style/users.scss";

const Feed = () => {
  const { feed, handleGetFeed, loading: feedLoading } = usePost();
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowData = useCallback(async () => {
    try {
      setLoading(true);
      const [allUsersRes, followingRes, followersRes] = await Promise.all([
        getAllUsers(),
        getFollowing(),
        getFollowers(),
      ]);
      setUsers(allUsersRes.users || []);
      setFollowing(followingRes.users || []);
      setFollowers(followersRes.users || []);
    } catch (error) {
      console.error("Error fetching follow data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowData();
    handleGetFeed();
  }, [fetchFollowData, handleGetFeed]);

  const handleFollowToggle = async (user) => {
    try {
      if (user.isFollowing) {
        await unfollowUser(user.username);
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.username === user.username ? { ...u, isFollowing: false } : u
          )
        );
        setFollowing((prev) => prev.filter((u) => u.username !== user.username));
      } else {
        await followUser(user.username);
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.username === user.username ? { ...u, isFollowing: true } : u
          )
        );
        setFollowing((prev) => [...prev, user]);
      }
    } catch (error) {
      console.error("Error in follow toggle:", error);
    }
  };

  if (loading || feedLoading) {
    return (
      <main className="loading-screen">
        <div className="spinner"></div>
        <h1>Loading space...</h1>
      </main>
    );
  }

  // Filter other users (users we do not follow)
  const otherUsers = users.filter((u) => !u.isFollowing);

  return (
    <main className="users-page">
      <Nav />
      
      <div className="split-container">
        {/* Left Panel: Social Lists */}
        <section className="left-panel">
          <div className="glass-card">
            <h2>Following ({following.length})</h2>
            <div className="user-list">
              {following.length === 0 ? (
                <p className="empty-msg">Not following anyone yet.</p>
              ) : (
                following.map((user) => (
                  <div key={user._id} className="user-row">
                    <div className="user-info">
                      <div className="avatar-wrapper">
                        <img src={user.profileImage || "https://ik.imagekit.io/adarshh/default-image.avif"} alt={user.username} />
                      </div>
                      <span className="username">@{user.username}</span>
                    </div>
                    <button className="unfollow-btn" onClick={() => handleFollowToggle({ ...user, isFollowing: true })}>
                      Unfollow
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card">
            <h2>Followers ({followers.length})</h2>
            <div className="user-list">
              {followers.length === 0 ? (
                <p className="empty-msg">No followers yet.</p>
              ) : (
                followers.map((user) => (
                  <div key={user._id} className="user-row">
                    <div className="user-info">
                      <div className="avatar-wrapper">
                        <img src={user.profileImage || "https://ik.imagekit.io/adarshh/default-image.avif"} alt={user.username} />
                      </div>
                      <span className="username">@{user.username}</span>
                    </div>
                    {users.find((u) => u.username === user.username)?.isFollowing ? (
                      <button className="unfollow-btn" onClick={() => handleFollowToggle({ ...user, isFollowing: true })}>
                        Unfollow
                      </button>
                    ) : (
                      <button className="follow-btn" onClick={() => handleFollowToggle({ ...user, isFollowing: false })}>
                        Follow back
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card">
            <h2>Suggestions</h2>
            <div className="user-list">
              {otherUsers.length === 0 ? (
                <p className="empty-msg">No new suggestions.</p>
              ) : (
                otherUsers.map((user) => (
                  <div key={user._id} className="user-row">
                    <div className="user-info">
                      <div className="avatar-wrapper suggested">
                        <img src={user.profileImage || "https://ik.imagekit.io/adarshh/default-image.avif"} alt={user.username} />
                      </div>
                      <span className="username">@{user.username}</span>
                    </div>
                    <button className="follow-btn" onClick={() => handleFollowToggle(user)}>
                      Follow
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Panel: Old Feed UI */}
        <section className="right-panel">
          <div className="feed">
            <div className="posts">
              {feed && feed.length > 0 ? (
                feed.map((post) => (
                  <Post key={post._id} user={post.user} post={post} />
                ))
              ) : (
                <p className="no-posts">No posts on feed.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Feed;
