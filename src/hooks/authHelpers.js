export function shouldClearAuthDaily() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const lastLoginDate = localStorage.getItem("lastLoginDate");

  if (lastLoginDate !== today) {
    localStorage.removeItem("lastLoginDate");
    return true;
  }

  return false;
}

export function setTodayAsLoginDate() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("lastLoginDate", today);
}
