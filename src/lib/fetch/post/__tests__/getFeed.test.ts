import { getFeed } from "../getFeed";

test("First post is newer than last item", async () => {
  const feed = await getFeed(0, "recent", 5);
  expect(feed[0].date > feed[feed.length - 1].date).toBe(true);
});
