"use client";

import styles from "./page.module.css";
import PostComponent from "./Post";
import Column from "./Column";
import clsx from "clsx";
import { useState } from "react";
import { PostSummary } from "@/models/postSummary";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const recentPostCap = 100;
type ordering = "recent" | "popular";

async function fetchPosts(
  userId: number,
  orderby: ordering = "recent",
  limit: number = recentPostCap
): Promise<PostSummary[]> {
  const resp = await fetch(
    `/api/forum/posts/feed?userid=${userId}&orderby=${orderby}&limit=${limit}`
  );
  const posts = await resp.json();
  return posts;
}

async function submitPost(
  userId: number,
  content: string
): Promise<PostSummary> {
  const resp = await fetch(`/api/forum/posts/create?userid=${userId}`, {
    method: "POST",
    body: JSON.stringify(content),
  });
  return resp.json();
}

const Page = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);
  const [postContent, setPostContent] = useState("");

  const session = useSession();
  const userId = session.data?.user.id;

  // The api currently loads all the posts in the database at once, so we can
  // sort the post on the client side. This should happen on the server in the
  // future.
  const popularPosts = Array.from(recentPosts);
  popularPosts.sort(
    (a, b) => b.reactionCount - a.reactionCount || b.upvoteCount - a.upvoteCount
  );

  useEffect(() => {
    (async () => {
      if (userId && !recentPosts.length) {
        const posts = await fetchPosts(userId, "recent");
        if (posts) {
          setRecentPosts(posts);
        } else {
          console.error("Failed to fetch recent posts :(");
        }
      }
    })();
  }, [recentPosts]);

  useEffect(() => {
    (async () => {
      if (clickedSubmit && postContent && userId) {
        const createdPost = await submitPost(userId, postContent);
        setRecentPosts((prev) => [createdPost, ...prev]);
        setShowCreatePost(false);
      }
      setClickedSubmit(false);
    })();
  }, [clickedSubmit, postContent]);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Forum{" "}
          <i
            onClick={() => setShowCreatePost(true)}
            title="Maak post"
            className={clsx("symbol", styles.createPostButton)}
          >
            add
          </i>
        </h1>
      </div>
      <div className={styles.columns}>
        <Column title="Recent">
          {recentPosts.length && userId ? (
            recentPosts.map((post) => (
              <PostComponent
                key={post.id}
                userId={userId}
                profilePhotoURL={post.user.profilePhotoURL}
                postId={post.id}
                firstName={post.user.firstName}
                lastName={post.user.lastName}
                username={post.user.username}
                content={post.content}
                upvoteCount={post.upvoteCount}
                reactionCount={post.reactionCount}
                date={new Date(post.date)}
                isUpvoted={post.isUpvoted}
              />
            ))
          ) : (
            <div>Posts aan het ophalen...</div>
          )}
        </Column>
        <Column title="Populair">
          {popularPosts.length && userId ? (
            popularPosts.map((post) => (
              <PostComponent
                key={post.id}
                userId={userId}
                postId={post.id}
                firstName={post.user.firstName}
                lastName={post.user.lastName}
                username={post.user.username}
                profilePhotoURL={post.user.profilePhotoURL}
                content={post.content}
                upvoteCount={post.upvoteCount}
                reactionCount={post.reactionCount}
                date={new Date(post.date)}
                isUpvoted={post.isUpvoted}
              />
            ))
          ) : (
            <div>Posts aan het ophalen...</div>
          )}
        </Column>
      </div>
      {showCreatePost && (
        <div className={styles.createPost}>
          <div className={styles.dialog}>
            <textarea
              rows={6}
              cols={36}
              className={styles.input}
              content={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <div className={styles.dialogButtons}>
              <div
                onClick={() => setShowCreatePost(false)}
                className={styles.secondaryButton}
              >
                Sluiten
              </div>
              <div
                className={styles.button}
                onClick={() => setClickedSubmit(true)}
              >
                Maak post
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
