"use client";
import styles from "./page.module.css";
import Container from "../components/Container";
import Event from "./Event";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { monthNames } from "@/lib/agenda";
import agendaData2 from "@/lib/agenda";


interface AgendaEvent {
  id: number,
  date: Date,
  name: string,
  description: string,
}
interface MonthData {
  [key: string]: AgendaEvent[]; // Assuming each month has an array of AgendaData
}

const Page = () => {
  const defaultData: MonthData = {
    januari: [],
    februari: [],
    maart: [],
    april: [],
    mei: [],
    juni: [],
    juli: [],
    augustus: [],
    september: [],
    oktober: [],
    november: [],
    december: [],
  };

  const [agendaData, setAgendaData] = useState<MonthData>(defaultData);


  const fetchAgendaData = async () => {
    try {
      console.log(agendaData2);
      const eventId = 0;
      const response = await fetch(`api/event?id=${eventId}`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch agenda data");

      const fetchedData = await response.json();
      const organizedData: MonthData = {
        januari: [],
        februari: [],
        maart: [],
        april: [],
        mei: [],
        juni: [],
        juli: [],
        augustus: [],
        september: [],
        oktober: [],
        november: [],
        december: [],
      };

      fetchedData.events.forEach((event: AgendaEvent) => {
        event.date = new Date(event.date);

        const eventMonth = event.date.getMonth();
        const monthName = getMonthName(eventMonth + 1);

        if (organizedData.hasOwnProperty(monthName)) {
          organizedData[monthName].push(event);
        }
      });

      setAgendaData({ ...agendaData, ...organizedData });
    } catch (error) {
      console.error("Error fetching agenda data:", error);
    }
  };

  const getMonthName = (monthNumber: number) => {
    const monthNames = [
      "januari",
      "februari",
      "maart",
      "april",
      "mei",
      "juni",
      "juli",
      "augustus",
      "september",
      "oktober",
      "november",
      "december",
    ];

    return monthNames[monthNumber - 1];
  };
  useEffect(() => {
    fetchAgendaData();
  }, []);
  // the month a new year starts, and works in case there are no events in
  // January. Assumes there are no events planned more than a year in advance.
  const newYearMonth = Object.entries(agendaData)
    .filter(([_, events]) => events.length)
    .map(([month, _]) => month)
    .find((m, i) => monthNames.indexOf(m) <= i);

  let currentYear: Date;
  currentYear = new Date("YYYY");
  const eventElements = Object.entries(agendaData)
    .filter(([_, events]) => events.length)
    .map(([month, events]) => (
      <div key={month} className={clsx(styles.month, styles[month])}>
        {month === newYearMonth && <h1>{Number(currentYear) + 1}</h1>}
        <h2 className={styles.monthName}>{month}</h2>
        <div className={styles.eventsWrapper}>
          <div className={clsx(styles.bar, styles[month])}></div>
          <div className={styles.events}>
            {events.map((e) => (
              <Event key={e.date.getDate()} event={e} />
            ))}
          </div>
        </div>
      </div>
    ));

  return (
    <Container title="Agenda">
      <div className={styles.months}>{eventElements}</div>
    </Container>
  );
};

export default Page; //
