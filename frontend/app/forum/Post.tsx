"use client";

import { useState } from "react";
import styles from "./Post.module.css";
import clsx from "clsx";

const Post: React.FC<{
  postedBy: string;
  content: string;
  likes: number;
  date: Date;
}> = ({ postedBy, content, likes, date }) => {
  const username = postedBy.split(" ").join("");
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.profilePicture}>
            <i className="symbol">person</i>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.name}>{postedBy}</div>
          <div className={styles.date}>
            @{username} <b>·</b> {date.toDateString()}
          </div>
        </div>
        <div className={styles.right}></div>
      </div>
      <p className={styles.content}>{content}</p>
      <div className={styles.bottom}>
        <div className={styles.likes}>
          <i
            className={clsx("symbol", styles.likeButton, isLiked && styles.liked)}
            onClick={() => setIsLiked((prev) => !prev)}
            title="Like"
          >
            favorite
          </i>
          <div>{likes}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
