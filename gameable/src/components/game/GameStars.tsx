type Props = {
    rating: number;
};

export function GameStars({ rating }: Props) {
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    return (
        <span>
      {"★".repeat(filledStars)}
            {halfStar && "☆"}
            {"☆".repeat(5 - filledStars - (halfStar ? 1 : 0))}
    </span>
    );
}
