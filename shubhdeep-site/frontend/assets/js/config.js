// Shared config for all pages.
// If the frontend is loaded from the backend server, use a relative API path.
// If the frontend is loaded from a separate static host (like :5500), use the backend URL.
const backendOrigin = 'http://127.0.0.1:5001';
window.ST_API_BASE = (window.location.origin === backendOrigin ? '/api' : `${backendOrigin}/api`);
