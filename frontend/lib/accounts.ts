export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  creationDate: Date;
}

const getRandomDate = () => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const firstNames = [
  "Anna",
  "Bram",
  "Celine",
  "David",
  "Eva",
  "Femke",
  "Gijs",
  "Hannah",
  "Ivan",
  "Julia",
];

const lastNames = [
  "De Vries",
  "Jansen",
  "Van Dijk",
  "Bakker",
  "Visser",
  "Meijer",
  "Smit",
  "Van der Laan",
  "Kok",
  "Mulder",
];

const getRandom = <T>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

const generateRandomAccount = (): Account => ({
  id: Math.floor(Math.random() * 1000),
  firstName: getRandom(firstNames),
  lastName: getRandom(lastNames),
  creationDate: getRandomDate(),
});

const getRandomAccounts = (length: number): Account[] =>
  Array.from({ length: length }, generateRandomAccount);

export default getRandomAccounts;
