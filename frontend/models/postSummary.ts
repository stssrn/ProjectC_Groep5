import { Post as DbPost, users } from "@prisma/client";
import { User, userFromDb } from "./user";

export interface PostSummary {
  id: number;
  user: User;
  content: string;
  date: string;
  isUpvoted: boolean;
  upvoteCount: number;
  reactionCount:number;
}

export function postSummaryFromDb(
  dbPost: DbPost,
  user: User,
  upvoteCount: number,
  reactionCount: number,
  isUpvoted: boolean,
): PostSummary {
  const post = {
    user,
    upvoteCount,
    id: dbPost.id,
    content: dbPost.content,
    date: dbPost.date.toString(),
    isUpvoted,
    reactionCount,
  };

  return post;
}
