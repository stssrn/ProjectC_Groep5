import { PostSummary } from "./postSummary";
import { Reaction } from "./reaction";

export interface Post extends PostSummary {
  reactions: Reaction[];
}
