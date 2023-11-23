import getRandomAccounts, { Account } from "./accounts";
import { makeRng } from "./utils";

export interface Reply {
  id: number;
  poster: Account;
  content: string;
  date: Date;
  likes: number;
}

export type Category = "Vragen" | "Overig";

export interface Post extends Reply {
  replies: Reply[];
  category: Category;
}

const accounts = getRandomAccounts(100);
const rng = makeRng();
let id = 0;

const genReplies = (length: number) =>
  Array.from(
    { length },
    (): Reply => ({
      id: ++id,
      poster: rng.getRandom(accounts),
      content: "Lorem ipsum dolor sit.",
      date: new Date(),
      likes: Math.floor(rng.get() * 10),
    }),
  );

const getRandomPosts = (length: number) =>
  genReplies(length).map<Post>((reply) => ({
    ...reply,
    replies: genReplies(rng.get() * 10),
    category: Math.round(rng.get()) ? "Vragen" : "Overig",
  }));

export const posts = getRandomPosts(20);
