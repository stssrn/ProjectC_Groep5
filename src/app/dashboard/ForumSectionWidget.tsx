"use client";

import styles from "./ForumSectionWidget.module.css";
import Container from "../components/Container";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: number;
  thumbnailUrl: string;
  title: string;
  content: string;
  userFullname: string;
  username: string;
  commentCount: number;
};

const ForumSectionWidget: React.FC<{
  className?: string;
  posts: Post[];
}> = ({ className, posts }) => (
  <section className={className}>
    <Container padding={12} title="Recente discussies">
      <div className={styles.posts}>
        {posts.map((post, i) => {
          return (
            <article key={i} className={styles.post}>
              <div className={styles.top}>
                <div className={styles.topOverlay}></div>
                <div className={styles.postImage}>
                  <Image
                    src={post.thumbnailUrl}
                    alt=""
                    height={200}
                    width={200}
                    className={styles.postImageImage}
                  />
                </div>
                <h2 className={styles.postTitle}>
                  <Link
                    href={`/forum/post/${post.id}`}
                    className={styles.postLink}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className={styles.postTopic}>{post.content}</p>
              </div>
              <div className={styles.bottom}>
                <div className={styles.bottomSection}>
                  <i className={clsx("symbol", styles.symbol)}>person</i>
                  <Link
                    href={`/forum/@${post.username}`}
                    className={styles.authorLink}
                  >
                    {post.userFullname}
                  </Link>
                </div>
                <div className={styles.bottomSection}>
                  <Link
                    href={`/forum/post/${post.id}`}
                    className={styles.postLink}
                  >
                    <i className={clsx("symbol", styles.symbol)}>message</i>
                    {post.commentCount}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Container>
  </section>
);

export default ForumSectionWidget;
