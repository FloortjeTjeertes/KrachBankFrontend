import users from "@/queries/users";

/**
 * Retrieves a user by their account ID.
 *
 * @async
 * @function
 * @param {string|number} accountId - The unique identifier of the user account.
 * @returns {Promise<Object|null>} A promise that resolves to the user data object if found, or null if not found or on error.
 */
async function getUserById(accountId) {
  if (!accountId) {
    console.warn("No accountId provided, returning null");
    return null;
  }
  return users
    .fetchUserById(accountId)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      return null;
    });
}

async function getUserByName(fullName) {
  try {
    if (!fullName) {
      console.warn("No name provided, returning null");
      return null;
    }
    var filter = { firstName: fullName.firstName, lastName: fullName.lastName };
    var pagination = { page: 1, limit: 1 };
    var fetchedUsers = users.fetchUser(filter, pagination);
    return fetchedUsers;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
}

export default {
  getUserById,
  getUserByName,
};
