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

const events: AgendaEvent[] = Array.from({ length: 30 }, Math.random)
  .map((x) => ({
    name: Math.round(Math.random()) ? "Meeting" : "Cursus",
    date: new Date(Date.now() + x * (330 * 24 * 60 * 60 * 1000)),
  }))
  .toSorted((a, b) => a.date.getTime() - b.date.getTime());

for (const date of events) {
  const month = monthFromDate(date.date);
  agendaData[month].push(date);
}

const partitioned = Object.entries(agendaData).reduce(
  (acc, x) => {
    if ((x[1].at(0)?.date.getMonth() ?? 0) >= new Date().getMonth()) {
      acc[1].push(x);
    } else {
      acc[0].push(x);
    }
    return acc;
  },
  [[], []] as [[string, AgendaEvent[]][], [string, AgendaEvent[]][]],
);

const monthShifted = Object.fromEntries([...partitioned[1], ...partitioned[0]]);

export default monthShifted;
