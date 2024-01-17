"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { PostSummary } from "@/models/postSummary";
import { submitPost, getFeed } from "@/lib/fetch/post";

import PostComponent from "./Post";
import Column from "./Column";

import styles from "./page.module.css";

const createPostComponent =
  // eslint doesn't like currying
  // eslint-disable-next-line react/display-name
  (session: ReturnType<typeof useSession>) => (post: PostSummary) =>
    (
      <PostComponent
        key={post.id}
        userId={session.data!.user.id}
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
        showDelete={session.data!.user.isAdmin || false}
      />
    );

const Page = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);
  const [postContent, setPostContent] = useState("");

  const session = useSession();
  const userId = session.data?.user.id;

  const popularPosts = Array.from(recentPosts);
  const columns = [
    { name: "Recent", posts: recentPosts },
    { name: "Populair", posts: popularPosts },
  ];

  // The api currently loads all the posts in the database at once, so we can
  // sort the post on the client side. This should happen on the server in the
  // future.
  popularPosts.sort(
    (a, b) => b.reactionCount - a.reactionCount || b.upvoteCount - a.upvoteCount
  );

  // Get recent post feed
  useEffect(() => {
    if (!userId || recentPosts.length) return;

    getFeed(userId, "recent")
      .then(setRecentPosts)
      .catch(() => {
        console.error("Failed to fetch recent posts :(");
      });
  }, [recentPosts, userId]);

  // Submit post
  useEffect(() => {
    if (!clickedSubmit || !postContent || !userId) {
      setClickedSubmit(false);
      return;
    }

    submitPost(userId, postContent).then((createdPost) => {
      setRecentPosts((prev) => [createdPost, ...prev]);
      setShowCreatePost(false);
      setClickedSubmit(false);
    });
  }, [clickedSubmit, postContent, userId]);

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
        {columns.map((col) => (
          <Column key={col.name} title={col.name}>
            {col.posts.length ? (
              col.posts.map(createPostComponent(session))
            ) : (
              <div className={styles.loading}>Posts aan het ophalen...</div>
            )}
          </Column>
        ))}
      </div>

      {showCreatePost && (
        <div className={styles.createPost}>
          <div className={styles.dialog}>
            <textarea
              className={styles.input}
              rows={6}
              cols={36}
              content={postContent}
              disabled={clickedSubmit}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <div className={styles.dialogButtons}>
              <div
                className={styles.secondaryButton}
                onClick={() => setShowCreatePost(false)}
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
