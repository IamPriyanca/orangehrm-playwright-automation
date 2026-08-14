export const env = {
  baseUrl: process.env.BASE_URL,
  username: process.env.HRM_USERNAME,
  password: process.env.HRM_PASSWORD,
};

if (!env.baseUrl) {
  throw new Error("BASE_URL environment variable is missing");
}

if (!env.username) {
  throw new Error("HRM_USERNAME environment variable is missing");
}

if (!env.password) {
  throw new Error("HRM_PASSWORD environment variable is missing");
}