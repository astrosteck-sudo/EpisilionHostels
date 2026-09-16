import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./changePasswordPage.css";
import passwordImage from "../assets/icons/shield.png";
import { useState } from "react";
import axios from "axios";

export function ChangePasswordPage({ managerIsLoggedIn }) {
  const [hostelManagerOldpassword, setHostelManagerOldPassword] = useState("");
  const [hostelMangerNewPaswword, setHostelManagerNewPassword] = useState("");
  const [hostelManagerComfirmPassword, setHostelManagerComfirmPassword] =
    useState("");
  const [passwordUpdateSuccessfull, setPasswordUpdateSuccessfull] = useState();

  if (!managerIsLoggedIn) {
    console.log("User is not logged in. Redirecting...");
    return <p className="login-To-see-this-page">LOG IN AS A MANGER TO SEE THIS PAGE</p>;
  }

  function handleOldPassword(e) {
    setHostelManagerOldPassword(e.target.value);
  }

  function handleNewPassword(e) {
    setHostelManagerNewPassword(e.target.value);
  }

  function handleComfirmPassword(e) {
    setHostelManagerComfirmPassword(e.target.value);
  }

  const managerToken = localStorage.getItem("managerToken");
  const updateManagerPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "/api/manager/update-hostel-password",

        {
          hostelManagerOldpassword: hostelManagerOldpassword,
          hostelMangerNewPaswword: hostelMangerNewPaswword,
          hostelManagerComfirmPassword: hostelManagerComfirmPassword,
        },

        {
          headers: {
            Authorization: `Bearer ${managerToken}`,
          },
        },
      );
      console.log(response.data);
      setPasswordUpdateSuccessfull("Update Successful");
      setTimeout(() => {
        setPasswordUpdateSuccessfull("");
      }, 2000);
    } catch (error) {
      setPasswordUpdateSuccessfull("Update not Successful Try Again !!");
      setTimeout(() => {
        setPasswordUpdateSuccessfull("");
      }, 2000);
      console.log("Update failed:", error.response?.data || error.message);
    }
  };

  function handleClearForm() {
    setHostelManagerOldPassword("");
    setHostelManagerNewPassword("");
    setHostelManagerComfirmPassword("");
  }

  return (
    <>
      <form
        action=""
        className="hostel-manager-change-password-form"
        onSubmit={updateManagerPassword}
      >
        <div>
          <div className="hostel-manager-password-change-header-container">
            <div className="hostel-manager-password-change-header-image">
              <img
                src={passwordImage}
                alt="Security Icon"
              />
            </div>
            <p className="hostel-manager-password-change-header-paragragh">
              Change Password
            </p>
            <p className="hostel-manager-password-change-header-second-paragraph">
              Keep your account secure with a strong password
            </p>
          </div>

          <div className="hostel-manager-password-change-main-container">
            <label
              htmlFor="oldPassword"
              className="hostel-manager-password-change-input-headers"
            >
              OLD PASSWORD
            </label>
            <input
              type="password"
              id="oldPassword"
              className="hostel-manager-password-change-input"
              value={hostelManagerOldpassword}
              onChange={handleOldPassword}
              placeholder="Enter your current password"
            />

            <label
              htmlFor="newPassword"
              className="hostel-manager-password-change-input-headers"
            >
              NEW PASSWORD
            </label>
            <input
              type="password"
              id="newPassword"
              className="hostel-manager-password-change-input"
              value={hostelMangerNewPaswword}
              onChange={handleNewPassword}
              placeholder="Enter your new password"
            />

            <label
              htmlFor="confirmPassword"
              className="hostel-manager-password-change-input-headers"
            >
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="hostel-manager-password-change-input"
              value={hostelManagerComfirmPassword}
              onChange={handleComfirmPassword}
              placeholder="Confirm your new password"
            />

            <div
              className={`hostel-manager-password-change-update-success ${passwordUpdateSuccessfull === "Update Successful" ? "success" : "notSuccess"}`}
            >
              {passwordUpdateSuccessfull}
            </div>

            <div className="hostel-manager-password-change-password-warning">
              Use at least 8 characters with a mix of letters, number and
              symbols for a stronger password
            </div>

            <div className="hostel-manager-password-change-form-buttons">
              <input
                type="submit"
                value="Update Password"
                className="hostel-manager-password-change-form-button-sumbit"
              />
              <input
                type="button"
                value="Clear Form"
                className="hostel-manager-password-change-form-button-clearButton"
                onClick={handleClearForm}
              />
            </div>
          </div>
        </div>
      </form>

      
    </>
  );
}
