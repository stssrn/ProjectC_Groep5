// Math.random doesn't support seeds. random enough lol
export const makeRng = (seed = 0) => ({
  get() {
    return (Math.sin(++seed * 9000) + 1) / 2;
  },
  getRandom<T>(as: T[]) {
    return as[Math.floor(this.get() * as.length)];
  },
});

export const getRandomDate = () => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};
