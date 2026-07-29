
// (function () {
//   const { apiGet, guardDashboard, logout } = window.ST;

//   let currentUser = null;
//   let todayAttendance = null;

//   try {
//     const saved = localStorage.getItem('theme');
//     document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
//   } catch (e) {}

//   async function apiPatch(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }
//   async function apiPost(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }

//   function badge(value) {
//     return `<span class="badge badge-${value}">${value.replace('-', ' ')}</span>`;
//   }
//   function fmtTime(dateStr) {
//     if (!dateStr) return '—';
//     return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
//   }
//   function fmtHours(checkIn, checkOut) {
//     if (!checkIn) return '—';
//     const end = checkOut ? new Date(checkOut) : new Date();
//     const ms = end - new Date(checkIn);
//     const hrs = ms / 1000 / 60 / 60;
//     return `${hrs.toFixed(1)}h`;
//   }

//   const sections = ['home', 'tasks', 'profile'];
//   function showSection(name) {
//     sections.forEach((s) => {
//       const el = document.getElementById(`sec-${s}`);
//       if (el) el.style.display = s === name ? '' : 'none';
//     });
//     document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
//     closeSidebar();
//     if (name === 'profile') loadProfile();
//     if (name === 'tasks') loadTodayTasks();
//   }
//   document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => {
//     a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.section); });
//   });
//   document.querySelectorAll('[data-goto-section]').forEach((el) => {
//     el.addEventListener('click', () => showSection(el.dataset.gotoSection));
//   });

//   const sidebar = document.getElementById('dashSidebar');
//   const backdrop = document.getElementById('dashBackdrop');
//   function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
//   function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
//   document.getElementById('dashMenuBtn').addEventListener('click', openSidebar);
//   backdrop.addEventListener('click', closeSidebar);

//   document.getElementById('sidebarLogout').addEventListener('click', logout);

//   function tickClock() {
//     const now = new Date();
//     document.getElementById('liveClock').textContent = now.toLocaleTimeString();
//     document.getElementById('liveClockDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//     if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
//       document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance.checkIn, null);
//     }
//   }
//   tickClock();
//   setInterval(tickClock, 1000);

//   function renderAttendanceState() {
//     const inBtn = document.getElementById('checkInBtn');
//     const outBtn = document.getElementById('checkOutBtn');

//     document.getElementById('checkInTimeLabel').textContent = fmtTime(todayAttendance?.checkIn);
//     document.getElementById('checkOutTimeLabel').textContent = fmtTime(todayAttendance?.checkOut);
//     document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance?.checkIn, todayAttendance?.checkOut);

//     if (!todayAttendance?.checkIn) {
//       inBtn.disabled = false;
//       inBtn.textContent = 'Check In';
//       outBtn.disabled = true;
//     } else if (todayAttendance.checkIn && !todayAttendance.checkOut) {
//       inBtn.disabled = true;
//       inBtn.textContent = 'Checked In ✓';
//       outBtn.disabled = false;
//     } else {
//       inBtn.disabled = true;
//       inBtn.textContent = 'Checked In ✓';
//       outBtn.disabled = true;
//       outBtn.textContent = 'Checked Out ✓';
//     }

//     document.getElementById('statAttendanceStatus').textContent = todayAttendance?.checkOut
//       ? 'Done for today'
//       : todayAttendance?.checkIn
//       ? 'Checked In'
//       : 'Not marked';
//   }

//   async function loadTodayAttendance() {
//     try {
//       const res = await apiGet('/attendance/today');
//       todayAttendance = res.data;
//       renderAttendanceState();
//     } catch (e) { console.error(e); }
//   }

//   function flashAttendanceMsg(text, isError) {
//     const el = document.getElementById('attendanceMsg');
//     el.textContent = text;
//     el.style.color = isError ? '#EF4444' : '#10B981';
//     el.style.display = 'block';
//     setTimeout(() => { el.style.display = 'none'; }, 3000);
//   }

//   document.getElementById('checkInBtn').addEventListener('click', async () => {
//     try {
//       const res = await apiPost('/attendance/checkin');
//       todayAttendance = res.data;
//       renderAttendanceState();
//       flashAttendanceMsg('Checked in at ' + fmtTime(res.data.checkIn), false);
//       loadHomeStats();
//     } catch (e) { flashAttendanceMsg(e.message, true); }
//   });

//   document.getElementById('checkOutBtn').addEventListener('click', async () => {
//     try {
//       const res = await apiPost('/attendance/checkout');
//       todayAttendance = res.data;
//       renderAttendanceState();
//       flashAttendanceMsg('Checked out at ' + fmtTime(res.data.checkOut), false);
//     } catch (e) { flashAttendanceMsg(e.message, true); }
//   });

//   async function loadHomeStats() {
//     try {
//       const [tasksRes, attRes] = await Promise.all([apiGet('/tasks/today'), apiGet('/attendance/me')]);
//       const tasks = tasksRes.data;
//       const attendance = attRes.data;

//       document.getElementById('statTasksToday').textContent = tasks.length;
//       document.getElementById('statCompletedToday').textContent = tasks.filter((t) => t.status === 'completed').length;

//       const thisMonth = new Date().getMonth();
//       const monthRecords = attendance.filter((a) => new Date(a.date).getMonth() === thisMonth);
//       const presentCount = monthRecords.filter((a) => a.status === 'present').length;
//       const rate = monthRecords.length ? Math.round((presentCount / monthRecords.length) * 100) : 0;
//       document.getElementById('statMonthRate').textContent = `${rate}%`;

//       const preview = document.getElementById('homeTaskPreview');
//       preview.innerHTML = tasks.length
//         ? tasks.slice(0, 3).map((t) => `
//           <div class="task-row">
//             <div>
//               <h4>${t.title}</h4>
//               ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
//               <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
//             </div>
//           </div>`).join('')
//         : `<p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p>`;
//     } catch (e) { console.error(e); }
//   }

//   const statusFlow = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
//   const statusActionLabel = { pending: 'Start Task', 'in-progress': 'Mark Complete', completed: 'Reopen' };

//   async function loadTodayTasks() {
//     const list = document.getElementById('todayTaskList');
//     list.innerHTML = `<div class="dash-card"><p class="empty-state">Loading your tasks...</p></div>`;
//     try {
//       const res = await apiGet('/tasks/today');
//       const tasks = res.data;
//       renderProgress(tasks);

//       list.innerHTML = tasks.length
//         ? tasks.map((t) => `
//           <div class="task-row" data-task="${t._id}">
//             <div>
//               <h4>${t.title}</h4>
//               ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
//               ${t.description ? `<p>${t.description}</p>` : ''}
//               <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
//             </div>
//             <button class="btn ${t.status === 'completed' ? 'btn-ghost' : 'btn-primary'} btn-sm" data-advance="${t._id}" data-status="${t.status}">
//               ${statusActionLabel[t.status]}
//             </button>
//           </div>`).join('')
//         : `<div class="dash-card"><p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p></div>`;

//       list.querySelectorAll('[data-advance]').forEach((btn) => {
//         btn.addEventListener('click', async () => {
//           const next = statusFlow[btn.dataset.status];
//           btn.disabled = true;
//           try {
//             await apiPatch(`/tasks/${btn.dataset.advance}/status`, { status: next });
//             loadTodayTasks();
//             loadHomeStats();
//           } catch (e) {
//             alert(e.message);
//             btn.disabled = false;
//           }
//         });
//       });
//     } catch (e) {
//       list.innerHTML = `<div class="dash-card"><p class="empty-state">Could not load tasks.</p></div>`;
//     }
//   }

//   function renderProgress(tasks) {
//     const total = tasks.length;
//     const done = tasks.filter((t) => t.status === 'completed').length;
//     const pct = total ? Math.round((done / total) * 100) : 0;
//     document.getElementById('progressLabel').textContent = `${done}/${total} done`;
//     document.getElementById('progressFill').style.width = `${pct}%`;
//   }

//   async function loadProfile() {
//     try {
//       const [tasksRes, attRes] = await Promise.all([apiGet('/tasks'), apiGet('/attendance/me')]);
//       const tasks = tasksRes.data;
//       const attendance = attRes.data;

//       const total = tasks.length;
//       const completed = tasks.filter((t) => t.status === 'completed').length;
//       const rate = total ? Math.round((completed / total) * 100) : 0;
//       const present = attendance.filter((a) => a.status === 'present').length;

//       document.getElementById('snapCompleted').textContent = completed;
//       document.getElementById('snapRate').textContent = `${rate}%`;
//       document.getElementById('snapPresent').textContent = present;
//       document.getElementById('snapTotal').textContent = total;

//       document.getElementById('profileDetails').innerHTML = `
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Full Name</span><strong>${currentUser.name}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Email</span><strong>${currentUser.email}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Phone</span><strong>${currentUser.phone || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Position</span><strong>${currentUser.position || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Department</span><strong>${currentUser.department || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Joined</span><strong>${new Date(currentUser.joiningDate).toLocaleDateString()}</strong></div>
//       `;

//       document.querySelector('#myAttendanceTable tbody').innerHTML = attendance.length
//         ? attendance.slice(0, 20).map((a) => `
//           <tr>
//             <td>${new Date(a.date).toLocaleDateString()}</td>
//             <td>${fmtTime(a.checkIn)}</td>
//             <td>${fmtTime(a.checkOut)}</td>
//             <td>${fmtHours(a.checkIn, a.checkOut)}</td>
//             <td>${badge(a.status)}</td>
//           </tr>`).join('')
//         : `<tr><td colspan="5" class="empty-state">No attendance records yet.</td></tr>`;

//       document.querySelector('#myTaskHistoryTable tbody').innerHTML = tasks.length
//         ? tasks.slice(0, 20).map((t) => `<tr><td>${t.title}</td><td>${new Date(t.date).toLocaleDateString()}</td><td>${badge(t.priority)}</td><td>${badge(t.status)}</td></tr>`).join('')
//         : `<tr><td colspan="4" class="empty-state">No task history yet.</td></tr>`;
//     } catch (e) { console.error(e); }
//   }

//   (async function init() {
//     currentUser = await guardDashboard('employee');
//     if (!currentUser) return;

//     document.getElementById('topbarName').textContent = currentUser.name;
//     document.getElementById('homeGreetName').textContent = currentUser.name.split(' ')[0];
//     document.getElementById('topbarAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
//     document.getElementById('homeDateLabel').textContent = `Here's your day at a glance — ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`;
//     document.getElementById('todayDateLabel').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     await loadTodayAttendance();
//     loadHomeStats();
//   })();
// })();


















// (function () {
//   const { apiGet, guardDashboard, logout } = window.ST;

//   let currentUser = null;
//   let todayAttendance = null;

//   try {
//     const saved = localStorage.getItem('theme');
//     document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
//   } catch (e) {}

//   async function apiPatch(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }
//   async function apiPost(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }

//   function badge(value) {
//     return `<span class="badge badge-${value}">${value.replace('-', ' ')}</span>`;
//   }
//   function fmtTime(dateStr) {
//     if (!dateStr) return '—';
//     return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
//   }
//   function fmtHours(checkIn, checkOut) {
//     if (!checkIn) return '—';
//     const end = checkOut ? new Date(checkOut) : new Date();
//     const ms = end - new Date(checkIn);
//     const hrs = ms / 1000 / 60 / 60;
//     return `${hrs.toFixed(1)}h`;
//   }

//   // ---------- Sidebar navigation ----------
//   const sections = ['home', 'tasks', 'profile'];
//   function showSection(name) {
//     sections.forEach((s) => {
//       const el = document.getElementById(`sec-${s}`);
//       if (el) el.style.display = s === name ? '' : 'none';
//     });
//     document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
//     closeSidebar();
//     if (name === 'profile') loadProfile();
//     if (name === 'tasks') loadTodayTasks();
//   }
//   document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => {
//     a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.section); });
//   });
//   document.querySelectorAll('[data-goto-section]').forEach((el) => {
//     el.addEventListener('click', () => showSection(el.dataset.gotoSection));
//   });

//   // ---------- Mobile sidebar ----------
//   const sidebar = document.getElementById('dashSidebar');
//   const backdrop = document.getElementById('dashBackdrop');
//   function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
//   function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
//   document.getElementById('dashMenuBtn').addEventListener('click', openSidebar);
//   backdrop.addEventListener('click', closeSidebar);

//   document.getElementById('sidebarLogout').addEventListener('click', logout);
  
  
  
//   const statusFlow = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
//   const statusActionLabel = { pending: 'Start Task', 'in-progress': 'Mark Complete', completed: 'Reopen' };


// // ================= LIVE CLOCK =================
//   function tickClock() {
//     const now = new Date();
//     document.getElementById('liveClock').textContent = now.toLocaleTimeString();
//     document.getElementById('liveClockDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//     if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
//       document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance.checkIn, null);
//     }
//   }
//   tickClock();
//   setInterval(tickClock, 1000);

//   // ================= ATTENDANCE (check-in / check-out) =================
//   function renderAttendanceState() {
//     const inBtn = document.getElementById('checkInBtn');
//     const outBtn = document.getElementById('checkOutBtn');

//     document.getElementById('checkInTimeLabel').textContent = fmtTime(todayAttendance?.checkIn);
//     document.getElementById('checkOutTimeLabel').textContent = fmtTime(todayAttendance?.checkOut);
//     document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance?.checkIn, todayAttendance?.checkOut);

//     if (!todayAttendance?.checkIn) {
//       inBtn.disabled = false;
//       inBtn.textContent = 'Check In';
//       outBtn.disabled = true;
//     } else if (todayAttendance.checkIn && !todayAttendance.checkOut) {
//       inBtn.disabled = true;
//       inBtn.textContent = 'Checked In ✓';
//       outBtn.disabled = false;
//     } else {
//       inBtn.disabled = true;
//       inBtn.textContent = 'Checked In ✓';
//       outBtn.disabled = true;
//       outBtn.textContent = 'Checked Out ✓';
//     }

//     document.getElementById('statAttendanceStatus').textContent = todayAttendance?.checkOut
//       ? 'Done for today'
//       : todayAttendance?.checkIn
//       ? 'Checked In'
//       : 'Not marked';
//   }

//   async function loadTodayAttendance() {
//     try {
//       const res = await apiGet('/attendance/today');
//       todayAttendance = res.data;
//       renderAttendanceState();
//     } catch (e) { console.error(e); }
//   }

//   function flashAttendanceMsg(text, isError) {
//     const el = document.getElementById('attendanceMsg');
//     el.textContent = text;
//     el.style.color = isError ? '#EF4444' : '#10B981';
//     el.style.display = 'block';
//     setTimeout(() => { el.style.display = 'none'; }, 3000);
//   }

//   document.getElementById('checkInBtn').addEventListener('click', async () => {
//     try {
//       const res = await apiPost('/attendance/checkin');
//       todayAttendance = res.data;
//       renderAttendanceState();
//       flashAttendanceMsg('Checked in at ' + fmtTime(res.data.checkIn), false);
//       loadHomeStats();
//     } catch (e) { flashAttendanceMsg(e.message, true); }
//   });

//   document.getElementById('checkOutBtn').addEventListener('click', async () => {
//     try {
//       const res = await apiPost('/attendance/checkout');
//       todayAttendance = res.data;
//       renderAttendanceState();
//       flashAttendanceMsg('Checked out at ' + fmtTime(res.data.checkOut), false);
//     } catch (e) { flashAttendanceMsg(e.message, true); }
//   });


//   // ================= HOME =================
//   async function loadHomeStats() {
//     try {
//       const [tasksRes, attRes] = await Promise.all([apiGet('/tasks/today'), apiGet('/attendance/me')]);
//       const tasks = tasksRes.data;
//       const attendance = attRes.data;

//       document.getElementById('statTasksToday').textContent = tasks.length;
//       document.getElementById('statCompletedToday').textContent = tasks.filter((t) => t.status === 'completed').length;

//       const thisMonth = new Date().getMonth();
//       const monthRecords = attendance.filter((a) => new Date(a.date).getMonth() === thisMonth);
//       const presentCount = monthRecords.filter((a) => a.status === 'present').length;
//       const rate = monthRecords.length ? Math.round((presentCount / monthRecords.length) * 100) : 0;
//       document.getElementById('statMonthRate').textContent = `${rate}%`;

//       const preview = document.getElementById('homeTaskPreview');
//       preview.innerHTML = tasks.length
//         ? tasks.slice(0, 3).map((t) => `
//           <div class="task-row">
//             <div>
//               <h4>${t.title}</h4>
//               ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
//               <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
//             </div>
//           </div>`).join('')
//         : `<p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p>`;
//     } catch (e) { console.error(e); }
//   }

//   // ================= MY TASKS =================
//   const statusFlow = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
//   const statusActionLabel = { pending: 'Start Task', 'in-progress': 'Mark Complete', completed: 'Reopen' };

//   async function loadTodayTasks() {
//     const list = document.getElementById('todayTaskList');
//     list.innerHTML = `<div class="dash-card"><p class="empty-state">Loading your tasks...</p></div>`;
//     try {
//       const res = await apiGet('/tasks/today');
//       const tasks = res.data;
//       renderProgress(tasks);

//       list.innerHTML = tasks.length
//         ? tasks.map((t) => `
//           <div class="task-row" data-task="${t._id}">
//             <div>
//               <h4>${t.title}</h4>
//               ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
//               ${t.description ? `<p>${t.description}</p>` : ''}
//               <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
//             </div>
//             <button class="btn ${t.status === 'completed' ? 'btn-ghost' : 'btn-primary'} btn-sm" data-advance="${t._id}" data-status="${t.status}">
//               ${statusActionLabel[t.status]}
//             </button>
//           </div>`).join('')
//         : `<div class="dash-card"><p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p></div>`;

//       list.querySelectorAll('[data-advance]').forEach((btn) => {
//         btn.addEventListener('click', async () => {
//           const next = statusFlow[btn.dataset.status];
//           btn.disabled = true;
//           try {
//             await apiPatch(`/tasks/${btn.dataset.advance}/status`, { status: next });
//             loadTodayTasks();
//             loadHomeStats();
//           } catch (e) {
//             alert(e.message);
//             btn.disabled = false;
//           }
//         });
//       });
//     } catch (e) {
//       list.innerHTML = `<div class="dash-card"><p class="empty-state">Could not load tasks.</p></div>`;
//     }
//   }

//   function renderProgress(tasks) {
//     const total = tasks.length;
//     const done = tasks.filter((t) => t.status === 'completed').length;
//     const pct = total ? Math.round((done / total) * 100) : 0;
//     document.getElementById('progressLabel').textContent = `${done}/${total} done`;
//     document.getElementById('progressFill').style.width = `${pct}%`;
//   }

//   // ================= PROFILE / ACTIVITY =================
//   async function loadProfile() {
//     try {
//       const [tasksRes, attRes] = await Promise.all([apiGet('/tasks'), apiGet('/attendance/me')]);
//       const tasks = tasksRes.data;
//       const attendance = attRes.data;

//       const total = tasks.length;
//       const completed = tasks.filter((t) => t.status === 'completed').length;
//       const rate = total ? Math.round((completed / total) * 100) : 0;
//       const present = attendance.filter((a) => a.status === 'present').length;

//       document.getElementById('snapCompleted').textContent = completed;
//       document.getElementById('snapRate').textContent = `${rate}%`;
//       document.getElementById('snapPresent').textContent = present;
//       document.getElementById('snapTotal').textContent = total;

//       document.getElementById('profileDetails').innerHTML = `
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Full Name</span><strong>${currentUser.name}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Email</span><strong>${currentUser.email}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Phone</span><strong>${currentUser.phone || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Position</span><strong>${currentUser.position || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Department</span><strong>${currentUser.department || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Joined</span><strong>${new Date(currentUser.joiningDate).toLocaleDateString()}</strong></div>
//       `;

//       document.querySelector('#myAttendanceTable tbody').innerHTML = attendance.length
//         ? attendance.slice(0, 20).map((a) => `
//           <tr>
//             <td>${new Date(a.date).toLocaleDateString()}</td>
//             <td>${fmtTime(a.checkIn)}</td>
//             <td>${fmtTime(a.checkOut)}</td>
//             <td>${fmtHours(a.checkIn, a.checkOut)}</td>
//             <td>${badge(a.status)}</td>
//           </tr>`).join('')
//         : `<tr><td colspan="5" class="empty-state">No attendance records yet.</td></tr>`;

//       document.querySelector('#myTaskHistoryTable tbody').innerHTML = tasks.length
//         ? tasks.slice(0, 20).map((t) => `<tr><td>${t.title}</td><td>${new Date(t.date).toLocaleDateString()}</td><td>${badge(t.priority)}</td><td>${badge(t.status)}</td></tr>`).join('')
//         : `<tr><td colspan="4" class="empty-state">No task history yet.</td></tr>`;
//     } catch (e) { console.error(e); }
//   }

//   // ================= INIT =================
//   (async function init() {
//     currentUser = await guardDashboard('employee');
//     if (!currentUser) return;

//     document.getElementById('topbarName').textContent = currentUser.name;
//     document.getElementById('homeGreetName').textContent = currentUser.name.split(' ')[0];
//     document.getElementById('topbarAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
//     document.getElementById('homeDateLabel').textContent = `Here's your day at a glance — ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`;
//     document.getElementById('todayDateLabel').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     await loadTodayAttendance();
//     loadHomeStats();
//   })();
// })();







// (function () {
//   const { apiGet, guardDashboard, logout } = window.ST;

//   let currentUser = null;
//   let todayAttendance = null;

//   try {
//     const saved = localStorage.getItem('theme');
//     document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
//   } catch (e) {}

//   async function apiPatch(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }
//   async function apiPost(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }

//   function badge(value) {
//     return `<span class="badge badge-${value}">${value.replace('-', ' ')}</span>`;
//   }
//   function fmtTime(dateStr) {
//     if (!dateStr) return '—';
//     return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
//   }
//   function fmtHours(checkIn, checkOut) {
//     if (!checkIn) return '—';
//     const end = checkOut ? new Date(checkOut) : new Date();
//     const ms = end - new Date(checkIn);
//     const hrs = ms / 1000 / 60 / 60;
//     return `${hrs.toFixed(1)}h`;
//   }

//   // ---------- Sidebar navigation ----------
//   const sections = ['home', 'tasks', 'profile'];
//   function showSection(name) {
//     sections.forEach((s) => {
//       const el = document.getElementById(`sec-${s}`);
//       if (el) el.style.display = s === name ? '' : 'none';
//     });
//     document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
//     closeSidebar();
//     if (name === 'profile') loadProfile();
//     if (name === 'tasks') loadTodayTasks();
//   }
//   document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => {
//     a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.section); });
//   });
//   document.querySelectorAll('[data-goto-section]').forEach((el) => {
//     el.addEventListener('click', () => showSection(el.dataset.gotoSection));
//   });

//   // ---------- Mobile sidebar ----------
//   const sidebar = document.getElementById('dashSidebar');
//   const backdrop = document.getElementById('dashBackdrop');
//   function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
//   function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
//   document.getElementById('dashMenuBtn').addEventListener('click', openSidebar);
//   backdrop.addEventListener('click', closeSidebar);

//   document.getElementById('sidebarLogout').addEventListener('click', logout);
  
  
  
//   const statusFlow = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
//   const statusActionLabel = { pending: 'Start Task', 'in-progress': 'Mark Complete', completed: 'Reopen' };


// // ================= LIVE CLOCK =================
//   function tickClock() {
//     const now = new Date();
//     document.getElementById('liveClock').textContent = now.toLocaleTimeString();
//     document.getElementById('liveClockDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//     if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
//       document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance.checkIn, null);
//     }
//   }
//   tickClock();
//   setInterval(tickClock, 1000);

//   // ================= ATTENDANCE (check-in / check-out) =================
//   function renderAttendanceState() {
//     const inBtn = document.getElementById('checkInBtn');
//     const outBtn = document.getElementById('checkOutBtn');

//     document.getElementById('checkInTimeLabel').textContent = fmtTime(todayAttendance?.checkIn);
//     document.getElementById('checkOutTimeLabel').textContent = fmtTime(todayAttendance?.checkOut);
//     document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance?.checkIn, todayAttendance?.checkOut);

//     if (!todayAttendance?.checkIn) {
//       inBtn.disabled = false;
//       inBtn.textContent = 'Check In';
//       outBtn.disabled = true;
//     } else if (todayAttendance.checkIn && !todayAttendance.checkOut) {
//       inBtn.disabled = true;
//       inBtn.textContent = 'Checked In ✓';
//       outBtn.disabled = false;
//     } else {
//       inBtn.disabled = true;
//       inBtn.textContent = 'Checked In ✓';
//       outBtn.disabled = true;
//       outBtn.textContent = 'Checked Out ✓';
//     }

//     document.getElementById('statAttendanceStatus').textContent = todayAttendance?.checkOut
//       ? 'Done for today'
//       : todayAttendance?.checkIn
//       ? 'Checked In'
//       : 'Not marked';
//   }

//   async function loadTodayAttendance() {
//     try {
//       const res = await apiGet('/attendance/today');
//       todayAttendance = res.data;
//       renderAttendanceState();
//     } catch (e) { console.error(e); }
//   }

//   function flashAttendanceMsg(text, isError) {
//     const el = document.getElementById('attendanceMsg');
//     el.textContent = text;
//     el.style.color = isError ? '#EF4444' : '#10B981';
//     el.style.display = 'block';
//     setTimeout(() => { el.style.display = 'none'; }, 3000);
//   }

//   document.getElementById('checkInBtn').addEventListener('click', async () => {
//     try {
//       const res = await apiPost('/attendance/checkin');
//       todayAttendance = res.data;
//       renderAttendanceState();
//       flashAttendanceMsg('Checked in at ' + fmtTime(res.data.checkIn), false);
//       loadHomeStats();
//     } catch (e) { flashAttendanceMsg(e.message, true); }
//   });

//   document.getElementById('checkOutBtn').addEventListener('click', async () => {
//     try {
//       const res = await apiPost('/attendance/checkout');
//       todayAttendance = res.data;
//       renderAttendanceState();
//       flashAttendanceMsg('Checked out at ' + fmtTime(res.data.checkOut), false);
//     } catch (e) { flashAttendanceMsg(e.message, true); }
//   });


//   // ================= HOME =================
//   async function loadHomeStats() {
//     try {
//       const [tasksRes, attRes] = await Promise.all([apiGet('/tasks/today'), apiGet('/attendance/me')]);
//       const tasks = tasksRes.data;
//       const attendance = attRes.data;

//       document.getElementById('statTasksToday').textContent = tasks.length;
//       document.getElementById('statCompletedToday').textContent = tasks.filter((t) => t.status === 'completed').length;

//       const thisMonth = new Date().getMonth();
//       const monthRecords = attendance.filter((a) => new Date(a.date).getMonth() === thisMonth);
//       const presentCount = monthRecords.filter((a) => a.status === 'present').length;
//       const rate = monthRecords.length ? Math.round((presentCount / monthRecords.length) * 100) : 0;
//       document.getElementById('statMonthRate').textContent = `${rate}%`;

//       const preview = document.getElementById('homeTaskPreview');
//       preview.innerHTML = tasks.length
//         ? tasks.slice(0, 3).map((t) => `
//           <div class="task-row">
//             <div>
//               <h4>${t.title}</h4>
//               ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
//               <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
//             </div>
//           </div>`).join('')
//         : `<p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p>`;
//     } catch (e) { console.error(e); }
//   }

//   // ================= MY TASKS =================
//   const statusFlow = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
//   const statusActionLabel = { pending: 'Start Task', 'in-progress': 'Mark Complete', completed: 'Reopen' };

//   async function loadTodayTasks() {
//     const list = document.getElementById('todayTaskList');
//     list.innerHTML = `<div class="dash-card"><p class="empty-state">Loading your tasks...</p></div>`;
//     try {
//       const res = await apiGet('/tasks/today');
//       const tasks = res.data;
//       renderProgress(tasks);

//       list.innerHTML = tasks.length
//         ? tasks.map((t) => `
//           <div class="task-row" data-task="${t._id}">
//             <div>
//               <h4>${t.title}</h4>
//               ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
//               ${t.description ? `<p>${t.description}</p>` : ''}
//               <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
//             </div>
//             <button class="btn ${t.status === 'completed' ? 'btn-ghost' : 'btn-primary'} btn-sm" data-advance="${t._id}" data-status="${t.status}">
//               ${statusActionLabel[t.status]}
//             </button>
//           </div>`).join('')
//         : `<div class="dash-card"><p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p></div>`;

//       list.querySelectorAll('[data-advance]').forEach((btn) => {
//         btn.addEventListener('click', async () => {
//           const next = statusFlow[btn.dataset.status];
//           btn.disabled = true;
//           try {
//             await apiPatch(`/tasks/${btn.dataset.advance}/status`, { status: next });
//             loadTodayTasks();
//             loadHomeStats();
//           } catch (e) {
//             alert(e.message);
//             btn.disabled = false;
//           }
//         });
//       });
//     } catch (e) {
//       list.innerHTML = `<div class="dash-card"><p class="empty-state">Could not load tasks.</p></div>`;
//     }
//   }

//   function renderProgress(tasks) {
//     const total = tasks.length;
//     const done = tasks.filter((t) => t.status === 'completed').length;
//     const pct = total ? Math.round((done / total) * 100) : 0;
//     document.getElementById('progressLabel').textContent = `${done}/${total} done`;
//     document.getElementById('progressFill').style.width = `${pct}%`;
//   }

//   // ================= PROFILE / ACTIVITY =================
//   async function loadProfile() {
//     try {
//       const [tasksRes, attRes] = await Promise.all([apiGet('/tasks'), apiGet('/attendance/me')]);
//       const tasks = tasksRes.data;
//       const attendance = attRes.data;

//       const total = tasks.length;
//       const completed = tasks.filter((t) => t.status === 'completed').length;
//       const rate = total ? Math.round((completed / total) * 100) : 0;
//       const present = attendance.filter((a) => a.status === 'present').length;

//       document.getElementById('snapCompleted').textContent = completed;
//       document.getElementById('snapRate').textContent = `${rate}%`;
//       document.getElementById('snapPresent').textContent = present;
//       document.getElementById('snapTotal').textContent = total;

//       document.getElementById('profileDetails').innerHTML = `
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Full Name</span><strong>${currentUser.name}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Email</span><strong>${currentUser.email}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Phone</span><strong>${currentUser.phone || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Position</span><strong>${currentUser.position || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Department</span><strong>${currentUser.department || '—'}</strong></div>
//         <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Joined</span><strong>${new Date(currentUser.joiningDate).toLocaleDateString()}</strong></div>
//       `;

//       document.querySelector('#myAttendanceTable tbody').innerHTML = attendance.length
//         ? attendance.slice(0, 20).map((a) => `
//           <tr>
//             <td>${new Date(a.date).toLocaleDateString()}</td>
//             <td>${fmtTime(a.checkIn)}</td>
//             <td>${fmtTime(a.checkOut)}</td>
//             <td>${fmtHours(a.checkIn, a.checkOut)}</td>
//             <td>${badge(a.status)}</td>
//           </tr>`).join('')
//         : `<tr><td colspan="5" class="empty-state">No attendance records yet.</td></tr>`;

//       document.querySelector('#myTaskHistoryTable tbody').innerHTML = tasks.length
//         ? tasks.slice(0, 20).map((t) => `<tr><td>${t.title}</td><td>${new Date(t.date).toLocaleDateString()}</td><td>${badge(t.priority)}</td><td>${badge(t.status)}</td></tr>`).join('')
//         : `<tr><td colspan="4" class="empty-state">No task history yet.</td></tr>`;
//     } catch (e) { console.error(e); }
//   }

//   // ================= INIT =================
//   (async function init() {
//     currentUser = await guardDashboard('employee');
//     if (!currentUser) return;

//     document.getElementById('topbarName').textContent = currentUser.name;
//     document.getElementById('homeGreetName').textContent = currentUser.name.split(' ')[0];
//     document.getElementById('topbarAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
//     document.getElementById('homeDateLabel').textContent = `Here's your day at a glance — ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`;
//     document.getElementById('todayDateLabel').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     await loadTodayAttendance();
//     loadHomeStats();
//   })();
// })();









(function () {
  const { apiGet, guardDashboard, logout } = window.ST;

  let currentUser = null;
  let todayAttendance = null;

  try {
    const saved = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch (e) {}

  async function apiPatch(path, body) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json', ...window.ST.authHeaders() }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
  async function apiPost(path, body) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...window.ST.authHeaders() }, body: JSON.stringify(body || {}) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
  async function apiPut(path, body) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', ...window.ST.authHeaders() }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
  async function apiDelete(path) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'DELETE', credentials: 'include', headers: { ...window.ST.authHeaders() } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }

  // ================= LEADS =================
  let leadsCache = [];
  const followUpLabel = { active: 'Active', following: 'Following', cancelled: 'Cancelled', other: 'Other' };

  function openModal(id) { document.getElementById(id).classList.add('show'); }
  function closeModal(id) { document.getElementById(id).classList.remove('show'); }
  document.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', () => closeModal(btn.dataset.closeModal)));
  document.querySelectorAll('.dmodal-backdrop').forEach((bd) => bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.remove('show'); }));

  function truncate(text, len) {
    if (!text) return '—';
    return text.length > len ? text.slice(0, len) + '…' : text;
  }
  function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  async function loadLeads() {
    const tbody = document.querySelector('#myLeadsTable tbody');
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Loading...</td></tr>`;
    try {
      const res = await apiGet('/leads/mine');
      leadsCache = res.data;
      tbody.innerHTML = leadsCache.length
        ? leadsCache.map((l) => `
          <tr>
            <td>${new Date(l.date).toLocaleDateString()}</td>
            <td>${l.time}</td>
            <td>${l.customerName}</td>
            <td>${l.organization || '—'}</td>
            <td>${l.contact || '—'}</td>
            <td style="max-width:180px; white-space:normal;">${truncate(l.requirement, 60)}</td>
            <td><span class="badge badge-${l.followUp === 'cancelled' ? 'pending' : 'completed'}">${followUpLabel[l.followUp]}</span></td>
            <td style="max-width:220px; white-space:normal;">${truncate(l.remark, 80)}</td>
            <td style="white-space:nowrap;">
              <button class="link-btn" data-edit-lead="${l._id}">Edit</button>
              <button class="link-btn danger-link" data-delete-lead="${l._id}">Delete</button>
            </td>
          </tr>`).join('')
        : `<tr><td colspan="9" class="empty-state">No leads logged yet. Click "Add Lead" to log your first one.</td></tr>`;

      tbody.querySelectorAll('[data-edit-lead]').forEach((btn) => {
        btn.addEventListener('click', () => openLeadModal(leadsCache.find((l) => l._id === btn.dataset.editLead)));
      });
      tbody.querySelectorAll('[data-delete-lead]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this lead?')) return;
          await apiDelete(`/leads/${btn.dataset.deleteLead}`);
          loadLeads();
        });
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Could not load leads.</td></tr>`;
    }
  }

  function openLeadModal(lead) {
    document.getElementById('leadModalTitle').textContent = lead ? 'Edit Lead' : 'Add Lead';
    document.getElementById('leadId').value = lead?._id || '';
    document.getElementById('leadDate').value = lead ? new Date(lead.date).toISOString().slice(0, 10) : todayStr();
    document.getElementById('leadTime').value = lead?.time || '';
    document.getElementById('leadCustomerName').value = lead?.customerName || '';
    document.getElementById('leadOrganization').value = lead?.organization || '';
    document.getElementById('leadContact').value = lead?.contact || '';
    document.getElementById('leadFollowUp').value = lead?.followUp || 'active';
    document.getElementById('leadAddress').value = lead?.address || '';
    document.getElementById('leadRequirement').value = lead?.requirement || '';
    document.getElementById('leadRemark').value = lead?.remark || '';
    document.getElementById('leadFormError').style.display = 'none';
    openModal('leadModal');
  }

  document.getElementById('openAddLead').addEventListener('click', () => openLeadModal(null));

  document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('leadFormError');
    errEl.style.display = 'none';

    const payload = {
      date: document.getElementById('leadDate').value,
      time: document.getElementById('leadTime').value,
      customerName: document.getElementById('leadCustomerName').value.trim(),
      organization: document.getElementById('leadOrganization').value.trim(),
      contact: document.getElementById('leadContact').value.trim(),
      followUp: document.getElementById('leadFollowUp').value,
      address: document.getElementById('leadAddress').value.trim(),
      requirement: document.getElementById('leadRequirement').value.trim(),
      remark: document.getElementById('leadRemark').value.trim()
    };
    const id = document.getElementById('leadId').value;

    try {
      if (id) {
        await apiPut(`/leads/${id}`, payload);
      } else {
        await apiPost('/leads', payload);
      }
      closeModal('leadModal');
      loadLeads();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  function badge(value) {
    return `<span class="badge badge-${value}">${value.replace('-', ' ')}</span>`;
  }
  function fmtTime(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  function fmtHours(checkIn, checkOut) {
    if (!checkIn) return '—';
    const end = checkOut ? new Date(checkOut) : new Date();
    const ms = end - new Date(checkIn);
    const hrs = ms / 1000 / 60 / 60;
    return `${hrs.toFixed(1)}h`;
  }

  const sections = ['home', 'tasks', 'profile', 'leads'];
  function showSection(name) {
    sections.forEach((s) => {
      const el = document.getElementById(`sec-${s}`);
      if (el) el.style.display = s === name ? '' : 'none';
    });
    document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
    closeSidebar();
    if (name === 'profile') loadProfile();
    if (name === 'tasks') loadTodayTasks();
    if (name === 'leads') loadLeads();
  }
  document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.section); });
  });
  document.querySelectorAll('[data-goto-section]').forEach((el) => {
    el.addEventListener('click', () => showSection(el.dataset.gotoSection));
  });

  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('dashBackdrop');
  function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
  document.getElementById('dashMenuBtn').addEventListener('click', openSidebar);
  backdrop.addEventListener('click', closeSidebar);

  document.getElementById('sidebarLogout').addEventListener('click', logout);

  function tickClock() {
    const now = new Date();
    document.getElementById('liveClock').textContent = now.toLocaleTimeString();
    document.getElementById('liveClockDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
      document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance.checkIn, null);
    }
  }
  tickClock();
  setInterval(tickClock, 1000);

  function renderAttendanceState() {
    const inBtn = document.getElementById('checkInBtn');
    const outBtn = document.getElementById('checkOutBtn');

    document.getElementById('checkInTimeLabel').textContent = fmtTime(todayAttendance?.checkIn);
    document.getElementById('checkOutTimeLabel').textContent = fmtTime(todayAttendance?.checkOut);
    document.getElementById('hoursTodayLabel').textContent = fmtHours(todayAttendance?.checkIn, todayAttendance?.checkOut);

    if (!todayAttendance?.checkIn) {
      inBtn.disabled = false;
      inBtn.textContent = 'Check In';
      outBtn.disabled = true;
    } else if (todayAttendance.checkIn && !todayAttendance.checkOut) {
      inBtn.disabled = true;
      inBtn.textContent = 'Checked In ✓';
      outBtn.disabled = false;
    } else {
      inBtn.disabled = true;
      inBtn.textContent = 'Checked In ✓';
      outBtn.disabled = true;
      outBtn.textContent = 'Checked Out ✓';
    }

    document.getElementById('statAttendanceStatus').textContent = todayAttendance?.checkOut
      ? 'Done for today'
      : todayAttendance?.checkIn
      ? 'Checked In'
      : 'Not marked';
  }

  async function loadTodayAttendance() {
    try {
      const res = await apiGet('/attendance/today');
      todayAttendance = res.data;
      renderAttendanceState();
    } catch (e) { console.error(e); }
  }

  function flashAttendanceMsg(text, isError) {
    const el = document.getElementById('attendanceMsg');
    el.textContent = text;
    el.style.color = isError ? '#EF4444' : '#10B981';
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
  }

  document.getElementById('checkInBtn').addEventListener('click', async () => {
    try {
      const res = await apiPost('/attendance/checkin');
      todayAttendance = res.data;
      renderAttendanceState();
      flashAttendanceMsg('Checked in at ' + fmtTime(res.data.checkIn), false);
      loadHomeStats();
    } catch (e) { flashAttendanceMsg(e.message, true); }
  });

  document.getElementById('checkOutBtn').addEventListener('click', async () => {
    try {
      const res = await apiPost('/attendance/checkout');
      todayAttendance = res.data;
      renderAttendanceState();
      flashAttendanceMsg('Checked out at ' + fmtTime(res.data.checkOut), false);
    } catch (e) { flashAttendanceMsg(e.message, true); }
  });

  async function loadHomeStats() {
    try {
      const [tasksRes, attRes] = await Promise.all([apiGet('/tasks/today'), apiGet('/attendance/me')]);
      const tasks = tasksRes.data;
      const attendance = attRes.data;

      document.getElementById('statTasksToday').textContent = tasks.length;
      document.getElementById('statCompletedToday').textContent = tasks.filter((t) => t.status === 'completed').length;

      const thisMonth = new Date().getMonth();
      const monthRecords = attendance.filter((a) => new Date(a.date).getMonth() === thisMonth);
      const presentCount = monthRecords.filter((a) => a.status === 'present').length;
      const rate = monthRecords.length ? Math.round((presentCount / monthRecords.length) * 100) : 0;
      document.getElementById('statMonthRate').textContent = `${rate}%`;

      const preview = document.getElementById('homeTaskPreview');
      preview.innerHTML = tasks.length
        ? tasks.slice(0, 3).map((t) => `
          <div class="task-row">
            <div>
              <h4>${t.title}</h4>
              ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
              <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
            </div>
          </div>`).join('')
        : `<p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p>`;
    } catch (e) { console.error(e); }
  }

  const statusFlow = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
  const statusActionLabel = { pending: 'Start Task', 'in-progress': 'Mark Complete', completed: 'Reopen' };

  async function loadTodayTasks() {
    const list = document.getElementById('todayTaskList');
    list.innerHTML = `<div class="dash-card"><p class="empty-state">Loading your tasks...</p></div>`;
    try {
      const res = await apiGet('/tasks/today');
      const tasks = res.data;
      renderProgress(tasks);

      list.innerHTML = tasks.length
        ? tasks.map((t) => `
          <div class="task-row" data-task="${t._id}">
            <div>
              <h4>${t.title}</h4>
              ${t.dailyGoal ? `<p><strong>Goal:</strong> ${t.dailyGoal}</p>` : ''}
              ${t.description ? `<p>${t.description}</p>` : ''}
              <div class="task-meta">${badge(t.priority)} ${badge(t.status)}</div>
            </div>
            <button class="btn ${t.status === 'completed' ? 'btn-ghost' : 'btn-primary'} btn-sm" data-advance="${t._id}" data-status="${t.status}">
              ${statusActionLabel[t.status]}
            </button>
          </div>`).join('')
        : `<div class="dash-card"><p class="empty-state">No tasks assigned for today. Enjoy the breathing room! 🎉</p></div>`;

      list.querySelectorAll('[data-advance]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const next = statusFlow[btn.dataset.status];
          btn.disabled = true;
          try {
            await apiPatch(`/tasks/${btn.dataset.advance}/status`, { status: next });
            loadTodayTasks();
            loadHomeStats();
          } catch (e) {
            alert(e.message);
            btn.disabled = false;
          }
        });
      });
    } catch (e) {
      list.innerHTML = `<div class="dash-card"><p class="empty-state">Could not load tasks.</p></div>`;
    }
  }

  function renderProgress(tasks) {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'completed').length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('progressLabel').textContent = `${done}/${total} done`;
    document.getElementById('progressFill').style.width = `${pct}%`;
  }

  async function loadProfile() {
    try {
      const [tasksRes, attRes] = await Promise.all([apiGet('/tasks'), apiGet('/attendance/me')]);
      const tasks = tasksRes.data;
      const attendance = attRes.data;

      const total = tasks.length;
      const completed = tasks.filter((t) => t.status === 'completed').length;
      const rate = total ? Math.round((completed / total) * 100) : 0;
      const present = attendance.filter((a) => a.status === 'present').length;

      document.getElementById('snapCompleted').textContent = completed;
      document.getElementById('snapRate').textContent = `${rate}%`;
      document.getElementById('snapPresent').textContent = present;
      document.getElementById('snapTotal').textContent = total;

      document.getElementById('profileDetails').innerHTML = `
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Full Name</span><strong>${currentUser.name}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Email</span><strong>${currentUser.email}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Phone</span><strong>${currentUser.phone || '—'}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Position</span><strong>${currentUser.position || '—'}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Department</span><strong>${currentUser.department || '—'}</strong></div>
        <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-faint);">Joined</span><strong>${new Date(currentUser.joiningDate).toLocaleDateString()}</strong></div>
      `;

      document.querySelector('#myAttendanceTable tbody').innerHTML = attendance.length
        ? attendance.slice(0, 20).map((a) => `
          <tr>
            <td>${new Date(a.date).toLocaleDateString()}</td>
            <td>${fmtTime(a.checkIn)}</td>
            <td>${fmtTime(a.checkOut)}</td>
            <td>${fmtHours(a.checkIn, a.checkOut)}</td>
            <td>${badge(a.status)}</td>
          </tr>`).join('')
        : `<tr><td colspan="5" class="empty-state">No attendance records yet.</td></tr>`;

      document.querySelector('#myTaskHistoryTable tbody').innerHTML = tasks.length
        ? tasks.slice(0, 20).map((t) => `<tr><td>${t.title}</td><td>${new Date(t.date).toLocaleDateString()}</td><td>${badge(t.priority)}</td><td>${badge(t.status)}</td></tr>`).join('')
        : `<tr><td colspan="4" class="empty-state">No task history yet.</td></tr>`;
    } catch (e) { console.error(e); }
  }

  (async function init() {
    currentUser = await guardDashboard('employee');
    if (!currentUser) return;

    document.getElementById('topbarName').textContent = currentUser.name;
    document.getElementById('homeGreetName').textContent = currentUser.name.split(' ')[0];
    document.getElementById('topbarAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('homeDateLabel').textContent = `Here's your day at a glance — ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`;
    document.getElementById('todayDateLabel').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    await loadTodayAttendance();
    loadHomeStats();
  })();
})();