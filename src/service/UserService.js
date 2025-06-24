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
    console.log(fullName);
    var nameObject = nameToNameObject(fullName);
    var pagination = { page: 1, limit: 1 };
    var fetchedUsers = users.fetchUser(nameObject, pagination);
    return fetchedUsers;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
}

/**
 * Converts a full name string into an object with firstName and lastName properties.
 *
 * @param {string} nameString - The full name as a single string (e.g., "John Doe").
 * @returns {{ firstName: string, lastName: string }} An object containing the first and last name.
 */
function nameToNameObject(nameString) {
  var nameObject = { firstName : "", lastName : "" };
  nameObject.firstName= nameString.split(" ")[0]|| "";
    nameObject.lastName = nameString.split(" ")[1] || "";

  return nameObject;
}

export default {
  getUserById,
  getUserByName,
};
