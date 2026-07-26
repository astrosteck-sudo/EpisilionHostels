export function showHostelLocationOnMap(
  setClose,
  setActivate,
  originalHostelCardData,
  hostelId,
  setGoogleMapSrc,
) {
  setClose(false);
  setActivate(true);
  const hostel = originalHostelCardData.find((h) => h.id === hostelId);
  if (hostel && hostel.location) {
    const { latitude, longitude } = hostel.location;
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`;
    setGoogleMapSrc(mapUrl);
  } else {
    console.error("Hostel not found or missing location data.");
  }
}

export function getDirectionsOnMap(originalHostelCardData, hostelId) {
  //setClose(false);
  const hostel = originalHostelCardData.find((h) => h.id === hostelId);

  if (!hostel) {
    alert("Hostel not found.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: userLat, longitude: userLng } = position.coords;
      const mapURL = `https://www.google.com/maps/dir/${userLat},${userLng}/${hostel.location.latitude},${hostel.location.longitude}/`;
      window.open(mapURL, "_blank");
    },
    (error) => {
      const messages = {
        1: "Location access denied. Please allow location permissions.",
        2: "Location unavailable. Try again later.",
        3: "Location request timed out.",
      };
      alert(messages[error.code] || "Unable to retrieve your location.");
      console.error(error);
    },
    { timeout: 10000, maximumAge: 60000 }, // ✅ Add options for better UX
  );
}
//export default showHostelLocationOnMap;
