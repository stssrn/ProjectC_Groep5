"use client";

import styles from "./PostList.module.css";
import { PostSummary } from "@/models/postSummary";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Post from "../Post";

async function fetchPosts(
  userId: number,
  username: string,
  limit: number = 100
): Promise<PostSummary[]> {
  const resp = await fetch(
    `/api/forum/gebruiker/${username}?userid=${userId}&limit=${limit}`
  );
  const posts = await resp.json();
  return posts;
}

const PostList: React.FC<{ username: string }> = (props) => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [userHasNoPosts, setUserHasNoPosts] = useState(false);
  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    if (userId && !userHasNoPosts && !posts.length) {
      fetchPosts(userId, props.username)
        .then((posts) => {
          if (posts.length === 0) {
            setUserHasNoPosts(true);
            return;
          }
          setPosts(posts);
        })
        .catch(() => console.error("Failed to fetch recent posts :("));
    }
  }, [posts]);
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
