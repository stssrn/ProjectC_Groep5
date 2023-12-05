"use client";
import { useState, useEffect, ChangeEvent } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";

type UserData = {
  id: number;
  age: number;
  email: string;
  bio: string;
  points: number;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  username: string;
  registrationDate: string;
};

const Page = () => {
  const defaultData: UserData = {
    id: 0,
    age: 30,
    email: "johndoe@example.com",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    points: 100,
    profilePhoto: "https://randomuser.me/api/portraits/men/88.jpg",
    firstName: "",
    lastName: "",
    username: "",
    registrationDate: "",
  };

  const [userData, setUserData] = useState<UserData>(defaultData);
  const [editMode, setEditMode] = useState({ email: false, bio: false });
  const [tempData, setTempData] = useState<Pick<UserData, "email" | "bio">>({
    email: userData.email,
    bio: userData.bio,
  });

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user?id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData({ ...userData, ...data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const handleEdit = (field: keyof Pick<UserData, "email" | "bio">) => {
    setEditMode({ ...editMode, [field]: true });
    setTempData({ ...tempData, [field]: userData[field] });
  };

  const handleSave = async (field: keyof Pick<UserData, "email" | "bio">) => {
    const updatedData = {
      ...userData,
      [field]: tempData[field],
    };

    setUserData(updatedData);
    setEditMode({ ...editMode, [field]: false });

    try {
      const response = await fetch("/api/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData.id,
          [field]: tempData[field],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
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
            <img
              src={userData.profilePhoto}
              alt="Profile"
              className={styles.circularProfilePhoto}
            />
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
    </Container>
  );
};

export default Page;
