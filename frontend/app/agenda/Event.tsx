"use client";
import { useState, useEffect } from "react";
import styles from "./Event.module.css";
import { useSession } from "next-auth/react";
import { DateTime } from 'luxon';

type EventData = {
  id: number;
  date: Date;
  name: string;
  description: string;
};


const EventComponent: React.FC<{ event: EventData }> = ({ event }) => {

  const { data: session } = useSession();
  const [showSignUp, setShowSignUp] = useState(false);
  const [signedIn, setSignIn] = useState(false);
  const [userId, setUserId] = useState(0);
  const [eventData, setEventData] = useState<EventData>({
    id: 0,
    date: new Date(),
    name: "",
    description: ""
  });

  const handleSignUp = async () => {
    if (signedIn) {
      await saveSignOut(userId, event.id);
      setSignIn(false);

    }
    else {
      await saveSignIn(userId, event.id);
      setSignIn(true);

    }
  };

  const fetchEventData = async (eventId: number, userID: number) => {
    try {
      const response = await fetch(`api/event?id=${0}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch agenda data");
      const data = await response.json();
      //console.log("data: ");
      //console.log(data);
      await fetchAgendaUserData(userID, eventId);
      setUserId(userID);
      setEventData({ ...eventData, ...data });

    } catch (error) {
      console.error("Error fetching agenda data:", error);
    }
  };

  const fetchAgendaUserData = async (userID: number, eventId: number) => {
    try {
      const response = await fetch(`api/agendaUser?userId=${userID}&eventId=${eventId}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch agenda user data");
      const data = await response.json();
      if (data.entry !== null) await setSignIn(true);
      else await setSignIn(false);
    } catch (error) {
      console.error("Error fetching agenda user data:", error);
    }
  };

  const saveSignIn = async (userID: number, eventId: number) => {
    try {
      //console.log("save sign in");
      const response = await fetch("api/agendaUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: Number(userID)
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add event and/or user data");
      }
    } catch (error) {
      console.error("Error updating event and/or user data:", error);
    }
  }
  const saveSignOut = async (userID: number, eventId: number) => {
    try {
      //console.log("save sign out");
      const response = await fetch("api/agendaUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: Number(userID)
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
    if (session?.user?.id) {
      fetchEventData(eventId, session?.user.id);
    }
  }, [event.id, session]);



  return (
    <main>
      <div key={new Date(event.date).getMilliseconds()} className={styles.event}>
        <div className={styles.info}>
          <time dateTime={new Date(event.date).toISOString()} className={styles.eventDay}>
            {new Date(event.date).getDate()}
          </time>
          <div className={styles.eventName}>{event.name}</div>

        </div>
        {signedIn && (
          <button className={styles.signUp} onClick={() => setShowSignUp(true)}>Uitschrijven</button>
        )}
        {signedIn === false && (
          <button className={styles.signUp} onClick={() => setShowSignUp(true)}>Inschrijven</button>
        )}
      </div>

      {showSignUp && (
        <div className={styles.createPopUp}>
          <div className={styles.dialog}>
            <div className={styles.content}>
              <h1 className={styles.h1}>{event.name}</h1>
              <p className={styles.timeText}>
                {new Date(event.date).getUTCHours() + ":" + new Date(event.date).getUTCMinutes()}
              </p>
              <p className={styles.description}>{event.description}</p>
            </div>
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
