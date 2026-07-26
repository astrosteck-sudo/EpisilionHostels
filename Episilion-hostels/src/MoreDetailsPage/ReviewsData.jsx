//import { useState } from 'react';
import fullStar from "../assets/icons/favorite.png";
import dayjs from "dayjs";
import { getInitials } from "../UTILS/initials";
import { sanitizeHTML } from "../UTILS/sanitize";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export function Reviews({ item }) {
  if (item === "no reviews") {
    return <p className="no-review-text">No reviews</p>;
  }

  
  const safeReview = sanitizeHTML(item.reviewText);
  //console.log("Review item:", item); // Debugging log to check the structure of the review item

  return (
    <>
      <div className="user-review-wrapper">
        <div className="user-review-name-and-star-container">
          <h1>{getInitials(item.name)}</h1>
          <div className="users-ratings-display">
            {[...Array(item.rating)].map((_, i) => (
              <img loading='lazy'key={i} src={fullStar} alt="star" />
            ))}
          </div>
        </div>
        <p className="users-review-time">{dayjs(item.createdAt).fromNow()}</p>
        <div dangerouslySetInnerHTML={{ __html: safeReview }} className="user-review-text" />
      </div>
    </>
  );
}
