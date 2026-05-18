import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./changePasswordPage.css";
import passwordImage from "../assets/icons/shield.png";

export function ChangePasswordPage({ managerIsLoggedIn }) {
  if (!managerIsLoggedIn) {
    console.log("User is not logged in. Redirecting...");
    return <p>LOG IN AS A MANGER TO SEE THIS PAGE</p>;
  }

  return (
    <>
      <form action="" className="hostel-manager-change-password-form">
        <div className="hostel-manager-password-change-header-container">
          <img
            src={passwordImage}
            alt=""
            className="hostel-manager-password-change-header-image"
          />
          <p className="hostel-manager-password-change-header-paragragh">
            Change password
          </p>
          <p className="hostel-manager-password-change-header-second-paragraph">
            Keep your account secure with a strong password
          </p>
        </div>

        <div className="hostel-manager-password-change-main-container">
          <label
            for=""
            className="hostel-manager-password-change-input-headers"
          >
            OLD PASSWORD
          </label>
          <input type="text" className="hostel-manager-password-change-input" />

          <label
            htmlFor=""
            className="hostel-manager-password-change-input-headers"
          >
            NEW PASSWORD
          </label>
          <input
            type="text"
            name=""
            id=""
            className="hostel-manager-password-change-input"
          />

          <label
            htmlFor=""
            className="hostel-manager-password-change-input-headers"
          >
            COMFIRM PASSWORD
          </label>
          <input type="text" className="hostel-manager-password-change-input" />

          <div className="hostel-manager-password-change-password-warning">
            Use at least 8 characters with a mix of letters, number and symbols
            for a stronger password
          </div>

          <div className="hostel-manager-password-change-form-buttons">
            <input type="submit" value="Update Password" className="hostel-manager-password-change-form-button-sumbit" />
            <input type="reset" value="Clear Form" className="hostel-manager-password-change-form-button-clearButton" />
          </div>
        </div>
      </form>

      <SiteFooter></SiteFooter>
    </>
  );
}
