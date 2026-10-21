/**
 * Small, reusable pieces that give every form in the app the same
 * professional error / success feedback.
 *
 * They are intentionally dependency-free and screen-reader friendly.
 */

/**
 * Inline message shown directly beneath a form field.
 *
 * @param {object} props
 * @param {string} [props.message] - the text to show
 * @param {string} [props.id] - id of the input this message describes
 * @param {"error"|"success"|"warning"} [props.type="error"]
 */
export function FieldMessage({ message, id, type = "error" }) {
  if (!message) return null;

  return (
    <p
      className={`form-field-message form-field-message--${type}`}
      id={id}
      role={type === "error" ? "alert" : "status"}
    >
      <span className="form-field-message__icon" aria-hidden="true">
        {type === "success" ? "✓" : type === "warning" ? "!" : "!"}
      </span>
      <span>{message}</span>
    </p>
  );
}

/**
 * A banner shown above or below a form for whole-form problems
 * (failed login, rate limiting, network errors).
 *
 * @param {object} props
 * @param {string} [props.message]
 * @param {"error"|"success"|"warning"|"info"} [props.type="error"]
 * @param {string} [props.title] - optional bold heading
 */
export function FormAlert({ message, type = "error", title }) {
  if (!message) return null;

  const icons = {
    error: "!",
    success: "✓",
    warning: "!",
    info: "i",
  };

  return (
    <div
      className={`form-alert form-alert--${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="form-alert__icon" aria-hidden="true">
        {icons[type] ?? icons.error}
      </span>
      <div className="form-alert__body">
        {title && <p className="form-alert__title">{title}</p>}
        <p className="form-alert__message">{message}</p>
      </div>
    </div>
  );
}

/**
 * Friendly message shown when a request could not reach the server.
 * Gives the user something actionable rather than a bare error string.
 */
export function ConnectionHelp() {
  return (
    <ul className="form-help-list">
      <li>Check that your internet connection is working.</li>
      <li>Refresh the page and try again.</li>
      <li>If it keeps happening, contact support.</li>
    </ul>
  );
}
