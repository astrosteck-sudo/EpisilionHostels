const { addFavoriteService, getFavoritesService } = require("../services/favoritesService");

// Controller to handle adding a hostel to favorites
const addFavoriteController = async (req, res) => {
  try {
    // Extract userId from the decoded JWT payload (set by verifyToken middleware)
    const userId = req.user.user_id;

    // Extract hostelId from the route parameters (/favorites/:hostelId)
    const { hostelId } = req.params;

    // Call the service to insert the favorite into the database
    const favorite = await addFavoriteService(userId, hostelId);

    // Respond with success and the newly added favorite
    return res.status(201).json({
      success: true,
      message: "Hostel added to favorites",
      data: favorite,
    });
  } catch (error) {
    // Handle errors (e.g., hostel not found, DB error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to handle fetching all favorites for a user
const getFavoritesController = async (req, res) => {
  try {
    // Extract userId from the decoded JWT payload
    // ⚠️ Make sure this matches your JWT field name (id vs user_id)
    const userId = req.user.user_id;

    // Call the service to fetch all favorites for this user
    const favorites = await getFavoritesService(userId);
    console.log("Feteched favorites:", favorites); // Debug log to check the fetched data
    // Respond with success, count of favorites, and the data
    return res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    // Handle errors (e.g., DB query failure)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export both controllers so they can be used in routes
module.exports = {
  addFavoriteController,
  getFavoritesController,
};
