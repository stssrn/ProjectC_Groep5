export interface AgendaEvent {
  name: string;
  date: Date;
}

export type Calendar = { [key: string]: AgendaEvent[] };

const agendaData: Calendar = {
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

const monthFromDate = Intl.DateTimeFormat("nl", { month: "long" }).format;

const events: AgendaEvent[] = Array.from({ length: 40 }, Math.random)
  .map((x) => ({
    name: Math.round(Math.random()) ? "Meeting" : "Cursus",
    date: new Date(new Date().getTime() + x * (365 * 24 * 60 * 60 * 1000)),
  }))
  .toSorted((a, b) => a.date.getTime() - b.date.getTime());

for (const date of events) {
  const month = monthFromDate(date.date);
  agendaData[month].push(date);
}

export default agendaData;