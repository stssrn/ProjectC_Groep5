import sortData from "../app/admin/bugmeldingenbeheer/sortData";

const date1 = new Date();
const date2 = new Date();
const date3 = new Date();

date2.setMonth(date2.getMonth() + 1);
date3.setMonth(date3.getMonth() - 1);

interface BugReportWithUserId {
    id: number;
    userId: number,
    title: string;
    description: string;
    date: Date;
}

const bugReportsUnSorted: BugReportWithUserId[] = [

    { id: -3, userId: -3, title: "C", description: "test 3 description", date: date3 },
    { id: -1, userId: -1, title: "A", description: "test 1 description", date: date1 },
    { id: -2, userId: -2, title: "B", description: "test 2 description", date: date2 },

];

const bugReportsCorrectOrderIdAsc: BugReportWithUserId[] = [

    { id: -3, userId: -3, title: "C", description: "test 3 description", date: date3 },
    { id: -2, userId: -2, title: "B", description: "test 2 description", date: date2 },
    { id: -1, userId: -1, title: "A", description: "test 1 description", date: date1 },
];

const bugReportsCorrectOrderDateDesc: BugReportWithUserId[] = [
    { id: -2, userId: -2, title: "B", description: "test 2 description", date: date2 },
    { id: -1, userId: -1, title: "A", description: "test 1 description", date: date1 },
    { id: -3, userId: -3, title: "C", description: "test 3 description", date: date3 },
];

const bugReportsCorrectOrderTitleAsc: BugReportWithUserId[] = [
    { id: -1, userId: -1, title: "A", description: "test 1 description", date: date1 },
    { id: -2, userId: -2, title: "B", description: "test 2 description", date: date2 },
    { id: -3, userId: -3, title: "C", description: "test 3 description", date: date3 },
];


test('sortdata function by id ascending', () => {
    const sortedBugReports = sortData('asc', 'id', bugReportsUnSorted);
    expect(sortedBugReports).toEqual(bugReportsCorrectOrderIdAsc);
});

test('sortdata function by date descending', () => {
    const sortedBugReports = sortData('desc', 'date', bugReportsUnSorted);
    expect(sortedBugReports).toEqual(bugReportsCorrectOrderDateDesc);
});

test('sortdata function by title ascending', () => {
    const sortedBugReports = sortData('asc', 'title', bugReportsUnSorted);
    expect(sortedBugReports).toEqual(bugReportsCorrectOrderTitleAsc);
});