"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import Image from "next/image";

import MaleDefaultPhoto from "./male.svg";
import FemaleDefaultPhoto from "./female.svg";

type UserData = {
  id: number;
  age: number;
  email: string;
  bio: string;
  points: number;
  profilePhoto: "MALE" | "FEMALE";
  profilePhotoUrl?: string;
  firstName: string;
  lastName: string;
  username: string;
  registrationDate: string;
};

const Page = () => {
  const defaultData: UserData = {
    id: 0,
    age: 30,
    email: "DefaultData@example.com",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    points: 100,
    profilePhoto: "MALE",
    firstName: "",
    lastName: "",
    username: "",
    registrationDate: "",
  };

  const [userData, setUserData] = useState<UserData>(defaultData);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState({ email: false, bio: false });
  const [tempData, setTempData] = useState<Pick<UserData, "email" | "bio">>({
    email: userData.email,
    bio: userData.bio,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/gebruiker/user/user?id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData({ ...userData, ...data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadResponse = await fetch(
        `/api/gebruiker/avatar/upload?filename=${encodeURIComponent(
          file.name
        )}&contentType=${encodeURIComponent(file.type)}`,
        {
          method: "POST",
          body: file,
        }
      );

      if (!uploadResponse.ok) throw new Error("Failed to upload image");

      const blobData = await uploadResponse.json();

      const updateResponse = await fetch(
        "/api/gebruiker/avatar/updateProfilePhoto",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.id,
            profilePhotoUrl: blobData.url,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update user profile");

      setUserData({ ...userData, profilePhotoUrl: blobData.url });
    } catch (error) {
      console.error("Error in photo upload or profile update:", error);
      setError("Failed to upload image or update profile");
    }
  };

  const getImagePath = () => {
    return (
      userData.profilePhotoUrl ||
      (userData.profilePhoto === "MALE" ? MaleDefaultPhoto : FemaleDefaultPhoto)
    );
  };

  const handleEdit = (field: keyof Pick<UserData, "email" | "bio">) => {
    setEditMode({ ...editMode, [field]: true });
    setTempData({ ...tempData, [field]: userData[field] });
  };

  const handleSave = async (field: keyof Pick<UserData, "email" | "bio">) => {
    const updatedData = {
      ...userData,
      [field]: tempData[field],
    };

    try {
      const response = await fetch("/api/gebruiker/user/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData.id,
          [field]: tempData[field],
        }),
      });

      if (!response.ok) throw new Error("Failed to update user data");

      setUserData(updatedData);
      setEditMode({ ...editMode, [field]: false });
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Failed to update user data");
    }
  };

  const handleCancel = (field: keyof Pick<UserData, "email" | "bio">) => {
    setTempData({ ...tempData, [field]: userData[field] });
    setEditMode({ ...editMode, [field]: false });
  };

  return (
    <Container title="Profiel">
      <div className={styles.parentContainer}>
        <div className={styles.profileContainer}>
          <div className={styles.circularProfilePhotoContainer}>
            <Image
              src={getImagePath()}
              alt="Profile"
              width={150}
              height={150}
              className={styles.circularProfilePhoto}
            />
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            <button
              className={styles.editButton}
              onClick={() => inputFileRef.current?.click()}
            >
              Bewerk Foto
            </button>
          </div>
          <div className={styles.userInfo}>
            <div>
              <label>Naam:</label>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div>
              <label>Leeftijd:</label>
              <p>{userData.age}</p>
            </div>
            <div>
              <label>Email:</label>
              {editMode.email ? (
                <>
                  <input
                    type="text"
                    value={tempData.email}
                    onChange={(e) =>
                      setTempData({ ...tempData, email: e.target.value })
                    }
                  />
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSave("email")}
                  >
                    Opslaan
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel("email")}
                  >
                    Annuleren
                  </button>
                </>
              ) : (
                <>
                  <p>{userData.email}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit("email")}
                  >
                    Bewerken
                  </button>
                </>
              )}
            </div>
            <div>
              <label>Bio:</label>
              {editMode.bio ? (
                <>
                  <textarea
                    value={tempData.bio}
                    onChange={(e) =>
                      setTempData({ ...tempData, bio: e.target.value })
                    }
                  />
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSave("bio")}
                  >
                    Opslaan
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel("bio")}
                  >
                    Annuleren
                  </button>
                </>
              ) : (
                <>
                  <p>{userData.bio}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit("bio")}
                  >
                    Bewerken
                  </button>
                </>
              )}
            </div>
            <div>
              <label>Punten:</label>
              <p>{userData.points}</p>
            </div>
          </div>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Container>
  );
};

export default Page;
