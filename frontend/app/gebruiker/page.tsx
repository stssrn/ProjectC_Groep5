"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import Image from "next/image";
import { useSession } from 'next-auth/react';

import MaleDefaultPhoto from "./male.svg";
import FemaleDefaultPhoto from "./female.svg";
import Link from "next/link";

type UserData = {
  id: number;
  email: string;
  password: string;
  bio: string;
  points: number;
  profilePhoto: "MALE" | "FEMALE";
  profilePhotoUrl?: string;
  firstName: string;
  lastName: string;
  username: string;
  registrationDate: string;
  isFirstTime: boolean;
};

const Page = () => {
  const defaultData: UserData = {
    id: 0,
    email: "DefaultData@example.com",
    password: "",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    points: 100,
    profilePhoto: "MALE",
    firstName: "",
    lastName: "",
    username: "",
    registrationDate: "",
    isFirstTime: true,
  };

  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData>(defaultData);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState({
    email: false,
    bio: false,
    password: false,
  });
  const [tempData, setTempData] = useState<
    Pick<UserData, "email" | "bio" | "password">
  >({
    email: userData.email,
    bio: userData.bio,
    password: userData.password,
  });
  const [error, setError] = useState("");

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData(session.user.id.toString()).then(() => {
        setIsLoading(false);
      });
    }
  }, [session]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/fetchFromUserId?id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData({ ...userData, ...data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadResponse = await fetch(
        `/api/avatar/upload?filename=${encodeURIComponent(
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
        "/api/avatar/updateProfilePhoto",
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

  const handleEdit = (
    field: keyof Pick<UserData, "email" | "bio" | "password">
  ) => {
    setEditMode({ ...editMode, [field]: true });
    setTempData({ ...tempData, [field]: userData[field] });
  };

  const toggleChangePasswordForm = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        "/api/changePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.id,
            newPassword: newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      const result = await response.json();
      console.log(result.message);
      setShowChangePassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password");
    }
  };

  const handleSave = async (
    field: keyof Pick<UserData, "email" | "bio" | "password">
  ) => {
    if (field === "password") {
      await handleChangePassword();
    } else {
      const updatedData = {
        ...userData,
        [field]: tempData[field],
      };

      try {
        const response = await fetch("/api/user/updateUser", {
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
    }
  };

  const handleCancel = (
    field: keyof Pick<UserData, "email" | "bio" | "password">
  ) => {
    setTempData({ ...tempData, [field]: userData[field] });
    setEditMode({ ...editMode, [field]: false });
  };

  return (
    <Container title="Profiel">
      {/* Profiel Foto Sectie */}
      <div className={styles.widthAanpassing}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Foto:</span>

          <Image
            src={getImagePath()}
            alt="Profile"
            width={100}
            height={100}
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
            <i className="symbol">photo</i>
          </button>
        </div>

        {/* Naam Sectie */}
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Naam:</span>
          <span className={styles.detailContent}>
            {userData.firstName} {userData.lastName}
          </span>
        </div>

        {/* Email Sectie */}
        {editMode.email ? (
          <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                className={styles.inputField}
                value={tempData.email}
                onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
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
            </div>
          </div>
        ) : (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailContent}>{userData.email}</span>
            <button
              className={styles.editButton}
              onClick={() => handleEdit("email")}
            >
              <i className="symbol">edit</i>
            </button>
          </div>
        )}


        {/* Bio Sectie */}
        {editMode.bio ? (
          <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
              <label htmlFor="bio">Bio</label>
              <input
                type="text"
                id="bio"
                className={styles.inputField}
                value={tempData.bio}
                onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
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
            </div>
          </div>
        ) : (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Bio:</span>
            <span className={styles.detailContent}>{userData.bio}</span>
            <button
              className={styles.editButton}
              onClick={() => handleEdit("bio")}
            >
              <i className="symbol">edit</i>
            </button>
          </div>
        )}

        {/* Punten Sectie */}
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Punten:</span>
          <span className={styles.detailContent}>{userData.points}</span>
        </div>

        {/* Wachtwoord Veranderen Sectie */}
        {showChangePassword && (
          <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
              <label htmlFor="newPassword">Nieuwe Wachtwoord</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Voer nieuw wachtwoord in"
                className={styles.inputField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className={styles.saveButton}
                onClick={handleChangePassword}
              >
                Opslaan
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowChangePassword(false)}
              >
                Annuleren
              </button>
            </div>
          </div>
        )}

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Wachtwoord:</span>
          <i className="symbol">password</i>
          <button
            onClick={toggleChangePasswordForm}
            className={styles.editButton}
          >
            {showChangePassword ? "Annuleer " : "Wachtwoord Wijzigen "}
            <i className="symbol">edit</i>
          </button>
        </div>


        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.tourDiv}>
          <Link href="/tour">
            <span className={styles.tourButton}>Ga Naar Tour</span>
          </Link>
        </div>
      </div>
    </Container>
  );

};

export default Page;