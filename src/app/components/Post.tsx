"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import {
  upvotePost,
  deletePost,
  reportPost,
  removeUpvotePost,
} from "@/lib/fetch/post";

import styles from "./Post.module.css";

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

const formatDate = Intl.DateTimeFormat("nl", {
  day: "numeric",
  month: "long",
}).format;

const Post: React.FC<Props> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportOverlay, setShowReportOverlay] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(props.isUpvoted);
  const [reportText, setReportText] = useState("");
  const [clickedUpvote, setClickedUpvote] = useState(false);
  const [clickedReport, setClickedReport] = useState(false);
  const [clickedDelete, setClickedDelete] = useState(false);
  const [clickedSubmitReport, setClickedSubmitReport] = useState(false);

  const postUrl = `/forum/post/${props.postId}`;
  const formattedDate = formatDate(props.date);

  // Submit report
  useEffect(() => {
    if (!clickedSubmitReport) return;

    if (!reportText) {
      setClickedSubmitReport(false);
      return;
    }

    reportPost(props.userId, props.postId, reportText)
      .then((res) => {
        if (res?.ok) setIsHidden(true);
      })
      .catch(console.error)
      .finally(() => setClickedSubmitReport(false));
  }, [clickedSubmitReport, props.postId, props.userId, reportText]);

  // Show report screen
  useEffect(() => {
    if (clickedReport) {
      setShowReportOverlay(true);
      setShowDropdown(false);
      setClickedReport(false);
    }
  }, [clickedReport]);

  // Delete post
  useEffect(() => {
    if (!clickedDelete) return;

    deletePost(props.postId).then((res) => {
      if (res) {
        setIsHidden(true);
      }
    });
    setShowDropdown(false);
    setClickedDelete(false);
  }, [clickedDelete, props.postId]);

  // Show dropdown menu
  useEffect(() => {
    const handler = (_: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showDropdown]);

  // Upvote post
  useEffect(() => {
    if (clickedUpvote) {
      setClickedUpvote(false);

      if (isUpvoted) {
        setIsUpvoted(false);
        removeUpvotePost(props.userId, props.postId).then((res) => {
          if (!res) setIsUpvoted(true);
        });
      } else {
        setIsUpvoted(true);
        upvotePost(props.userId, props.postId).then((res) => {
          if (!res) setIsUpvoted(false);
        });
      }
    }
  }, [clickedUpvote, isUpvoted, props.postId, props.userId]);

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
            <Image
              className={styles.profilePictureImage}
              src={props.profilePhotoURL}
              alt="profielfoto"
              width={64}
              height={64}
            ></Image>
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
