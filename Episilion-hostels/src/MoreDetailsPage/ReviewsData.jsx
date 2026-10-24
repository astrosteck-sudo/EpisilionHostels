//import { useState } from 'react';
import fullStar from "../assets/icons/favorite.png";
import dayjs from "dayjs";
import { getInitials } from "../UTILS/initials";
import { sanitizeHTML } from "../UTILS/sanitize";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export function Reviews({ item }) {
  const safeReview = sanitizeHTML(item.reviewText);
  const createdAt = item.createdAt || item.created_at;

  return (
    <article className="user-review-wrapper">
      <div className="user-review-name-and-star-container">
        <h3>{getInitials(item.name)}</h3>
        <div className="users-ratings-display" aria-label={`${item.rating} out of 5 stars`}>
          {[...Array(Number(item.rating) || 0)].map((_, index) => (
            <img
              loading="lazy"
              key={index}
              src={fullStar}
              alt=""
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      {createdAt && (
        <p className="users-review-time">{dayjs(createdAt).fromNow()}</p>
      )}
      {safeReview && (
        <div
          dangerouslySetInnerHTML={{ __html: safeReview }}
          className="user-review-text"
        />
      )}
    </article>
  );
}
