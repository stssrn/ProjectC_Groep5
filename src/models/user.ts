import malePhoto from "@/app/gebruiker/male.svg";
import femalePhoto from "@/app/gebruiker/female.svg";
import { $Enums, users } from "@prisma/client";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  profilePhotoURL: string;
}

export function userFromDb(dbUser: users): User {
  let profilePhotoURL;
  if (dbUser.profilePhotoUrl) {
    profilePhotoURL = dbUser.profilePhotoUrl;
  } else if (dbUser.profilePhoto === $Enums.profilePhoto.FEMALE) {
    profilePhotoURL = femalePhoto.src;
  } else if (dbUser.profilePhoto === $Enums.profilePhoto.MALE) {
    profilePhotoURL = malePhoto.src;
  }

  const user = {
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    username: dbUser.username,
    profilePhotoURL
  };

  return user;
}
