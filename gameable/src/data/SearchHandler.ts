import React, { type RefObject } from "react";
import type { NavigateFunction } from "react-router-dom";
import { sanitiseSearch } from "./InputSanitation";

/*
    * A submit handler for the search bar form.
    * @param searchRef - A ref object pointing to the search input element.
    * @param navigate - The navigate function from react-router-dom.
    * @returns A function that handles the form submission event.
*/

export function SearchHandler(
    searchRef: RefObject<HTMLInputElement | null>,
    navigate: NavigateFunction
) {
    return (e: React.FormEvent) => {
        e.preventDefault();
        // Getting the raw input value
        const raw = searchRef.current?.value ?? "";
        // Passing it through sanitiseSearch
        const sanitised = sanitiseSearch(raw);
        if (!sanitised) return;
        navigate(`/search?q=${encodeURIComponent(sanitised)}`);
    };
}