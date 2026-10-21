import { useCallback, useState } from "react";
import {
  getErrorMessage,
  isAuthError,
  isNetworkOrServerError,
  isRateLimitError,
} from "../UTILS/apiError";

/**
 * Shared state machine for submitting a form and showing its feedback.
 *
 * Handles the three things every form in this app needs:
 *   1. a submitting flag so the button can lock itself,
 *   2. a single form-level alert (server / network / rate-limit problems),
 *   3. per-field error messages driven by the shared validation module.
 *
 * @param {object} [options]
 * @param {Function} [options.onSuccess] - called with the API response on success
 * @param {Function} [options.onError] - called with the raw error on failure
 * @param {string} [options.fallbackMessage] - message used when the server gives nothing useful
 * @param {Function} [options.mapError] - (error) => { type, title, message } to override the default mapping
 */
export function useFormSubmission(options = {}) {
  const { onSuccess, onError, fallbackMessage, mapError } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Lets us clear a field's error as soon as the user starts fixing it.
  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const setFieldError = useCallback((field, message) => {
    setFieldErrors((current) => ({ ...current, [field]: message }));
  }, []);

  const setFieldErrorsFrom = useCallback((errors) => {
    setFieldErrors(errors ?? {});
  }, []);

  const clearAlert = useCallback(() => setAlert(null), []);

  /**
   * Run an async submit handler, tracking submitting state and turning any
   * thrown error into a form-level alert.
   *
   * @param {Function} task - the async function to run
   * @param {object} [config]
   * @param {boolean} [config.clearAlertOnStart=true]
   */
  const run = useCallback(
    async (task, config = {}) => {
      const { clearAlertOnStart = true } = config;

      if (clearAlertOnStart) setAlert(null);
      setIsSubmitting(true);

      try {
        const result = await task();
        onSuccess?.(result);
        return result;
      } catch (error) {
        onError?.(error);

        if (mapError) {
          setAlert(mapError(error));
        } else {
          setAlert({
            type: "error",
            title: isRateLimitError(error)
              ? "Too many attempts"
              : isAuthError(error)
                ? "Session expired"
                : "We couldn't sign you in",
            message: getErrorMessage(error, { fallback: fallbackMessage }),
            showConnectionHelp: isNetworkOrServerError(error),
          });
        }

        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess, onError, mapError, fallbackMessage],
  );

  return {
    isSubmitting,
    alert,
    fieldErrors,
    setAlert,
    clearAlert,
    setFieldError,
    setFieldErrorsFrom,
    clearFieldError,
    run,
  };
}

/**
 * Keeps the focus on the first element that failed validation so keyboard
 * and screen-reader users are taken straight to the problem.
 */
export function focusFirstInvalid(formElement) {
  if (!formElement) return;

  const invalidField = formElement.querySelector('[aria-invalid="true"]');
  if (invalidField) {
    invalidField.focus();
    return;
  }

  const invalidGroup = formElement.querySelector("[data-invalid='true']");
  invalidGroup?.focus?.();
}
