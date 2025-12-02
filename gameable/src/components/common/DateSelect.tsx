import { useEffect, useMemo, useState } from "react";

type Props = {
    value?: string;              // optional initial value "YYYY-MM-DD"
    onChange: (isoDate: string) => void;
    minYear?: number;
    maxYear?: number;
    allowPartial?: boolean;      // if true, emit partial like "YYYY-" or "YYYY-MM-"
};

function daysInMonth(year: number, month: number): number {
    // month: 1..12
    return new Date(year, month, 0).getDate();
}

function split(value?: string) {
    if (!value) return { y: "", m: "", d: "" };
    const [y, m, d] = value.split("-");
    return { y: y || "", m: m || "", d: d || "" };
}

export default function DateSelect({
                                       value,
                                       onChange,
                                       minYear = 1970,
                                       maxYear = new Date().getFullYear() + 5,
                                       allowPartial = false,
                                   }: Props) {
    // Internal state keeps the UI stable even when parent value is empty
    const initial = split(value);
    const [y, setY] = useState(initial.y);
    const [m, setM] = useState(initial.m);
    const [d, setD] = useState(initial.d);

    // If parent changes `value` (e.g., reset), reflect that here
    useEffect(() => {
        const next = split(value);
        setY(next.y);
        setM(next.m);
        setD(next.d);
    }, [value]);

    // Compute max valid day for current year/month
    const maxDay = useMemo(() => {
        const yn = Number(y);
        const mn = Number(m);
        if (!Number.isFinite(yn) || !Number.isFinite(mn) || yn <= 0 || mn <= 0) return 31;
        return daysInMonth(yn, mn);
    }, [y, m]);

    // Clamp day when month/year changes
    useEffect(() => {
        if (d) {
            const dn = Number(d);
            if (dn > maxDay) {
                setD(String(maxDay).padStart(2, "0"));
            }
        }
    }, [maxDay, d]);

    // Emit to parent whenever something changes
    useEffect(() => {
        if (y && m && d) {
            onChange(`${y}-${m}-${d}`);
        } else if (allowPartial) {
            // Emit partial string (you can tailor this format as needed)
            const partial = `${y || ""}-${m || ""}-${d || ""}`;
            onChange(partial);
        } else {
            onChange("");
        }
    }, [y, m, d, allowPartial, onChange]);

    // Options
    const years: number[] = [];
    for (let Y = maxYear; Y >= minYear; Y--) years.push(Y);

    const months = [
        { v: "01", label: "January" },
        { v: "02", label: "February" },
        { v: "03", label: "March" },
        { v: "04", label: "April" },
        { v: "05", label: "May" },
        { v: "06", label: "June" },
        { v: "07", label: "July" },
        { v: "08", label: "August" },
        { v: "09", label: "September" },
        { v: "10", label: "October" },
        { v: "11", label: "November" },
        { v: "12", label: "December" },
    ];

    const days = Array.from({ length: maxDay }, (_, i) => String(i + 1).padStart(2, "0"));

    return (
        <div style={{ display: "flex", gap: "8px" }}>
            {/* Day */}
            <select aria-label="Day" value={d} onChange={(e) => setD(e.target.value)}>
                <option value="">{d ? "Day" : "Day"}</option>
                {days.map((dv) => (
                    <option key={dv} value={dv}>
                        {Number(dv)}
                    </option>
                ))}
            </select>

            {/* Month */}
            <select aria-label="Month" value={m} onChange={(e) => setM(e.target.value)}>
                <option value="">{m ? "Month" : "Month"}</option>
                {months.map((mm) => (
                    <option key={mm.v} value={mm.v}>
                        {mm.label}
                    </option>
                ))}
            </select>

            {/* Year */}
            <select aria-label="Year" value={y} onChange={(e) => setY(e.target.value)}>
                <option value="">{y ? "Year" : "Year"}</option>
                {years.map((Y) => (
                    <option key={Y} value={String(Y)}>
                        {Y}
                    </option>
                ))}
            </select>
        </div>
    );
}
