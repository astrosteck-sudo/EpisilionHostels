import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./HostelManagerPage.css";
//import locationPin from "../assets/icons/pin.png";

export function HostelManagerPage() {


  const managerHostel = localStorage.getItem("managerUser")
  if (!managerHostel) {
    console.log("User is not logged in. Redirecting...");
    return <p>LOG IN AS A MANGER TO SEE THIS PAGE</p>
  }
  //console.log("manager hostel name", JSON.parse(managerHostel))
  //setManagerHostelName(JSON.parse(managerHostel).username)
  
  return (
    <>
      <title>Hostel Manager | Episilion Hostels</title>
      <div className="hostel-manager-info-container">
        <div>
          <p className="dashboard-text">HOSTEL MANAGER DASHBOARD</p>
          <h1 className="hostel-manager-welcome-text">
            Welcome back, {managerHostel && (JSON.parse(managerHostel).username)}👋
          </h1>

          <p className="hostel-manger-welcome-text-second">
            Edit and update your hostel infomation below. Changes go live
            immediately.
          </p>
        </div>

        <div className="verified-account-container">
          <p className="verified-account-hostel-name">{managerHostel && (JSON.parse(managerHostel).username)}</p>
          <p className="verified-account-text">Verified Manager Account</p>
        </div>
      </div>

      <form action="">
        <div className="hostel-manager-updates-container">
          <div className="hostel-manager-location-and-distance-container">
            <div className="hostel-manager-location-and-distance-header">
              <div className="hostel-manager-location-pin"> 📍</div>
              <p>Location & Distance</p>
            </div>

            <h3 className="hostel-manager-titles">HOSTEL DIRECTIONS</h3>
            <textarea type="text" className="hostel-manager-textarea" placeholder="Exit the school from the main gate then...." />

            <h3 className="hostel-manager-titles">
              HOSTEL DISTANCE FROM CAMPUS IN MINUTES
            </h3>
            <input type="number" className="hostel-manager-textarea" placeholder="2" />
          </div>

          <div className="hostel-manager-pricing-container">
            <div className="hostel-manager-pricing-header">
              <div className="hostel-manager-pricing-pin">💰</div>
              <p>Pricing</p>
            </div>

            <div className="hostel-manager-min-max-container">
              <div>
                <h3 className="hostel-manager-titles">MINIMUM PRICE (GHS)</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="e.g. 2500"
                />
              </div>
              <div>
                <h3 className="hostel-manager-titles">MAXIMUM PRICE (GHS)</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="e.g. 3000"
                />
              </div>
            </div>

            <div className="hostel-manager-installment-container">
              <h3 className="hostel-manager-titles">
                IS INSTALLMENT PAYMENT ALLOWED
              </h3>
              <div className="hostel-manager-installment-buttons">
                <button>✔️YES</button>
                <button>❌NO</button>
              </div>
            </div>
            <div className="hostel-manager-installment-container">
              <h3 className="hostel-manager-titles">ARE REFUNDS ALLOWED</h3>
              <div className="hostel-manager-installment-buttons">
                <button>✔️YES</button>
                <button>❌NO</button>
              </div>
            </div>
          </div>

          <div className="hostel-manager-additional-fees-container">
            <div className="hostel-manager-additional-fees-header">
              <div className="hostel-manager-additional-fees-pin">📃</div>
              <p>Additional Fees (GHS)</p>
            </div>

            <div className="hostel-manager-additional-fees-wrapper">
              <div>
                <h3 className="hostel-manager-titles">UTILITIES</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="0.00"
                />
              </div>

              <div>
                <h3 className="hostel-manager-titles">MAINTENANCE</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="0.00"
                />
              </div>

              <div>
                <h3 className="hostel-manager-titles">CAUTION DEPOSIT</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="hostel-manager-room-types-and-price-container">
            <div className="hostel-manager-room-types-and-price-header">
              <div className="hostel-manager-room-types-and-price-pin">🛏️</div>
              <p>Room Types & Price</p>
            </div>

            <div className="hostel-manager-room-types-and-price-wrapper">
              <div>
                <p>1 in 1</p>
                <input type="number" placeholder="0.00" />
                <p>GHS</p>
              </div>

              <div>
                <p>2 in 1</p>
                <input type="number" placeholder="0.00" />
                <p>GHS</p>
              </div>

              <div>
                <p>3 in 1</p>
                <input type="number" placeholder="0.00" />
                <p>GHS</p>
              </div>

              <div>
                <p>4 in 1</p>
                <input type="number" placeholder="0.00" />
                <p>GHS</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hostel-manager-submit-button-container">
          <button className="hostel-manager-discard-button" type="submit">
            Discard Changes
          </button>
          <button className="hostel-manager-save-changes-button" type="submit">
            Save Changes
          </button>
        </div>
      </form>

      <SiteFooter></SiteFooter>
    </>
  );
}

{
  /* <h3>Hostel Minimum Price</h3>
        <input type="text" />

        <h3>Hostel Maximum Price</h3>
        <input type="text" />
        <fieldset>
          <legend>Is Installment Allowed</legend>
          <input type="radio" />
          <label>Yes</label>
          <input type="radio" />
          <label>No</label>
        </fieldset>

        <fieldset>
          <legend>Are refunds allowed</legend>
          <input type="radio" />
          <label>Yes</label>
          <input type="radio" />
          <label>No</label>
        </fieldset>

        <h3>Hostel Additional Fees</h3>
        <label>Utilities</label>
        <input type="text" />
        <label>Maintenance</label>
        <input type="text" />
        <label>Caution Deposit</label>
        <input type="text" />

        <fieldset>
          <legend>Current Room types</legend>
          <label>2 in 1</label>
          <input type="number"></input>
          <label>3 in 1</label>
          <input type="number"></input>
          <label>4 in 1</label>
          <input type="number"></input>
          <label>1 in 1</label>
          <input type="number"></input>
        </fieldset>

        <div>
          <p>Save Changes</p>
        </div> */
}
