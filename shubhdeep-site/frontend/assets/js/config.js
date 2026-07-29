// window.ST_API_BASE = 'https://shubhdeep-technosoft.onrender.com/api';



// Automatically points to the local backend when running on localhost/127.0.0.1,
// and to the live Render backend everywhere else (e.g. Hostinger production).
(function () {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  window.ST_API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.hostname}:5001/api`
    : 'https://shubhdeep-technosoft.onrender.com/api';
})();