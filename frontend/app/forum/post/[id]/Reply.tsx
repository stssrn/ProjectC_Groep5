"use client";

import { useEffect, useState } from "react";
import styles from "./Reply.module.css";
import clsx from "clsx";
import Link from "next/link";
import { Reply } from "@/lib/posts";

const Reply: React.FC<{
  reply: Reply;
}> = ({ reply }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { poster } = reply;

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

  const formattedDate = formatDate(reply.date);
  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.profilePicture}>
            <i className="symbol">person</i>
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.name}>
            {poster.firstName} {poster.lastName}
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
      <p className={styles.content}>{reply.content}</p>
      <div className={styles.bottom}>
        <div className={styles.bottomItem}>
          <i
            className={clsx(
              "symbol",
              styles.bottomItemButton,
              styles.likeButton,
              isLiked && styles.liked,
            )}
            onClick={() => setIsLiked((prev) => !prev)}
            title="Like"
          >
            favorite
          </i>
          <div>{reply.likes + Number(isLiked)}</div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
