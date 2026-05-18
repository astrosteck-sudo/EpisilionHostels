import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./HostelManagerPage.css";
import axios from "axios";
import { useEffect, useState } from "react";
//import locationPin from "../assets/icons/pin.png";

export function HostelManagerPage() {
  const [hostelManagerRoomTypes, setHostelManagerRoomTypes] = useState([]);
  //const [hostelGeneralInfo, setHostelGeneralInfo] = useState('')
  const managerHostel = localStorage.getItem("managerUser");
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)

  const [hostelDirections, setHostelDirections] = useState('');
  const [
    hostelDistanceFromCampusInMinutes,
    setHostelDistanceFromCampusInMinutes,
  ] = useState("");
  const [hostelMinimumPrice, setHostelMinimumPrice] = useState("");
  const [hostelMaximumPrice, setHostelMaximumPrice] = useState("");
  const [installmentAllowed, setInstallmentAllowed] = useState(0);
  const [refundsAllowed, setRefundsAllowed] = useState("");
  const [utilities, setUtilities] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [cautionDeposit, setCautionDeposit] = useState("");
  // const [roomTypesAndPrice, setRoomTypesAndPrice] = useState(
  //   hostelManagerRoomTypes,
  // );
  //const [installmentButtonActive, setInstallmentButtonActive] = useState(false)

  function handleHostelDirectionsChange(e) {
    setHostelDirections(e.target.value);
  }
  function handleHostelDistanceFromCampusInMinutesChange(e) {
    setHostelDistanceFromCampusInMinutes(e.target.value);
  }
  function handleHostelMinimumPriceChange(e) {
    setHostelMinimumPrice(e.target.value);
  }
  function handleHostelMaximumPriceChange(e) {
    setHostelMaximumPrice(e.target.value);
  }
  function handleInstallmentAllowedChange(parameter) {
    setInstallmentAllowed(parameter);
  }
  function handleRefundsAllowedChange(parameter) {
    setRefundsAllowed(parameter);
  }
  function handleUtilitiesChange(e) {
    setUtilities(e.target.value);
  }
  function handleMaintenanceChange(e) {
    setMaintenance(e.target.value);
  }
  function handleCautionDepositChange(e) {
    setCautionDeposit(e.target.value);
  }

  // if (!managerHostel) {
  //   console.log("User is not logged in. Redirecting...");
  //   return <p>LOG IN AS A MANGER TO SEE THIS PAGE</p>;
  // }
  //console.log("manager hostel name", JSON.parse(managerHostel))
  //setManagerHostelName(JSON.parse(managerHostel).username)
  const managerToken = localStorage.getItem("managerToken");

  const loadManagerDashBoardInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/manager/dashboard",
        {
          headers: {
            Authorization: `Bearer ${managerToken}`,
          },
        },
      );

      setHostelManagerRoomTypes(response.data.room_types);
      //setHostelGeneralInfo(response.data)
      setHostelDirections(response.data.location.directions)
      setHostelDistanceFromCampusInMinutes(response.data.location.distance_to_campus_in_minutes)
      setCautionDeposit(response.data.pricing.caution_deposit)
      setMaintenance(response.data.pricing.maintenance_fee)
      setUtilities(response.data.pricing.utilities_fee)

      setHostelMinimumPrice(response.data.pricing.price_min)
      setHostelMaximumPrice(response.data.pricing.price_max)
      //setRefundsAllowed(response.data.pricing.refund_policy === 1 ? '' :'')
      setInstallmentAllowed(response.data.pricing.installment_allowed)

      console.log(response.data.pricing);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadManagerDashBoardInfo();
  }, []);

  const updateHostel = async (e) => {
    e.preventDefault();
    setIsSubmittingUpdate(true)

    console.log(
      "hostelDirections",
      hostelDirections,
      "\n",
      "\n",
      "hostelDistanceFromCampusInMinutes",
      hostelDistanceFromCampusInMinutes,
      "\n",
      "\n",
      "installmentAllowed",
      installmentAllowed,
      "\n",
      "\n",
      "refundsAllowed",
      refundsAllowed,
      "\n",
      "\n",
      "utilities",
      utilities,
      "\n",
      "\n",
      "maintenance",
      maintenance,
      "\n",
      "\n",
      "cautionDeposit",
      cautionDeposit,
      "\n",
      "\n",
      "roomTypesAndPrice",
      hostelManagerRoomTypes,
    );

    try {
      const response = await axios.put(
        "http://localhost:3000/api/manager/update-hostel",

        {
          minimum_price: Number(hostelMinimumPrice),
          maximum_price: Number(hostelMaximumPrice),

          installment_allowed: installmentAllowed === '' ? 0 : installmentAllowed,
          refunds_allowed: refundsAllowed === '' ? 'No Refunds' : refundsAllowed,

          utilities: Number(utilities),
          maintenance: Number(maintenance),
          caution_deposit: Number(cautionDeposit),

          hostel_direction: hostelDirections,
          distance_to_campus: Number(hostelDistanceFromCampusInMinutes),

          room_types: hostelManagerRoomTypes,
        },

        {
          headers: {
            Authorization: `Bearer ${managerToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      setIsSubmittingUpdate(false)

      console.log("Update success:", response.data);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };
  return (
    <>
      <title>Hostel Manager | Episilion Hostels</title>
      <div className="hostel-manager-info-container">
        <div>
          <p className="dashboard-text">HOSTEL MANAGER DASHBOARD</p>
          <h1 className="hostel-manager-welcome-text">
            Welcome back, {managerHostel && JSON.parse(managerHostel).username}
            👋
          </h1>

          <p className="hostel-manger-welcome-text-second">
            Edit and update your hostel infomation below. Changes go live
            immediately.
          </p>
        </div>

        <div className="verified-account-container">
          <p className="verified-account-hostel-name">
            {managerHostel && JSON.parse(managerHostel).username}
          </p>
          <p className="verified-account-text">Verified Manager Account</p>
        </div>
      </div>

      <form onSubmit={updateHostel}>
        <div className="hostel-manager-updates-container">
          <div className="hostel-manager-location-and-distance-container">
            <div className="hostel-manager-location-and-distance-header">
              <div className="hostel-manager-location-pin"> 📍</div>
              <p>Location & Distance</p>
            </div>

            <h3 className="hostel-manager-titles">HOSTEL DIRECTIONS</h3>
            <textarea
              type="text"
              className="hostel-manager-textarea directions"
              placeholder="Exit the school from the main gate then...."
              value={hostelDirections}
              onChange={handleHostelDirectionsChange}
            />

            <h3 className="hostel-manager-titles">
              HOSTEL DISTANCE FROM CAMPUS IN MINUTES
            </h3>
            <input
              type="number"
              className="hostel-manager-textarea"
              placeholder="2"
              value={hostelDistanceFromCampusInMinutes}
              onChange={handleHostelDistanceFromCampusInMinutesChange}
            />
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
                  value={hostelMinimumPrice}
                  onChange={handleHostelMinimumPriceChange}
                />
              </div>
              <div>
                <h3 className="hostel-manager-titles">MAXIMUM PRICE (GHS)</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="e.g. 3000"
                  value={hostelMaximumPrice}
                  onChange={handleHostelMaximumPriceChange}
                />
              </div>
            </div>

            <div className="hostel-manager-installment-container">
              <h3 className="hostel-manager-titles">
                IS INSTALLMENT PAYMENT ALLOWED
              </h3>
              <div className="hostel-manager-binary-buttons">
                <button className={`hostel-manager-installment-button ${installmentAllowed ===  1? 'allowed' : ''}`} onClick={() => handleInstallmentAllowedChange(1)}>✔️YES</button>
                <button className={`hostel-manager-installment-button ${installmentAllowed === 0? 'notAllowed' : ''}`} onClick={() => handleInstallmentAllowedChange(0)}>❌NO</button>
              </div>
            </div>
            <div className="hostel-manager-refund-container">
              <h3 className="hostel-manager-titles">ARE REFUNDS ALLOWED</h3>
              <div className="hostel-manager-binary-buttons">
                <button className={`hostel-manager-refund-button ${refundsAllowed === 'Refunds Are Allowed' ? 'allowed' : '' }`} onClick={() => handleRefundsAllowedChange('Refunds Are Allowed')}>✔️YES</button>
                <button className={`hostel-manager-refund-button ${refundsAllowed != 'Refunds Are Allowed' ? 'notAllowed' : '' }`} onClick={() => handleRefundsAllowedChange('No Refunds')}>❌NO</button>
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
                  value={utilities}
                  onChange={handleUtilitiesChange}
                />
              </div>

              <div>
                <h3 className="hostel-manager-titles">MAINTENANCE</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="0.00"
                  value={maintenance}
                  onChange={handleMaintenanceChange}
                />
              </div>

              <div>
                <h3 className="hostel-manager-titles">CAUTION DEPOSIT</h3>
                <input
                  type="number"
                  className="hostel-manager-textarea"
                  placeholder="0.00"
                  value={cautionDeposit}
                  onChange={handleCautionDepositChange}
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
              {hostelManagerRoomTypes.map((room, index) => (
                <div key={room.id}>
                  <p>{room.room_type}</p>
                  <input
                    type="number"
                    value={room.price}
                    onChange={(e) => {
                      const updated = [...hostelManagerRoomTypes];
                      updated[index] = { ...room, price: Number(e.target.value) };
                      setHostelManagerRoomTypes(updated);
                    }}
                  />
                  <p>GHS</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hostel-manager-submit-button-container">
          <button className="hostel-manager-discard-button" type="reset">
            Discard Changes
          </button>
          <button className={`hostel-manager-save-changes-button ${isSubmittingUpdate? 'submittingUpdate' :''}`} type="submit">
            {`${isSubmittingUpdate? 'Submitting Update' :'Save Changes'}`}
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
