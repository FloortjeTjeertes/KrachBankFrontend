import users from "../queries/users";

async function getUserById(accountId) {
    if (!accountId) {
        console.warn("No accountId provided, returning null");
        return null;
    }
    return users.fetchUserById(accountId).then(data => {
        return data;
    }).catch(error => {
        console.error("Error fetching user:", error);
        return null;
    });

}

export default {
    getUserById
};