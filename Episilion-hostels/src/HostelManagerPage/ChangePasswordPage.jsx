import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./changePasswordPage.css";
import passwordImage from "../assets/icons/shield.png";
import { useState, useEffect } from "react";
import axios from "axios";

export function ChangePasswordPage({ managerIsLoggedIn }) {
  const [hostelManagerOldpassword, setHostelManagerOldPassword] = useState("");
  const [hostelMangerNewPaswword, setHostelManagerNewPassword] = useState("");
  const [hostelManagerComfirmPassword, setHostelManagerComfirmPassword] =
    useState("");
  const [passwordUpdateSuccessfull, setPasswordUpdateSuccessfull] = useState();

  useEffect(() => {
    document.body.classList.add("body-bg");
    return () => {
      document.body.classList.remove("body-bg");
    };
  }, []);

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
    console.log("submit pressesd");

    try {
      const response = await axios.put(
        "https://episilion-backend-2lt0.onrender.com/api/manager/update-hostel-password",

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
            <input
              type="text"
              className="hostel-manager-password-change-input"
              value={hostelManagerOldpassword}
              onChange={handleOldPassword}
            />

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
              value={hostelMangerNewPaswword}
              onChange={handleNewPassword}
            />

            <label
              htmlFor=""
              className="hostel-manager-password-change-input-headers"
            >
              COMFIRM PASSWORD
            </label>
            <input
              type="text"
              className="hostel-manager-password-change-input"
              value={hostelManagerComfirmPassword}
              onChange={handleComfirmPassword}
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

      <SiteFooter></SiteFooter>
    </>
  );
}
