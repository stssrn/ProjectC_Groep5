import { users } from "@prisma/client";
import styles from "./page.module.css";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  SetStateAction,
  useEffect,
  useId,
  useState,
} from "react";

import { fetchUser, deleteUser } from "@/lib/fetch/user";

const updateUser = async (changes: Partial<users>) => {
  try {
    if (typeof changes.points === "string") {
      changes.points = Number(changes.points);
    }

    const response = await fetch(`/api/user/updateUser`, {
      method: "PUT",
      body: JSON.stringify(changes),
    });
    if (!response.ok) throw new Error("Failed to update user data");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

const EditUserDialog: React.FC<{
  user: users;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ user, setShowDialog }) => {
  const [changes, setChanges] = useState<Partial<users>>({ id: user.id });
  const [currentUser, setCurrentUser] = useState<Partial<users>>();

  useEffect(() => {
    (async () => {
      const res = await fetchUser(user.id);
      if (res) {
        setCurrentUser(res)
      } else {
        console.error("Failed to fetch accounts :(");
      }
    })();
  }, [user]);
  const fields: {
    label: string;
    field: keyof users;
    type: HTMLInputTypeAttribute;
    id: string;
  }[] = [
    { label: "Voornaam", field: "firstName", type: "text", id: useId() },
    { label: "Achternaam", field: "lastName", type: "text", id: useId() },
    { label: "E-mail", field: "email", type: "email", id: useId() },
    { label: "Gebruikersnaam", field: "username", type: "text", id: useId() },
    { label: "Punten", field: "points", type: "number", id: useId() },
    { label: "Admin", field: "isAdmin", type: "checkbox", id: useId() },
  ];


  return (
    <div className={styles.dialog}>
      {fields.map((field) => (
        <div key={field.field}>
          <label htmlFor={field.id}>{field.label}</label>
          <input
            type={field.type}
            name={field.field}
            value={(changes[field.field] || user[field.field] || currentUser?.[field.field])?.toString()}
            checked={!!(changes[field.field] ?? currentUser?.[field.field])}
            id={field.id}
            className={styles.textBox}
            onChange={(e) => {
              return setChanges((prev) => ({
                ...prev,
                [field.field]: field.type === "checkbox" ? e.target.checked : e.target.value,
              }))
            }}
          />
        </div>
      ))}
      <input
        type="button"
        value="Opslaan"
        className={styles.button}
        onClick={() => {
          updateUser(changes);
          setShowDialog(false);
        }}
      />
      <input
        type="button"
        value="Verwijder"
        className={styles.button}
        onClick={() => {
          deleteUser(user.id);
          setShowDialog(false);
        }}
      />
      <input
        type="button"
        value="Sluiten"
        className={styles.secondaryButton}
        onClick={() => setShowDialog(false)}
      />
    </div>
  );
};

export default EditUserDialog;
