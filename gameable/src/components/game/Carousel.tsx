import { useState } from "react";
import type { ReactElement, CSSProperties } from "react";
import "./Carousel.css";

//Carousel arrow images
import arrowLeft from "../../assets/temporaryGamePageImages/arrowLeft.png";
import arrowRight from "../../assets/temporaryGamePageImages/arrowRight.png";

type Props = {
    id: string;
    items: ReactElement[];
    visibleCount?: number;
    step?: number;
};

export function Carousel({ id, items, visibleCount = 1, step = 1 }: Props) {
    // index of the first visible item
    const [current, setCurrent] = useState(0);
    const total = items.length;
    if (total === 0) return null;

    // normalize step to at least 1 and wrap to total
    const raw = Math.max(1, step);
    const s = (raw % total) || total;

    // advance/rewind the current index with wrap-around
    const prev = () => setCurrent((c) => (c - s + total) % total);
    const next = () => setCurrent((c) => (c + s) % total);

    // only show navigation when there are more items than visible slots
    const showControls = total > visibleCount;

    // build the visible set of elements based on current index
    const visibleElements = Array.from({ length: visibleCount }).map((_, i) => {
        const idx = (current + i) % total; // wrap index safely
        return (
            <div className="carousel-item-flex" key={i}>
                {items[idx]}
            </div>
        );
    });

    // expose visible count to CSS via a custom property used in Carousel.css
    const cssVars = ({ ["--visible-count"]: String(visibleCount) } as unknown) as CSSProperties;

    return (
        <div id={id} className="game-carousel" style={cssVars}>
            <div className="carousel-viewport">
                <div className="carousel-track" role="list">
                    {visibleElements}
                </div>
            </div>

            {showControls && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous"
                        className="control-btn control-left"
                    >
                        <img src={arrowLeft} alt="" className="control-arrow" />
                    </button>

                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next"
                        className="control-btn control-right"
                    >
                        <img src={arrowRight} alt="" className="control-arrow" />
                    </button>
                </>
            )}
        </div>
    );
}
