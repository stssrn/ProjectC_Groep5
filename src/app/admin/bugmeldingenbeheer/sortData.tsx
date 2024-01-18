type sortingDirection = 'asc' | 'desc';
interface BugReportWithUserId {
    id: number;
    userId: number,
    title: string;
    description: string;
    date: Date;
}

export default function sortData(sortorder: sortingDirection, sortcriteria: string, reports: BugReportWithUserId[]) {
    const sortedData = [...reports];
    sortedData.sort((a, b) => {
        const valueA = (a as any)[sortcriteria];
        const valueB = (b as any)[sortcriteria];

        if (sortorder === 'asc') {
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
        } else {
            if (valueA > valueB) return -1;
            if (valueA < valueB) return 1;
        }

        return 0;
    });
    return sortedData;
}
