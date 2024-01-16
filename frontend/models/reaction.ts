import { Reaction as DbReaction } from "@prisma/client";
import { User } from "./user";

export interface Reaction {
  id: number;
  user: User;
  content: string;
  date: string;
  upvoteCount: number;
  isUpvoted: boolean;
}

export function reactionFromDb(
  dbReaction: DbReaction,
  user: User,
  upvoteCount: number,
  isUpvoted: boolean
): Reaction {
  const reaction = {
    id: dbReaction.id,
    user,
    content: dbReaction.content,
    date: dbReaction.date.toString(),
    upvoteCount,
    isUpvoted,
  };

  return reaction;
}
