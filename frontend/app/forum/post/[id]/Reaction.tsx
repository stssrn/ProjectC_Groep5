"use client";

import { useEffect, useState } from "react";
import styles from "./Reaction.module.css";
import clsx from "clsx";

async function upvote(userId: number, reactionId: number) {
  const res = await fetch(
    `/api/forum/reaction/${reactionId}/upvote?userid=${userId}`,
    { method: "POST" }
  );
  return res.ok;
}

async function unupvote(userId: number, reactionId: number) {
  const res = await fetch(
    `/api/forum/reaction/${reactionId}/remove-upvote?userid=${userId}`,
    { method: "DELETE" }
  );
  return res.ok;
}

type Props = {
  userId: number;
  profilePhotoURL: string;
  reactionId: number;
  firstName: string;
  lastName: string;
  userName: string;
  content: string;
  date: Date;
  upvoteCount: number;
  isUpvoted: boolean;
};

const Reply: React.FC<Props> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(props.isUpvoted);
  const [clickedUpvote, setClickedUpvote] = useState(false);

  const formattedDate = Intl.DateTimeFormat("nl", {
    day: "numeric",
    month: "long",
  }).format(props.date);

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
        unupvote(props.userId, props.reactionId).then((res) => {
          if (!res) setIsUpvoted(true);
        });
      } else {
        setIsUpvoted(true);
        upvote(props.userId, props.reactionId).then((res) => {
          if (!res) setIsUpvoted(false);
        });
      }
      setClickedUpvote(false);
    }
  }, [clickedUpvote, isUpvoted]);

  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.profilePicture}>
            <img src={props.profilePhotoURL} />
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.name}>
            {props.firstName} {props.lastName}
          </div>
          <div className={styles.subtext}>{formattedDate}</div>
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
            title="Like"
          >
            favorite
          </i>
          <div>
            {props.upvoteCount - Number(props.isUpvoted) + Number(isUpvoted)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
