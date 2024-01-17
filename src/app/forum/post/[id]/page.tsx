"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Post } from "@/models/post";
import { postReaction } from "@/lib/fetch/postReaction";
import { fetchPost } from "@/lib/fetch/fetchPost";

import PostComponent from "../../Post";
import ReactionComponent from "./Reaction";

import styles from "./page.module.css";

const Page = ({ params }: { params: { id: number } }) => {
  const [post, setPost] = useState<Post>();
  const [replyContent, setReplyContent] = useState("");
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    if (!userId || post || isLoading || isError) return;

    setIsLoading(true);
    fetchPost(userId, params.id)
      .then((p) => {
        setPost(p);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [post, isLoading, userId, isError, params.id]);

  useEffect(() => {
    if (!userId || !post || !clickedSubmit || !replyContent) return;

    postReaction(userId, post.id, replyContent)
      .then((r) => {
        setReplyContent("");
        setSubmissionCount((prev) => prev + 1);
        setPost((prev) => ({
          ...prev!,
          reactions: [r, ...prev!.reactions],
        }));
      })
      .finally(() => setClickedSubmit(false));
  }, [clickedSubmit, post, replyContent, userId]);

  return (
    <main className={styles.container}>
      {userId &&
        (post ? (
          <>
            <PostComponent
              postId={post.id}
              userId={userId}
              profilePhotoURL={post.user.profilePhotoURL}
              firstName={post.user.firstName}
              lastName={post.user.lastName}
              username={post.user.username}
              upvoteCount={post.upvoteCount}
              reactionCount={post.reactionCount + submissionCount}
              content={post.content}
              date={new Date(post.date)}
              isUpvoted={post.isUpvoted}
              showDelete={
                session.data?.user.isAdmin ||
                session.data?.user.isForumMod ||
                false
              }
            />
            <div className={styles.replyContainer}>
              <span className={styles.replySubtitle}>
                Reageer op {post.user.firstName} {post.user.lastName}
              </span>
              <textarea
                rows={6}
                className={styles.input}
                value={replyContent}
                disabled={clickedSubmit}
                onChange={(e) => setReplyContent(e.target.value)}
              ></textarea>
              <div
                className={styles.button}
                onClick={() => {
                  setClickedSubmit(true);
                }}
              >
                Plaats reactie
              </div>
            </div>
            <div className={styles.replies}>
              {post.reactions.map((r) => (
                <ReactionComponent
                  key={r.id}
                  userId={userId}
                  reactionId={r.id}
                  firstName={r.user.firstName}
                  lastName={r.user.lastName}
                  profilePhotoURL={r.user.profilePhotoURL}
                  content={r.content}
                  date={new Date(r.date)}
                  userName={r.user.username}
                  upvoteCount={r.upvoteCount}
                  isUpvoted={r.isUpvoted}
                />
              ))}
            </div>
          </>
        ) : isLoading ? (
          <div className={styles.info}>Laden...</div>
        ) : (
          <div className={styles.info}>Post was niet gevonden</div>
        ))}
    </main>
  );
};

export default Page;
