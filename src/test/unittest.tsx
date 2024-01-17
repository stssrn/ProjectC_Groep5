import sortData from "../app/admin/bugmeldingenbeheer/sortData";
const date1 = new Date();
const date2 = new Date();
date2.setMonth(date2.getMonth() + 1);
const date3 = new Date();
date3.setMonth(date3.getMonth() - 1);
interface BugReportWithUserId {
    id: number;
    userId: number,
    title: string;
    description: string;
    date: Date;
}
const bugReports: BugReportWithUserId[] = [
    { id: -1, userId: -1, title: "test 1", description: "test 1 description", date: date1 },
    { id: -2, userId: -2, title: "test 2", description: "test 2 description", date: date2 },
    { id: -3, userId: -3, title: "test 3", description: "test 3 description", date: date3 },
];

describe('sortData function', () => {
    // Test case for sorting by a specific criteria in ascending order
    it('should sort data in ascending order by a specified criteria', () => {
        // Arrange
        const sortCriteria = 'priority';
        const sortOrder = 'asc';

        // Act
        const result = sortData(bugReports, sortCriteria, sortOrder);
    ]);
});