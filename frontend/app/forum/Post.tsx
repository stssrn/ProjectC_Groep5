"use client";

import { useEffect, useState } from "react";
import styles from "./Post.module.css";
import clsx from "clsx";
import Link from "next/link";

async function upvote(userId: number, postId: number) {
  const res = await fetch(
    `/api/forum/posts/${postId}/upvote?userid=${userId}`,
    { method: "POST" }
  );
  return res.ok;
}

async function unupvote(userId: number, postId: number) {
  const res = await fetch(
    `/api/forum/posts/${postId}/remove-upvote?userid=${userId}`,
    { method: "DELETE" }
  );
  return res.ok;
}

type Props = {
  userId: number;
  postId: number;
  firstName: string;
  lastName: string;
  username: string;
  content: string;
  date: Date;
  profilePhotoURL: string;
  upvoteCount: number;
  reactionCount: number;
  isUpvoted: boolean;
};

const Post: React.FC<Props> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(props.isUpvoted);
  const [clickedUpvote, setClickedUpvote] = useState(false);
  const postUrl = `/forum/post/${props.postId}`;

  const formatDate = Intl.DateTimeFormat("nl", {
    day: "numeric",
    month: "long",
  }).format;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showDropdown]);

  useEffect(() => {
    if (clickedUpvote) {
      if (isUpvoted) {
        setIsUpvoted(false);
        unupvote(props.userId, props.postId).then((res) => {
          if (!res) setIsUpvoted(true);
        });
      } else {
        setIsUpvoted(true);
        upvote(props.userId, props.postId).then((res) => {
          if (!res) setIsUpvoted(false);
        });
      }
      setClickedUpvote(false);
    }
  }, [clickedUpvote, isUpvoted]);

  const formattedDate = formatDate(props.date);
  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.profilePicture}>
            <img
              className={styles.profilePictureImage}
              src={props.profilePhotoURL}
            ></img>
          </div>
        </div>
        <div className={styles.userInfo}>
          <Link href={`/forum/@${props.username}`} className={styles.name}>
            {props.firstName} {props.lastName}
          </Link>
          <div className={styles.subtext}>
            <Link
              className={styles.subtextUrl}
              title="Bekijk post"
              href={postUrl}
            >
              {formattedDate}
            </Link>
          </div>
        </div>
        <div className={styles.options}>
          <i
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(true);
            }}
            className={clsx("symbol", styles.optionsSymbol)}
          >
            more_vert
          </i>
          {showDropdown && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.optionsMenu}
            >
              <ul className={styles.optionsList}>
                <li>
                  <i className={clsx("symbol", styles.listSymbol)}>flag</i>
                  <span className={styles.listText}>Rapporteer</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className={styles.content}>{props.content}</p>
      <div className={styles.bottom}>
        <div className={styles.bottomItem}>
          <i
            className={clsx(
              "symbol",
              styles.bottomItemButton,
              styles.likeButton,
              isUpvoted && styles.liked
            )}
            onClick={() => setClickedUpvote(true)}
            title="Upvote"
          >
            favorite
          </i>
          <div>
            {/* Don't count own upvote twice */}
            {props.upvoteCount - Number(props.isUpvoted) + Number(isUpvoted)}
          </div>
        </div>
        <div>
          <Link className={styles.bottomItem} href={postUrl}>
            <i
              className={clsx(
                "symbol",
                styles.bottomItemButton,
                styles.commentButton
              )}
              title="Reacties"
            >
              comment
            </i>
            {props.reactionCount}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
