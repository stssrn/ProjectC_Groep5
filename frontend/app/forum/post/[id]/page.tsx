"use client";

import { posts } from "@/lib/posts";
import styles from "./page.module.css";
import Post from "../../Post";
import Reply from "./Reply";
import { useState } from "react";

const Page = ({ params }: { params: { id: number } }) => {
  const [post, setPost] = useState(posts.find((p) => p.id == params.id)!);
  const [replyContent, setReplyContent] = useState("");
  const { replies } = post;
  return (
    <main className={styles.container}>
      <Post post={post} />
      <div className={styles.replyContainer}>
        <span className={styles.replySubtitle}>
          Reageer op {post.poster.firstName} {post.poster.lastName}
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
            setReplyContent("");
            setPost((prev) => ({
              ...prev,
              replies: [
                {
                  id: 900,
                  poster: {
                    id: 900,
                    firstName: "John",
                    lastName: "Doe",
                    username: "@johndoe",
                    creationDate: new Date(),
                    points: 0,
                    firstLogin: true,
                    isAdmin: false,
                    isModerator: false
                  },
                  content: replyContent,
                  date: new Date(),
                  likes: 0,
                },
                ...prev.replies,
              ],
            }));
          }}
        >
          Plaats reactie
        </div>
      </div>
      <div className={styles.replies}>
        {replies.map((reply) => (
          <Reply key={reply.id} reply={reply} />
        ))}
      </div>
    </main>
  );
};

export default Page;
