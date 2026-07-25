/* ============================================================
   SESSION — shared across index.html + dashboards.
   Checks whether the visitor is logged in and updates the navbar
   (or redirects, on protected dashboard pages) accordingly.
   ============================================================ */
(function () {
  const API_BASE = window.ST_API_BASE;

  async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'GET', credentials: 'include' });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  // Fetches the current session. Returns the user object, or null if logged out.
  async function getSession() {
    try {
      const data = await apiGet('/auth/me');
      return data.user || null;
    } catch (e) {
      return null;
    }
  }

  async function logout() {
    try { await apiPost('/auth/logout'); } catch (e) {}
    window.location.href = 'index.html';
  }

  // Renders the "logged in" state into the public navbar (index.html).
  // Replaces the Login/Get Started buttons with a user chip + dashboard + logout.
  function renderNavUser(user) {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const loginBtn = navActions.querySelector('a[href="login.html"]');
    const registerBtn = navActions.querySelector('a[href="register.html"]');

    if (!user) {
      // Logged out — leave the default Login / Get Started buttons as-is.
      return;
    }

    const dashboardHref = user.role === 'admin' ? 'admin-dashboard.html' : 'employee-dashboard.html';
    const firstName = (user.name || '').split(' ')[0];

    const wrap = document.createElement('div');
    wrap.className = 'user-chip-wrap';
    wrap.style.position = 'relative';
    wrap.innerHTML = `
      <button class="user-chip" id="userChipBtn" style="display:flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:100px;border:1px solid var(--line);background:var(--bg);cursor:pointer;">
        <span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;font-size:.78rem;">${firstName.charAt(0).toUpperCase()}</span>
        <span style="font-size:.85rem;font-weight:600;">${firstName}</span>
      </button>
      <div id="userChipMenu" style="display:none;position:absolute;top:calc(100% + 10px);right:0;background:var(--bg);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow-md);padding:8px;width:180px;z-index:50;">
        <div style="padding:8px 10px;font-size:.78rem;color:var(--text-faint);border-bottom:1px solid var(--line);margin-bottom:6px;">Signed in as <br><strong style="color:var(--text);">${user.name}</strong></div>
        <a href="${dashboardHref}" style="display:block;padding:8px 10px;border-radius:8px;font-size:.85rem;font-weight:600;">Dashboard</a>
        <button id="navLogoutBtn" style="display:block;width:100%;text-align:left;padding:8px 10px;border-radius:8px;font-size:.85rem;font-weight:600;background:none;border:none;color:#EF4444;">Log out</button>
      </div>
    `;

    if (loginBtn) loginBtn.remove();
    if (registerBtn) registerBtn.replaceWith(wrap);
    else navActions.appendChild(wrap);

    const btn = wrap.querySelector('#userChipBtn');
    const menu = wrap.querySelector('#userChipMenu');
    btn.addEventListener('click', () => { menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) menu.style.display = 'none'; });
    wrap.querySelector('#navLogoutBtn').addEventListener('click', logout);
  }

  // Guards dashboard pages: redirects to login if not authenticated,
  // or to the correct dashboard if the role doesn't match the page.
  async function guardDashboard(requiredRole) {
    const user = await getSession();
    if (!user) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname.split('/').pop())}`;
      return null;
    }
    if (requiredRole && user.role !== requiredRole) {
      window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'employee-dashboard.html';
      return null;
    }
    return user;
  }

  window.ST = { apiGet, apiPost, getSession, logout, renderNavUser, guardDashboard };

  // Auto-run on the public homepage
  if (document.querySelector('.nav-actions') && !document.body.classList.contains('auth-body')) {
    getSession().then(renderNavUser);
  }
})();
