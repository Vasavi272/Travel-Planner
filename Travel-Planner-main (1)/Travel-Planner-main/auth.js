export function isLoggedIn() {
  return localStorage.getItem("tripzy_user") !== null;
}

export function loginUser(email) {
  localStorage.setItem("tripzy_user", email);
}

export function logoutUser() {
  localStorage.removeItem("tripzy_user");
}
