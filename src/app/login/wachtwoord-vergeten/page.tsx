"use client";
import Image from "next/image";
import styles from "./page.module.css";
import image from "./image.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";


const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleRequestReset = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setCurrentStep(2);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateResetToken = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/validateResetToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired reset token.");
        return;
      }

      setCurrentStep(3);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setCurrentStep(1);
      alert('Password has been reset successfully.');
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      handleRequestReset();
    } else if (currentStep === 2) {
      validateResetToken();
    } else if (currentStep === 3) {
      handleResetPassword();
    }
  };

  const goBackToLogin = () => {
    router.push('/login');
  };

  return (
    <main className={styles.forgotPassword}>
      <div className={styles.backButton}>
        <button className={styles.backButton} onClick={goBackToLogin}>
          <i className="symbol">arrow_back</i></button></div>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className={styles.stepOne}>
            <div className={styles.left}>
              <h1 className={styles.loginTitle}>Wachtwoord Vergeten</h1>
              <div className={styles.form}>
                <input
                  className={styles.textbox}
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className={styles.continuePasswordChange}
                  onClick={handleRequestReset}
                  disabled={loading}
                >
                  {loading ? 'Verzenden...' : 'Verzend'}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>
            <div className={styles.right}>
              <Image className={styles.image} src={image} alt="" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.stepTwo}>
            <div className={styles.left}>
              <h1 className={styles.loginTitle}>Code invoeren</h1>
              <div className={styles.form}>
                <input
                  className={styles.textbox}
                  placeholder="Reset Code"
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
                <button
                  className={styles.continuePasswordChange}
                  onClick={validateResetToken}
                  disabled={loading}
                >
                  {loading ? 'Validating...' : 'Validate'}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>
            <div className={styles.right}>
              <Image className={styles.image} src={image} alt="" />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.stepThree}>
            <div className={styles.left}>
              <h1 className={styles.loginTitle}>Nieuw wachtwoord</h1>
              <div className={styles.form}>
                <input
                  className={styles.textbox}
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  className={styles.textbox}
                  placeholder="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className={styles.continuePasswordChange}
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>
            <div className={styles.right}>
              <Image className={styles.image} src={image} alt="" />
            </div>
          </div>
        )}
      </form>
    </main>
  );
};

export default Page;
