import React from 'react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxStars = 5 }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
};

export default RatingStars;
