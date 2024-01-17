"use client";

import { useEffect, useState } from "react";
import styles from "./Post.module.css";
import clsx from "clsx";
import Link from "next/link";
import { parseArgs } from "util";

async function upvote(userId: number, postId: number) {
  const res = await fetch(
    `/api/forum/posts/${postId}/upvote?userid=${userId}`,
    { method: "POST" }
  );
  return res.ok;
}

async function removeUpvote(userId: number, postId: number) {
  const res = await fetch(
    `/api/forum/posts/${postId}/remove-upvote?userid=${userId}`,
    { method: "DELETE" }
  );
  return res.ok;
}

async function deletePost(postId: number) {
  const res = await fetch(`/api/forum/posts/${postId}/delete`, {
    method: "DELETE",
  });
  return res.ok;
}

async function reportPost(userId: number, postId: number, reason: string) {
  const res = await fetch(
    `/api/forum/posts/${postId}/report?userid=${userId}`,
    {
      method: "PUT",
      body: JSON.stringify(reason),
    }
  );
  return res;
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
  showDelete: boolean;
};

const Post: React.FC<Props> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(props.isUpvoted);
  const [showReportOverlay, setShowReportOverlay] = useState(false);
  const [clickedUpvote, setClickedUpvote] = useState(false);
  const [clickedReport, setClickedReport] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [clickedSubmitReport, setClickedSubmitReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const postUrl = `/forum/post/${props.postId}`;

  const formatDate = Intl.DateTimeFormat("nl", {
    day: "numeric",
    month: "long",
  }).format;

  useEffect(() => {
    if (clickedSubmitReport && reportText) {
      reportPost(props.userId, props.postId, reportText)
        .then((res) => {
          if (res?.ok) {
            setIsHidden(true);
          }
        })
        .catch(console.error)
        .finally(() => {
          setClickedSubmitReport(false);
        });
    } else if (clickedSubmitReport && !reportText) {
      setClickedSubmitReport(false);
    }
  }, [clickedSubmitReport, reportText]);

  useEffect(() => {
    if (clickedReport) {
      setShowReportOverlay(true);
      setShowDropdown(false);
      setClickedReport(false);
    }
  }, [clickedReport]);

  useEffect(() => {
    if (clickedDelete) {
      deletePost(props.postId).then((res) => {
        if (res) {
          setIsHidden(true);
        }
      });
      setShowDropdown(false);
      setClickedDelete(false);
    }
  }, [clickedDelete]);

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
        removeUpvote(props.userId, props.postId).then((res) => {
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
    <div className={styles.post} hidden={isHidden}>
      {showReportOverlay && (
        <div className={styles.reportOverlay}>
          <div className={styles.reportBox}>
            <label htmlFor="report-text" className={styles.reportLabel}>
              Waarom wilt u deze post rapporteren?
            </label>
            <textarea
              disabled={clickedSubmitReport}
              rows={3}
              className={styles.reportTextarea}
              onChange={(e) => setReportText(e.target.value)}
            ></textarea>
            <div className={styles.reportOverlayButtons}>
              <input
                type="button"
                id="report-text"
                value="Annuleer"
                className={styles.reportButton}
                onClick={() => setShowReportOverlay(false)}
              />
              <input
                type="submit"
                className={clsx(styles.reportButton, styles.red)}
                value="Verstuur"
                onClick={() => setClickedSubmitReport(true)}
              />
            </div>
          </div>
        </div>
      )}
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
                <li onClick={() => setClickedReport(true)}>
                  <i className={clsx("symbol", styles.listSymbol)}>flag</i>
                  <span className={styles.listText}>Rapporteer</span>
                </li>
                {props.showDelete && (
                  <li onClick={() => setClickedDelete(true)}>
                    <i className={clsx("symbol", styles.listSymbol)}>delete</i>
                    <span className={styles.listText}>Verwijder</span>
                  </li>
                )}
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
