type Props = {
    rating: number;
};

export function GameStars({ rating }: Props) {
    console.log(rating)
    // Clamp rating so it always stays between 0 and 5
    const safeRating = Math.max(0, Math.min(5, rating || 0));
    console.log(safeRating)
    const filledStars = Math.floor(safeRating);
    console.log(filledStars)
    const halfStar = safeRating % 1 !== 0;

    return (
        <span>
      {"★".repeat(filledStars)}
            {halfStar && "☆"}
            {"☆".repeat(5 - filledStars - (halfStar ? 1 : 0))}
    </span>
    );
}
