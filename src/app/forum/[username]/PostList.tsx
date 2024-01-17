"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { PostSummary } from "@/models/postSummary";
import { fetchUserPosts } from "@/lib/fetch/fetchUserPosts";

import Post from "../Post";

import styles from "./PostList.module.css";

const PostList: React.FC<{ username: string }> = (props) => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [userHasNoPosts, setUserHasNoPosts] = useState(false);

  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    if (!userId || userHasNoPosts || posts.length) return;

    fetchUserPosts(userId, props.username)
      .then((posts) => {
        if (posts.length === 0) {
          setUserHasNoPosts(true);
          return;
        }
        setPosts(posts);
      })
      .catch(() => console.error("Failed to fetch recent posts :("));
  }, [posts, userId, props.username, userHasNoPosts]);

  return (
    <div className={styles.container}>
      {userHasNoPosts ? (
        <div className={styles.info}>Deze gebruiker heeft geen posts.</div>
      ) : posts.length && userId ? (
        posts.map((p) => (
          <Post
            key={p.id}
            postId={p.id}
            firstName={p.user.firstName}
            lastName={p.user.lastName}
            userId={userId}
            username={p.user.username}
            content={p.content}
            date={new Date(p.date)}
            profilePhotoURL={p.user.profilePhotoURL}
            upvoteCount={p.upvoteCount}
            reactionCount={p.reactionCount}
            isUpvoted={p.isUpvoted}
            showDelete={
              session.data?.user.isAdmin ||
              session.data?.user.isForumMod ||
              false
            }
          />
        ))
      ) : (
        <div className={styles.info}>Posts aan het ophalen...</div>
      )}
    </div>
  );
};

export default PostList;
