import { $Enums, profilePhoto, users } from "@prisma/client";
import styles from "./page.module.css";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  SetStateAction,
  useEffect,
  useId,
  useState,
} from "react";
import { useRef } from "react";

type UserWithoutIDandDate = Omit<Omit<users, "id">, "registationDate">;

const createUser = async (user: UserWithoutIDandDate) => {
  if (typeof user.isAdmin === "string") {
    user.isAdmin = user.isAdmin === "true";
  }

  if (typeof user.isForumMod === "string") {
    user.isForumMod = user.isForumMod === "true";
  }

  user.points = Number(user.points);

  const response = await fetch(`/api/user`, {
    method: "POST",
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error(`Failed to create user`);
};

const NewUserDialog: React.FC<{
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowDialog }) => {
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState<UserWithoutIDandDate>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    firstLogin: true,
    username: "",
    points: 0,
    bio: "",
    isForumMod: false,
    isAdmin: false,
    profilePhotoUrl: null,
    profilePhoto: $Enums.profilePhoto.FEMALE,
    resetToken: null,
    resetTokenExpiry: null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setClickedSubmit(false);
    if (!clickedSubmit || !formRef?.current?.reportValidity()) return;
    createUser(userInfo as UserWithoutIDandDate)
      .then(() => {
        setShowDialog(false);
      })
      .catch(console.error);

    setClickedSubmit(false);
  }, [clickedSubmit, setShowDialog, userInfo]);

  const fields: {
    label: string;
    field: keyof UserWithoutIDandDate;
    type: HTMLInputTypeAttribute;
    isRequired: boolean;
    defaultValue?: InputHTMLAttributes<HTMLInputElement>["value"];
    id: string;
  }[] = [
    {
      label: "Voornaam",
      field: "firstName",
      type: "text",
      isRequired: true,
      id: useId(),
    },
    {
      label: "Achternaam",
      field: "lastName",
      type: "text",
      isRequired: true,
      id: useId(),
    },
    {
      label: "E-mail",
      field: "email",
      type: "email",
      isRequired: true,
      id: useId(),
    },
    {
      label: "Gebruikersnaam",
      field: "username",
      type: "text",
      isRequired: true,
      id: useId(),
    },
    {
      label: "Wachtwoord",
      field: "password",
      type: "password",
      isRequired: true,
      id: useId(),
    },
    {
      label: "Punten",
      field: "points",
      type: "number",
      isRequired: false,
      defaultValue: 0,
      id: useId(),
    },
    { label: "Bio", field: "bio", type: "text", isRequired: true, id: useId() },
    {
      label: "Admin",
      field: "isAdmin",
      type: "checkbox",
      isRequired: false,
      defaultValue: "false",
      id: useId(),
    },

    {
      label: "Profielfoto URL",
      field: "profilePhotoUrl",
      type: "url",
      isRequired: false,
      id: useId(),
    },
  ];

  return (
    <form ref={formRef} className={styles.dialog}>
      {fields.map((field) => (
        <div key={field.field}>
          <label htmlFor={field.id}>{`${field.label} ${
            !field.isRequired ? "(optioneel)" : ""
          }`}</label>
          <input
            type={field.type}
            name="Voornaam"
            value={userInfo[field.field]?.toString()}
            id={field.id}
            autoComplete="off"
            className={styles.textBox}
            required={field.isRequired}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                [field.field]: e.target.value,
              }))
            }
          />
        </div>
      ))}
      <div>
        <label htmlFor="profilePhoto">Profielfoto</label>
        <select
          id="profilePhoto"
          className={styles.select}
          value={userInfo.profilePhoto?.toString()}
          required
          onChange={(e) =>
            setUserInfo((prev) => ({
              ...prev,
              profilePhoto: e.target.value as profilePhoto,
            }))
          }
        >
          {Object.values($Enums.profilePhoto).map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <input
        type="submit"
        value="Maak gebruiker"
        className={styles.button}
        onClick={(e) => {
          e.preventDefault();
          setClickedSubmit(true);
        }}
      />
      <input
        type="button"
        value="Sluiten"
        className={styles.secondaryButton}
        onClick={() => setShowDialog(false)}
      />
    </form>
  );
};

export default NewUserDialog;
