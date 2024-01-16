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

const PostList: React.FC<{ username: string }> = (params) => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    (async () => {
      if (userId && !posts.length) {
        const posts = await fetchPosts(userId, params.username);
        if (posts) {
          setPosts(posts);
        } else {
          console.error("Failed to fetch recent posts :(");
        }
      }
    })();
  }, [posts]);
  return (
    <div className={styles.container}>
      {posts.length && userId ? (
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
          />
        ))
      ) : (
        <div>Posts aan het ophalen...</div>
      )}
    </div>
  );
};

export default PostList;
