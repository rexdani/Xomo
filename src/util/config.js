const hostname = window.location.hostname;
const port=8081;
// export const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const BASE_URL = `http://${hostname}:${port}`;
