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

const fetchUser = async (id: Number): Promise<users[] | undefined> => {
  try {
    const response = await fetch(`/api/user?id=${id}`, { method: "PUT" });
    if (!response.ok) throw new Error("Failed to fetch user data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const deleteUser = async (id: Number) => {
  try {
    const response = await fetch(`/api/user?id=${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Failed to delete user ${id}`);
    window.location.reload();
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
};

const updateUser = async (changes: Partial<users>) => {
  // currentUser is passed in so we can diff the currentUser and changes values
  // for changes. If their keys are equal, we don't have to update the field in
  // the database which keeps things a little more efficient.
  try {
    // TypeScript doesn't like it when you use URLSearchParams with number values
    const paramString = Object.entries(changes)
      .filter(([_, v]) => typeof v !== "undefined")
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    for (const k in Object.keys(changes)) {
      if (typeof changes[k as keyof users] === undefined) {
        delete changes[k as keyof users];
      }
    }

    // the string is empty if there are no changes
    if (!paramString) return;

    // console.log(paramString);
    const response = await fetch(`/api/user?id=${changes.id}`, {
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

  useEffect(() => {
    (async () => {
      const users = await fetchUser(user.id);
      if (users) {
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
            name="Voornaam"
            value={(changes[field.field] || user[field.field])?.toString()}
            id={field.id}
            className={styles.textBox}
            onChange={(e) =>
              setChanges((prev) => ({
                ...prev,
                [field.field]: e.target.value,
              }))
            }
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
