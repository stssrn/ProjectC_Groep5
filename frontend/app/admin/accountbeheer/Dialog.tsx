import { users } from "@prisma/client";
import styles from "./page.module.css";
import { Dispatch, HTMLInputTypeAttribute, InputHTMLAttributes, SetStateAction, useEffect, useId, useState } from "react";
import { InputType } from "zlib";

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
    const response = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Failed to delete user ${id}`);
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}

const createUser = async (user: Omit<users, "id">) => {
  try {
    const response = await fetch(`/api/users`, {
      method: "POST",
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error(`Failed to create user`);
  } catch (error) {
    console.error("Failed to create user:", error);
  }
}

const updateUser = async (currentUser: users, changes: Partial<users>) => {
  // currentUser is passed in so we can diff the currentUser and changes values
  // for changes. If their keys are equal, we don't have to update the field in
  // the database which keeps things a little more efficient.
  try {
    // TypeScript doesn't like it when you use URLSearchParams with number values
    const paramString = Object.entries(changes)
      .filter(([_, v]) => typeof (v) !== "undefined")
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    for (const k in Object.keys(changes)) {
      if (typeof changes[k as keyof users] === undefined) {
        delete changes[k as keyof users]
      }
    }

    // the string is empty if there are no changes
    if (!paramString) return;

    // console.log(paramString);
    const response = await fetch(`/api/user?id=${changes.id}`, { method: "PUT", body: JSON.stringify(changes) });
    if (!response.ok) throw new Error("Failed to update user data");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

// note: opening and closing dialog could perhaps be handld using react context

const Dialog: React.FC<{
  children?: React.ReactNode;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ children, setShowDialog }) => {
  return (
    <div className={styles.dialog}>
      {children}
      <input
        type="button"
        value="Sluiten"
        className={styles.secondaryButton}
        onClick={() => setShowDialog(false)}
      />
    </div>
  );
};

export default Dialog;
