import "./GameTags.css";

type TagLabel = "Visual" | "Audio" | "Motor" | "Cognitive";

type Props = {
    tags: TagLabel[];
};

// map human-readable tags to the CSS modifier keys used in GameTags.css
const tagToModifier: Record<TagLabel, string> = {
    Visual: "vision",
    Audio: "hearing",
    Motor: "motor",
    Cognitive: "cognitive",
};

export function GameTags({ tags }: Props) {
    const modifierFor = (t: TagLabel) => tagToModifier[t] || t.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="accessibility-tags" role="list" aria-label="Accessibility tags">
            {tags.map((tag, i) => {
                const mod = modifierFor(tag);
                return (
                    <div
                        role="listitem"
                        key={i}
                        className={`accessibility-tag accessibility-tag--${mod}`}
                        title={tag}
                        aria-label={tag}
                    >
                        <span className="accessibility-tag__text">{tag}</span>
                    </div>
                );
            })}
        </div>
    );
}