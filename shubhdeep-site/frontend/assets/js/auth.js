// /* ============================================================
//    AUTH — shared logic for login.html & register.html
//    Demo-only: uses localStorage as a stand-in for a real backend.
//    Swap the two TODO blocks below for real API calls when ready.
//    ============================================================ */

// (function(){

//   // ---------- Theme (kept in sync with main site) ----------
//   const themeToggle = document.getElementById('themeToggle');
//   function setTheme(dark){
//     document.documentElement.classList.toggle('dark', dark);
//     if(themeToggle) themeToggle.textContent = dark ? '☀' : '☾';
//   }
//   try{
//     const saved = localStorage.getItem('theme');
//     setTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
//   }catch(e){ setTheme(false); }
//   if(themeToggle){
//     themeToggle.addEventListener('click', () => {
//       const dark = !document.documentElement.classList.contains('dark');
//       setTheme(dark);
//       try{ localStorage.setItem('theme', dark ? 'dark' : 'light'); }catch(e){}
//     });
//   }

//   // ---------- Helpers ----------
//   const USERS_KEY = 'st_users';
//   const SESSION_KEY = 'st_session';

//   function getUsers(){
//     try{ return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }catch(e){ return []; }
//   }
//   function saveUsers(users){
//     try{ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }catch(e){}
//   }
//   function setSession(user){
//     try{ localStorage.setItem(SESSION_KEY, JSON.stringify({ name:user.name, email:user.email, loggedInAt:Date.now() })); }catch(e){}
//   }
//   // Simple non-cryptographic hash — placeholder only. Use real hashing (bcrypt/argon2) server-side in production.
//   function simpleHash(str){
//     let hash = 0;
//     for(let i=0;i<str.length;i++){ hash = ((hash<<5)-hash) + str.charCodeAt(i); hash |= 0; }
//     return String(hash);
//   }
//   function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

//   function showAlert(el, msg, type){
//     if(!el) return;
//     el.textContent = msg;
//     el.className = 'auth-alert show ' + type;
//   }
//   function hideAlert(el){
//     if(!el) return;
//     el.className = 'auth-alert';
//   }
//   function fieldError(input, errEl, msg){
//     input.classList.add('invalid');
//     if(errEl){ errEl.textContent = msg; errEl.classList.add('show'); }
//   }
//   function fieldOk(input, errEl){
//     input.classList.remove('invalid');
//     if(errEl){ errEl.classList.remove('show'); }
//   }

//   // Password show/hide toggles
//   document.querySelectorAll('.pw-toggle').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const input = document.getElementById(btn.dataset.target);
//       if(!input) return;
//       const isPw = input.type === 'password';
//       input.type = isPw ? 'text' : 'password';
//       btn.textContent = isPw ? '🙈' : '👁';
//     });
//   });

//   // ---------- REGISTER ----------
//   const registerForm = document.getElementById('registerForm');
//   if(registerForm){
//     const nameInput = document.getElementById('regName');
//     const emailInput = document.getElementById('regEmail');
//     const pwInput = document.getElementById('regPassword');
//     const pwConfirmInput = document.getElementById('regPasswordConfirm');
//     const termsInput = document.getElementById('regTerms');
//     const alertEl = document.getElementById('registerAlert');
//     const strengthEl = document.getElementById('pwStrength');
//     const submitBtn = document.getElementById('registerSubmit');

//     if(pwInput && strengthEl){
//       pwInput.addEventListener('input', () => {
//         const v = pwInput.value;
//         const bars = strengthEl.querySelectorAll('i');
//         bars.forEach(b => b.className = '');
//         let score = 0;
//         if(v.length >= 8) score++;
//         if(/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
//         if(/\d/.test(v)) score++;
//         if(/[^A-Za-z0-9]/.test(v)) score++;
//         const cls = score <= 1 ? 'on-weak' : score === 2 || score === 3 ? 'on-mid' : 'on-strong';
//         const fillCount = score <= 1 ? 1 : score === 2 || score === 3 ? 2 : 4;
//         for(let i=0;i<fillCount && i<bars.length;i++) bars[i].className = cls;
//       });
//     }

//     registerForm.addEventListener('submit', (e) => {
//       e.preventDefault();
//       hideAlert(alertEl);
//       let valid = true;

//       const name = nameInput.value.trim();
//       if(name.length < 2){ fieldError(nameInput, document.getElementById('regNameError'), 'Please enter your full name.'); valid = false; }
//       else fieldOk(nameInput, document.getElementById('regNameError'));

//       const email = emailInput.value.trim();
//       if(!isValidEmail(email)){ fieldError(emailInput, document.getElementById('regEmailError'), 'Please enter a valid email address.'); valid = false; }
//       else fieldOk(emailInput, document.getElementById('regEmailError'));

//       const pw = pwInput.value;
//       if(pw.length < 8){ fieldError(pwInput, document.getElementById('regPasswordError'), 'Password must be at least 8 characters.'); valid = false; }
//       else fieldOk(pwInput, document.getElementById('regPasswordError'));

//       const pwConfirm = pwConfirmInput.value;
//       if(pwConfirm !== pw || pwConfirm.length === 0){ fieldError(pwConfirmInput, document.getElementById('regPasswordConfirmError'), 'Passwords do not match.'); valid = false; }
//       else fieldOk(pwConfirmInput, document.getElementById('regPasswordConfirmError'));

//       if(termsInput && !termsInput.checked){
//         showAlert(alertEl, 'Please accept the Terms & Conditions to continue.', 'error');
//         valid = false;
//       }

//       if(!valid) return;

//       const users = getUsers();
//       if(users.some(u => u.email.toLowerCase() === email.toLowerCase())){
//         showAlert(alertEl, 'An account with this email already exists. Try logging in instead.', 'error');
//         return;
//       }

//       submitBtn.classList.add('btn-loading');
//       submitBtn.disabled = true;

//       // TODO: replace with real API call, e.g.
//       // const res = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, email, password: pw}) });
//       setTimeout(() => {
//         users.push({ name, email, passwordHash: simpleHash(pw), createdAt: Date.now() });
//         saveUsers(users);
//         setSession({ name, email });

//         submitBtn.classList.remove('btn-loading');
//         submitBtn.disabled = false;
//         showAlert(alertEl, 'Account created! Redirecting you to login...', 'success');
//         registerForm.reset();
//         if(strengthEl) strengthEl.querySelectorAll('i').forEach(b => b.className = '');
//         setTimeout(() => { window.location.href = 'login.html?registered=1'; }, 1200);
//       }, 600);
//     });
//   }

//   // ---------- LOGIN ----------
//   const loginForm = document.getElementById('loginForm');
//   if(loginForm){
//     const emailInput = document.getElementById('loginEmail');
//     const pwInput = document.getElementById('loginPassword');
//     const alertEl = document.getElementById('loginAlert');
//     const submitBtn = document.getElementById('loginSubmit');

//     // Show a success banner if arriving fresh from registration
//     try{
//       const params = new URLSearchParams(window.location.search);
//       if(params.get('registered') === '1'){
//         showAlert(alertEl, 'Account created successfully. Please log in.', 'success');
//       }
//     }catch(e){}

//     loginForm.addEventListener('submit', (e) => {
//       e.preventDefault();
//       hideAlert(alertEl);
//       let valid = true;

//       const email = emailInput.value.trim();
//       if(!isValidEmail(email)){ fieldError(emailInput, document.getElementById('loginEmailError'), 'Please enter a valid email address.'); valid = false; }
//       else fieldOk(emailInput, document.getElementById('loginEmailError'));

//       const pw = pwInput.value;
//       if(pw.length === 0){ fieldError(pwInput, document.getElementById('loginPasswordError'), 'Please enter your password.'); valid = false; }
//       else fieldOk(pwInput, document.getElementById('loginPasswordError'));

//       if(!valid) return;

//       submitBtn.classList.add('btn-loading');
//       submitBtn.disabled = true;

//       // TODO: replace with real API call, e.g.
//       // const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password: pw}) });
//       setTimeout(() => {
//         const users = getUsers();
//         const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

//         submitBtn.classList.remove('btn-loading');
//         submitBtn.disabled = false;

//         if(!user || user.passwordHash !== simpleHash(pw)){
//           showAlert(alertEl, 'Incorrect email or password. Please try again.', 'error');
//           return;
//         }

//         setSession(user);
//         showAlert(alertEl, `Welcome back, ${user.name.split(' ')[0]}! Redirecting...`, 'success');
//         setTimeout(() => { window.location.href = 'index.html'; }, 900);
//       }, 600);
//     });
//   }

// })();


/* ============================================================
   AUTH — shared logic for login.html & register.html
   Talks to the Node.js/Express + MongoDB backend in /backend.
   Update API_BASE below once your backend is deployed.
   ============================================================ */

(function(){

  // Reads from assets/js/config.js (window.ST_API_BASE) so every page
  // shares one place to update the backend URL for production.
  const API_BASE = window.ST_API_BASE || 'http://localhost:5001/api';

  // ---------- Theme (kept in sync with main site) ----------
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(dark){
    document.documentElement.classList.toggle('dark', dark);
    if(themeToggle) themeToggle.textContent = dark ? '☀' : '☾';
  }
  try{
    const saved = localStorage.getItem('theme');
    setTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  }catch(e){ setTheme(false); }
  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('dark');
      setTheme(dark);
      try{ localStorage.setItem('theme', dark ? 'dark' : 'light'); }catch(e){}
    });
  }

  // ---------- Helpers ----------
  function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function showAlert(el, msg, type){
    if(!el) return;
    el.textContent = msg;
    el.className = 'auth-alert show ' + type;
  }
  function hideAlert(el){
    if(!el) return;
    el.className = 'auth-alert';
  }
  function fieldError(input, errEl, msg){
    input.classList.add('invalid');
    if(errEl){ errEl.textContent = msg; errEl.classList.add('show'); }
  }
  function fieldOk(input, errEl){
    input.classList.remove('invalid');
    if(errEl){ errEl.classList.remove('show'); }
  }

  async function apiRequest(path, body){
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // send/receive the httpOnly session cookie
      body: JSON.stringify(body),
    });
    let data;
    try{ data = await res.json(); }catch(e){ data = {}; }
    if(!res.ok){
      const err = new Error(data.message || 'Something went wrong. Please try again.');
      err.details = data;
      throw err;
    }
    return data;
  }

  // Password show/hide toggles
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if(!input) return;
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.textContent = isPw ? '🙈' : '👁';
    });
  });

  // ---------- REGISTER ----------
  const registerForm = document.getElementById('registerForm');
  if(registerForm){
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const pwInput = document.getElementById('regPassword');
    const pwConfirmInput = document.getElementById('regPasswordConfirm');
    const termsInput = document.getElementById('regTerms');
    const alertEl = document.getElementById('registerAlert');
    const strengthEl = document.getElementById('pwStrength');
    const submitBtn = document.getElementById('registerSubmit');

    if(pwInput && strengthEl){
      pwInput.addEventListener('input', () => {
        const v = pwInput.value;
        const bars = strengthEl.querySelectorAll('i');
        bars.forEach(b => b.className = '');
        let score = 0;
        if(v.length >= 8) score++;
        if(/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
        if(/\d/.test(v)) score++;
        if(/[^A-Za-z0-9]/.test(v)) score++;
        const cls = score <= 1 ? 'on-weak' : score === 2 || score === 3 ? 'on-mid' : 'on-strong';
        const fillCount = score <= 1 ? 1 : score === 2 || score === 3 ? 2 : 4;
        for(let i=0;i<fillCount && i<bars.length;i++) bars[i].className = cls;
      });
    }

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(alertEl);
      let valid = true;

      const name = nameInput.value.trim();
      if(name.length < 2){ fieldError(nameInput, document.getElementById('regNameError'), 'Please enter your full name.'); valid = false; }
      else fieldOk(nameInput, document.getElementById('regNameError'));

      const email = emailInput.value.trim();
      if(!isValidEmail(email)){ fieldError(emailInput, document.getElementById('regEmailError'), 'Please enter a valid email address.'); valid = false; }
      else fieldOk(emailInput, document.getElementById('regEmailError'));

      const pw = pwInput.value;
      if(pw.length < 8){ fieldError(pwInput, document.getElementById('regPasswordError'), 'Password must be at least 8 characters.'); valid = false; }
      else fieldOk(pwInput, document.getElementById('regPasswordError'));

      const pwConfirm = pwConfirmInput.value;
      if(pwConfirm !== pw || pwConfirm.length === 0){ fieldError(pwConfirmInput, document.getElementById('regPasswordConfirmError'), 'Passwords do not match.'); valid = false; }
      else fieldOk(pwConfirmInput, document.getElementById('regPasswordConfirmError'));

      if(termsInput && !termsInput.checked){
        showAlert(alertEl, 'Please accept the Terms & Conditions to continue.', 'error');
        valid = false;
      }

      if(!valid) return;

      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      try{
        await apiRequest('/auth/register', { name, email, password: pw });
        showAlert(alertEl, 'Account created! Redirecting you to login...', 'success');
        registerForm.reset();
        if(strengthEl) strengthEl.querySelectorAll('i').forEach(b => b.className = '');
        setTimeout(() => { window.location.href = 'login.html?registered=1'; }, 1000);
      }catch(err){
        showAlert(alertEl, err.message, 'error');
      }finally{
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
      }
    });
  }

  // ---------- LOGIN ----------
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    const emailInput = document.getElementById('loginEmail');
    const pwInput = document.getElementById('loginPassword');
    const alertEl = document.getElementById('loginAlert');
    const submitBtn = document.getElementById('loginSubmit');

    // Show a success banner if arriving fresh from registration
    try{
      const params = new URLSearchParams(window.location.search);
      if(params.get('registered') === '1'){
        showAlert(alertEl, 'Account created successfully. Please log in.', 'success');
      }
    }catch(e){}

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(alertEl);
      let valid = true;

      const email = emailInput.value.trim();
      if(!isValidEmail(email)){ fieldError(emailInput, document.getElementById('loginEmailError'), 'Please enter a valid email address.'); valid = false; }
      else fieldOk(emailInput, document.getElementById('loginEmailError'));

      const pw = pwInput.value;
      if(pw.length === 0){ fieldError(pwInput, document.getElementById('loginPasswordError'), 'Please enter your password.'); valid = false; }
      else fieldOk(pwInput, document.getElementById('loginPasswordError'));

      if(!valid) return;

      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      try{
        const data = await apiRequest('/auth/login', { email, password: pw });
        const firstName = (data.user?.name || '').split(' ')[0] || 'back';
        showAlert(alertEl, `Welcome back, ${firstName}! Redirecting...`, 'success');
        const dest = data.user?.role === 'admin' ? 'admin-dashboard.html' : 'employee-dashboard.html';
        setTimeout(() => { window.location.href = dest; }, 800);
      }catch(err){
        showAlert(alertEl, err.message, 'error');
      }finally{
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
      }
    });
  }

})();