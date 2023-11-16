"use client";

import styles from "./page.module.css";
import Post from "./Post";
import { posts } from "@/lib/posts";
import Column from "./Column";
import clsx from "clsx";
import { useState } from "react";

const Page = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const popularPosts = Array.from(posts);
  popularPosts.sort((a, b) => b.likes - a.likes);

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
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Column>
        <Column title="Populair">
          {popularPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Column>
      </div>
      {showCreatePost && (
        <div className={styles.createPost}>
          <div className={styles.dialog}>
            <textarea rows={6} cols={36} className={styles.input}></textarea>
            <div className={styles.dialogButtons}>
              <div
                onClick={() => setShowCreatePost(false)}
                className={styles.secondaryButton}
              >
                Sluiten
              </div>
              <div className={styles.button}>Maak post</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
