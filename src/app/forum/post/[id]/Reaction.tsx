"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

import { upvotePost } from "@/lib/fetch/upvotePost";
import { removeUpvotePost } from "@/lib/fetch/removeUpvotePost";

import styles from "./Reaction.module.css";

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
  const [isUpvoted, setIsUpvoted] = useState(props.isUpvoted);
  const [clickedUpvote, setClickedUpvote] = useState(false);

  const formattedDate = Intl.DateTimeFormat("nl", {
    day: "numeric",
    month: "long",
  }).format(props.date);

  useEffect(() => {
    if (!clickedUpvote) return;

    if (isUpvoted) {
      setIsUpvoted(false);
      removeUpvotePost(props.userId, props.reactionId).then((res) => {
        if (!res) setIsUpvoted(true);
      });
    } else {
      setIsUpvoted(true);
      upvotePost(props.userId, props.reactionId).then((res) => {
        if (!res) setIsUpvoted(false);
      });
    }
    setClickedUpvote(false);
  }, [clickedUpvote, isUpvoted, props.userId, props.reactionId]);

  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.profilePicture}>
            <Image src={props.profilePhotoURL} alt="profielfoto"/>
          </div>
        </div>
        <div className={styles.userInfo}>
          <Link className={styles.name} href={`/forum/@${props.userName}`}>
            {props.firstName} {props.lastName}
          </Link>
          <div className={styles.subtext}>{formattedDate}</div>
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
