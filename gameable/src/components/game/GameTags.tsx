import "./GameTags.css";

type Props = {
    tags: string[];
};

export function GameTags({ tags }: Props) {
    const normalize = (t: string) => t.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="accessibility-tags" role="list" aria-label="Accessibility tags">
            {tags.map((tag, i) => (
                <div
                    role="listitem"
                    key={i}
                    className={`accessibility-tag accessibility-tag--${normalize(tag)}`}
                    title={tag}
                    aria-label={tag}
                >
                    <span className="accessibility-tag__text">{tag}</span>
                </div>
            ))}
        </div>
    );
}
