// Demo authentication only. A production build should replace this with
// real hashed-password verification against the users table.
const DEMO_USERS = {
  superadmin: { password: "super123", name: "Super Admin", role: "Super Admin" },
  admin: { password: "admin123", name: "Admin", role: "Admin" },
};

export function verifyLogin(username, password) {
  const user = DEMO_USERS[username.toLowerCase()];
  return user?.password === password ? user : null;
}

export function getDemoPasscode(username) {
  return DEMO_USERS[username.toLowerCase()]?.password || "";
}
