"use client";
import { useState, useEffect } from "react";
import styles from "./Event.module.css";


type EventData = {
  id: number;
  date: Date;
  name: string;
  description: string;
};

const EventComponent: React.FC<{ event: EventData }> = ({ event }) => {

  const [showSignUp, setShowSignUp] = useState(false);
  const [signedIn, setSignIn] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    id: 0,
    date: new Date(),
    name: "",
    description: ""
  });

  const handleSignUp = async () => {
    if (signedIn) {
      await saveSignOut(1, event.id);
      setSignIn(false);
    }
    else {
      await saveSignIn(1, event.id);
      setSignIn(true);

    }
  };

  const fetchEventData = async (eventId: number) => {
    try {
      const response = await fetch(`api/agendaUser?id=${eventId}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch agenda data");

      const data = await response.json();

      setEventData({ ...eventData, ...data });
    } catch (error) {
      console.error("Error fetching agenda data:", error);
    }
  };

  const saveSignIn = async (userId: number, eventId: number) => {
    try {
      //console.log("save sign in");
      const response = await fetch("api/agendaUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add event and/or user data");
      }
    } catch (error) {
      console.error("Error updating event and/or user data:", error);
    }
  }
  const saveSignOut = async (userId: number, eventId: number) => {
    try {
      //console.log("save sign out");
      const response = await fetch("api/agendaUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete event and/or user data");
      }
    } catch (error) {
      console.error("Error deleting event and/or user data:", error);
    }
  }

  useEffect(() => {
    const eventId = event.id;
    fetchEventData(eventId);
  }, [event.id]);


  return (
    <main>
      <div key={event.date.getMilliseconds()} className={styles.event}>
        <div className={styles.info}>
          <time dateTime={event.date.toISOString()} className={styles.eventDay}>
            {event.date.getDate()}
          </time>
          <div className={styles.eventName}>{event.name}</div>
        </div>
        <button className={styles.signUp} onClick={() => setShowSignUp(true)}>Inschrijven</button>
      </div>
      {showSignUp && (
        <div className={styles.createPopUp}>
          <div className={styles.dialog}>
            <h1 className={styles.h1}>{event.name}</h1>
            <p className={styles.description}>{event.description}</p>
            <div className={styles.dialogButtons}>
              <div
                onClick={() => setShowSignUp(false)}
                className={styles.secondaryButton}
              >
                Sluiten
              </div>
              {signedIn && (
                <div onClick={handleSignUp} className={styles.button}>Uitschrijven</div>
              )}
              {signedIn === false && (
                <div
                  onClick={handleSignUp}
                  className={styles.button}>Inschrijven</div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
};

export default EventComponent;
