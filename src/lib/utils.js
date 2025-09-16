import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function exportToCSV(data, filename) {
    if (data.length === 0) {
        return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(","),
        ...data.map((row) => headers
            .map((header) => {
            const value = row[header];
            if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
            }
            return value;
        })
            .join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
