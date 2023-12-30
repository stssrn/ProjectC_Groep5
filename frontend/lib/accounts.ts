import { getRandomDate, makeRng } from "./utils";

export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  points: number;
  firstLogin: Boolean;
  isAdmin: Boolean;
  isModerator: Boolean;
  creationDate: Date;
}

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

const rng = makeRng();

const generateRandomAccount = (): Account => {
  const firstName = rng.getRandom(firstNames);
  const lastName = rng.getRandom(lastNames);
  return {
    id: Math.floor(Math.abs(rng.get()) * 1000),
    firstName,
    lastName,
    username: (firstName + lastName).replaceAll(" ", ""),
    points: 10,
    firstLogin: true,
    isAdmin: false,
    isModerator: false,
    creationDate: getRandomDate(),
  };
};

const randomAccounts = Array.from({ length: 100 }, generateRandomAccount);
const getRandomAccounts = (length: number) => randomAccounts.slice(0, length);

export default getRandomAccounts;