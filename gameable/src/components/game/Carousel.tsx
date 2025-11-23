import { useState } from "react";
import type { ReactElement, CSSProperties } from "react";
import "./Carousel.css";

//Carousel arrow images
import arrowLeft from "../../assets/gamePageImages/arrowLeft.png";
import arrowRight from "../../assets/gamePageImages/arrowRight.png";

type Props = {
    id: string;
    items: ReactElement[];
    visibleCount?: number;
    step?: number;
};

export function Carousel({ id, items, visibleCount = 1, step = 1 }: Props) {
    const [current, setCurrent] = useState(0);
    const total = items.length;
    if (total === 0) return null;

    const raw = Math.max(1, step);
    const s = (raw % total) || total;

    const prev = () => setCurrent((c) => (c - s + total) % total);
    const next = () => setCurrent((c) => (c + s) % total);

    // don't render duplicate items when there are fewer items than requested visible slots
    const actualVisible = Math.min(visibleCount, total);

    // show controls only when there are more items than the rendered slots
    const showControls = total > actualVisible;

    const visibleElements = Array.from({ length: actualVisible }).map((_, i) => {
        const idx = (current + i) % total;
        return (
            <div className="carousel-item-flex" key={i}>
                {items[idx]}
            </div>
        );
    });

    // expose the actual visible count to CSS so sizing matches the rendered items
    const cssVars = ({ ["--visible-count"]: String(actualVisible) } as unknown) as CSSProperties;

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
