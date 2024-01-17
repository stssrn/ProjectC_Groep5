"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import styles from "./ReportedPost.module.css";

async function removeReportsFromPost(postId: number) {
  const res = await fetch(`/api/forum/posts/${postId}/remove-reports`, {
    method: "DELETE",
  });
  return res;
}

async function deletePost(postId: number) {
  const res = await fetch(`/api/forum/posts/${postId}/delete`, {
    method: "DELETE",
  });
  return res;
}

const formatDate = Intl.DateTimeFormat("nl", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format;

const formatTime = Intl.DateTimeFormat("nl", {
  timeStyle: "short",
}).format;

const formateDateAndTime = (x: number | Date | undefined) =>
  `${formatDate(x)} om ${formatTime(x)}`;

type User = {
  username: string;
  profilePhotoURL: string;
  firstName: string;
  lastName: string;
};

type Post = {
  id: number;
  content: string;
  user: User;
};

type Report = {
  reportedBy: User;
  reason: string;
  date: Date;
};

const ReportedPost: React.FC<{
  post: Post;
  reports: Report[];
}> = (params) => {
  const [isHidden, setIsHidden] = useState(false);
  const [clickedDeletePost, setClickedDeletePost] = useState(false);
  const [clickedIgnored, setClickedIgnore] = useState(false);

  useEffect(() => {
    if (clickedDeletePost) {
      deletePost(params.post.id).then(() => {
        setIsHidden(true);
      });
      setClickedDeletePost(false);
    }
  }, [clickedDeletePost]);

  useEffect(() => {
    if (clickedIgnored) {
      removeReportsFromPost(params.post.id).then(() => {
        setIsHidden(true);
      });
      setClickedIgnore(false);
    }
  }, [clickedIgnored]);

  return (
    <div className={styles.container} hidden={isHidden}>
      <div className={styles.userInfo}>
        <Image
          src={params.post.user.profilePhotoURL}
          alt=""
          height={20}
          width={20}
          className={styles.profilePhoto}
        />
        <div
          className={styles.fullName}
        >{`${params.post.user.firstName} ${params.post.user.lastName}`}</div>
        <Link
          href={`/forum/post/${params.post.id}`}
          className={styles.postLink}
        >
          Link naar post
        </Link>
      </div>
      <p className={styles.postContent}>{params.post.content}</p>
      <div className={styles.reportHeader}>Reden:</div>
      {params.reports.map((r) => (
        <div className={styles.report} key={r.date.toString()}>
          <time>{formateDateAndTime(r.date)}:</time>
          <p>{r.reason}</p>
        </div>
      ))}
      <div className={styles.actionButtons}>
        <input
          type="button"
          id="report-text"
          value="Negeer"
          className={styles.reportButton}
          onClick={() => setClickedIgnore(true)}
        />
        <input
          type="submit"
          className={clsx(styles.reportButton, styles.red)}
          value="Verwijder post"
          onClick={() => setClickedDeletePost(true)}
        />
      </div>
    </div>
  );
};

export default ReportedPost;
