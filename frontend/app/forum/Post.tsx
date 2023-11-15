"use client";

import { useState } from "react";
import styles from "./Post.module.css";
import clsx from "clsx";

const Post: React.FC<{
  fullName: string;
  username: string;
  content: string;
  likes: number;
  commentCount: number;
  date: Date;
}> = ({ fullName, username, content, likes, commentCount, date }) => {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.profilePicture}>
            <i className="symbol">person</i>
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.name}>{fullName}</div>
          <div className={styles.subtext}>
            @{username} <b>·</b> {date.toDateString()}
          </div>
        </div>
        <div className={styles.right}>
          <i className="symbol">more_vert</i>
        </div>
      </div>
      <p className={styles.content}>{content}</p>
      <div className={styles.bottom}>
        <div className={styles.bottomItem}>
          <i
            className={clsx(
              "symbol",
              styles.bottomItemButton,
              styles.likeButton,
              isLiked && styles.liked
            )}
            onClick={() => setIsLiked((prev) => !prev)}
            title="Like"
          >
            favorite
          </i>
          <div>{likes + (isLiked ? 1 : 0)}</div>
        </div>
        <div className={styles.bottomItem}>
          <i
            className={clsx(
              "symbol",
              styles.bottomItemButton,
              styles.commentButton
            )}
            title="Like"
          >
            comment
          </i>
          <div>{commentCount}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
