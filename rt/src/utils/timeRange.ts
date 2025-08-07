/**
 * Generate all dates in a month with start and end times
 */
export const getMonthRange = (year: number, month: number) => {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const labelDate = new Date(Date.UTC(year, month - 1, day));
        return {
            name: day,
            label: labelDate.toISOString().slice(0, 10),
            start: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString(),
            end: new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString(),
        };
    });
};

/**
 * Generate all months in a year with start and end times
 */
export const getYearRange = (year: number) => {
    return Array.from({ length: 12 }, (_, i) => {
        const start = new Date(Date.UTC(year, i, 1, 0, 0, 0, 0));
        const end = new Date(Date.UTC(year, i + 1, 0, 23, 59, 59, 999));
        return {
            name: i + 1,
            label: start.toISOString().slice(0, 7),
            start: start.toISOString(),
            end: end.toISOString(),
        };
    });
};

/**
 * Get current start and end time based on current filter
 */
export const getCurrentRange = (
    viewMode: "month" | "year",
    filters: { year: number; month: number }
) => {
    if (viewMode === "month") {
        const start = new Date(Date.UTC(filters.year, filters.month - 1, 1, 0, 0, 0, 0)).toISOString();
        const end = new Date(Date.UTC(filters.year, filters.month, 0, 23, 59, 59, 999)).toISOString();
        return { start, end };
    } else {
        const start = new Date(Date.UTC(filters.year, 0, 1, 0, 0, 0, 0)).toISOString();
        const end = new Date(Date.UTC(filters.year, 11, 31, 23, 59, 59, 999)).toISOString();
        return { start, end };
    }
};
