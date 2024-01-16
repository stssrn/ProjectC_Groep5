"use client";

import styles from "./page.module.css";
import PostComponent from "../../Post";
import ReactionComponent from "./Reaction";
import { useEffect, useState } from "react";
import { Post } from "@/models/post";
import { useSession } from "next-auth/react";
import { Reaction } from "@/models/reaction";

async function fetchPost(userId: number, id: number): Promise<Post> {
  const res = await fetch(`/api/forum/posts/${id}?userid=${userId}`);
  const post = await res.json();
  return post;
}

async function postReaction(
  userId: number,
  postId: number,
  content: string
): Promise<Reaction> {
  const res = await fetch(`/api/forum/posts/${postId}/react?userid=${userId}`, {
    method: "POST",
    body: JSON.stringify(content),
  });

  return await res.json();
}

const Page = ({ params }: { params: { id: number } }) => {
  const [post, setPost] = useState<Post>();
  const [replyContent, setReplyContent] = useState("");
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    if (!userId || post) return;

    fetchPost(userId, params.id).then((p) => {
      setPost(p);
    });
  }, [post]);

  useEffect(() => {
    if (userId && post && clickedSubmit && replyContent) {
      postReaction(userId, post.id, replyContent).then((r) => {
        setReplyContent("");
        setSubmissionCount(prev => prev + 1);
        setPost((prev) => ({
          ...prev!,
          reactions: [r, ...prev!.reactions],
        }));
      });
      setClickedSubmit(false);
    }
  }, [clickedSubmit]);

  return (
    <main className={styles.container}>
      {userId && post && (
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
          />
          <div className={styles.replyContainer}>
            <span className={styles.replySubtitle}>
              Reageer op {post.user.firstName} {post.user.lastName}
            </span>
            <textarea
              rows={6}
              className={styles.input}
              value={replyContent}
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
      )}
    </main>
  );
};

export default Page;
