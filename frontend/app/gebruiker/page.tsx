"use client";
import { useState, useEffect, ChangeEvent } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";

type UserData = {
  name: string;
  age: number;
  email: string;
  bio: string;
  points: number;
  profilePhoto: string;
};

const Page = () => {
  const defaultData: UserData = {
    name: "John Doe",
    age: 30,
    email: "johndoe@example.com",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    points: 100,
    profilePhoto: "https://randomuser.me/api/portraits/men/88.jpg",
  };

  const [userData, setUserData] = useState<UserData>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("userData");
      return savedData ? JSON.parse(savedData) : defaultData;
    }
    return defaultData;
  });

  const [editMode, setEditMode] = useState({
    email: false,
    bio: false,
    photo: false,
  });
  const [tempData, setTempData] = useState<Pick<UserData, "email" | "bio">>({
    email: userData.email,
    bio: userData.bio,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("userData", JSON.stringify(userData));
      } catch (e) {
        console.error("Saving to localStorage failed: ", e);
      }
    }
  }, [userData]);

  const handleEdit = (field: keyof UserData) => {
    setEditMode({ ...editMode, [field]: true });
    setTempData({ ...tempData, [field]: userData[field] });
  };

  const handleSave = (field: keyof UserData) => {
    setUserData({
      ...userData,
      [field]: tempData[field as keyof typeof tempData] as any,
    });
    setEditMode({ ...editMode, [field]: false });
  };

  const handleCancel = (field: keyof UserData) => {
    setTempData({ ...tempData, [field]: userData[field] });
    setEditMode({ ...editMode, [field]: false });
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUserData({ ...userData, profilePhoto: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
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
            <button
              className={styles.editButton}
              onClick={() => setEditMode({ ...editMode, photo: true })}
            >
              Edit Photo
            </button>
            {editMode.photo && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            )}
          </div>
          <div className={styles.userInfo}>
            <div>
              <label>Name:</label>
              <p>{userData.name}</p>
            </div>
            <div>
              <label>Age:</label>
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
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel("email")}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{userData.email}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit("email")}
                  >
                    Edit
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
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel("bio")}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{userData.bio}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit("bio")}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            <div>
              <label>Points:</label>
              <p>{userData.points}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;
