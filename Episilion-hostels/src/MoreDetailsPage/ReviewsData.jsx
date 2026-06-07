//import { useState } from 'react';
import fullStar from "../assets/icons/favorite.png";
import dayjs from "dayjs";
import { getInitials } from "../UTILS/initials";
import { sanitizeHTML } from "../UTILS/sanitize";

export function Reviews({ item }) {
  if (item === "no reviews") {
    return <p className="no-review-text">No reviews</p>;
  }

  const safeReview = sanitizeHTML(item.reviewText);
  //console.log("Review item:", item); // Debugging log to check the structure of the review item

  return (
    <>
      <div className="user-review-wrapper">
        <div className="rating-and-timestamp-container">
          <div className="review-source">
            <table border="0">
              <tr>
                <td rowspan="2" className="profile-picture">
                  <div className="user-button-pill-initials">
                    {getInitials(item.name)}
                  </div>
                </td>
                <td className="profile-name">{item.name}</td>
              </tr>
              <tr>
                <td>
                  <div className="time-stamp">
                    <p>
                      {dayjs(item.createdAt).format("MMMM D, YYYY, h:mm A")}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div className="users-ratings-display">
            {[...Array(item.rating)].map((_, i) => (
              <img loading='lazy'key={i} src={fullStar} alt="star" />
            ))}
          </div>
        </div>
        <div className="users-review-display">
          <div dangerouslySetInnerHTML={{ __html: safeReview }} />
        </div>
      </div>
    </>
  );
}
