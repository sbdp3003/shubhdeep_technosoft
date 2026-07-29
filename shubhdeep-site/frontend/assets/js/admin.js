// /* ============================================================
//    ADMIN DASHBOARD LOGIC
//    ============================================================ */
// (function () {
//   const { apiGet, apiPost, guardDashboard, logout } = window.ST;

//   let currentUser = null;
//   let employeesCache = [];
//   let taskStatusFilter = '';

//   // ---------- Theme (kept in sync with main site) ----------
//   try {
//     const saved = localStorage.getItem('theme');
//     document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
//   } catch (e) {}

//   // ---------- Small API helpers with auth ----------
//   async function apiPut(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }
//   async function apiPatch(path, body) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }
//   async function apiDelete(path) {
//     const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'DELETE', credentials: 'include' });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message);
//     return data;
//   }

//   // ---------- Sidebar navigation ----------
//   const sections = ['overview', 'employees', 'tasks', 'attendance'];
//   function showSection(name) {
//     sections.forEach((s) => {
//       const el = document.getElementById(`sec-${s}`);
//       if (el) el.style.display = s === name ? '' : 'none';
//     });
//     document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
//     closeSidebar();
//     if (name === 'employees') loadEmployees();
//     if (name === 'tasks') loadTasks();
//     if (name === 'attendance') loadAttendanceSection();
//   }
//   document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => {
//     a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.section); });
//   });

//   // ---------- Mobile sidebar ----------
//   const sidebar = document.getElementById('dashSidebar');
//   const backdrop = document.getElementById('dashBackdrop');
//   function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
//   function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
//   document.getElementById('dashMenuBtn').addEventListener('click', openSidebar);
//   backdrop.addEventListener('click', closeSidebar);

//   // ---------- Logout ----------
//   document.getElementById('sidebarLogout').addEventListener('click', logout);

//   // ---------- Modals ----------
//   function openModal(id) { document.getElementById(id).classList.add('show'); }
//   function closeModal(id) { document.getElementById(id).classList.remove('show'); }
//   document.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', () => closeModal(btn.dataset.closeModal)));
//   document.querySelectorAll('.dmodal-backdrop').forEach((bd) => bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.remove('show'); }));

//   function badge(value) {
//     return `<span class="badge badge-${value}">${value.replace('-', ' ')}</span>`;
//   }

//   function fmtTime(dateStr) {
//     if (!dateStr) return '—';
//     return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
//   }

//   // ================= OVERVIEW =================
//   async function loadOverview() {
//     try {
//       const [empRes, taskRes, attRes] = await Promise.all([
//         apiGet('/employees'),
//         apiGet('/tasks?date=' + new Date().toISOString().slice(0, 10)),
//         apiGet('/attendance?from=' + todayStr() + '&to=' + todayStr())
//       ]);
//       const employees = empRes.data;
//       const tasks = taskRes.data;
//       const attendance = attRes.data;

//       document.getElementById('statEmployees').textContent = employees.length;
//       document.getElementById('statTasksToday').textContent = tasks.length;
//       document.getElementById('statCompletedToday').textContent = tasks.filter((t) => t.status === 'completed').length;
//       document.getElementById('statPresentToday').textContent = attendance.filter((a) => a.status === 'present').length;

//       const tbody = document.querySelector('#overviewTaskTable tbody');
//       tbody.innerHTML = tasks.length
//         ? tasks.slice(0, 8).map((t) => `
//           <tr>
//             <td>${t.title}</td>
//             <td>${t.assignedTo?.name || '—'}</td>
//             <td>${badge(t.priority)}</td>
//             <td>${badge(t.status)}</td>
//           </tr>`).join('')
//         : `<tr><td colspan="4" class="empty-state">No tasks assigned for today yet.</td></tr>`;
//     } catch (e) { console.error(e); }
//   }

//   function todayStr() {
//     const d = new Date();
//     return d.toISOString().slice(0, 10);
//   }

//   // ================= EMPLOYEES =================
//   async function loadEmployees() {
//     const tbody = document.querySelector('#employeeTable tbody');
//     tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Loading...</td></tr>`;
//     try {
//       const res = await apiGet('/employees');
//       employeesCache = res.data;
//       tbody.innerHTML = employeesCache.length
//         ? employeesCache.map((e) => `
//           <tr>
//             <td><strong>${e.name}</strong><br><span style="color:var(--text-faint); font-size:.78rem;">${e.email}</span></td>
//             <td>${e.phone || '—'}</td>
//             <td>${e.position || '—'}</td>
//             <td>${badge(e.todayAttendance)}</td>
//             <td>${e.todayTaskCompleted}/${e.todayTaskCount}</td>
//             <td>
//               <button class="link-btn" data-edit-employee="${e._id}">Edit</button>
//               <button class="link-btn danger-link" data-deactivate="${e._id}">Deactivate</button>
//             </td>
//           </tr>`).join('')
//         : `<tr><td colspan="6" class="empty-state">No employees yet. Click "Add Employee" to get started.</td></tr>`;

//       tbody.querySelectorAll('[data-edit-employee]').forEach((btn) => {
//         btn.addEventListener('click', () => openEmployeeEditModal(btn.dataset.editEmployee));
//       });

//       tbody.querySelectorAll('[data-deactivate]').forEach((btn) => {
//         btn.addEventListener('click', async () => {
//           if (!confirm('Deactivate this employee?')) return;
//           await apiDelete(`/employees/${btn.dataset.deactivate}`);
//           loadEmployees();
//         });
//       });

//       populateEmployeeSelect();
//     } catch (e) {
//       tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Could not load employees.</td></tr>`;
//     }
//   }

//   function populateEmployeeSelect() {
//     const select = document.getElementById('taskAssignedTo');
//     select.innerHTML = '<option value="">Select employee</option>' + employeesCache.map((e) => `<option value="${e._id}">${e.name} — ${e.position || 'Employee'}</option>`).join('');
//   }

//   document.getElementById('openAddEmployee').addEventListener('click', () => openModal('addEmployeeModal'));

//   async function openEmployeeEditModal(employeeId) {
//     const employee = employeesCache.find((e) => e._id === employeeId);
//     if (!employee) return;
//     document.getElementById('editEmployeeId').value = employee._id;
//     document.getElementById('editEmpName').value = employee.name;
//     document.getElementById('editEmpEmail').value = employee.email;
//     document.getElementById('editEmpPhone').value = employee.phone || '';
//     document.getElementById('editEmpPosition').value = employee.position || '';
//     document.getElementById('editEmpDepartment').value = employee.department || 'General';
//     document.getElementById('editEmpPassword').value = '';
//     document.getElementById('editEmployeeError').style.display = 'none';
//     openModal('editEmployeeModal');
//   }

//   document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const errEl = document.getElementById('addEmployeeError');
//     errEl.style.display = 'none';
//     try {
//       await apiPost('/employees', {
//         name: document.getElementById('empName').value.trim(),
//         email: document.getElementById('empEmail').value.trim(),
//         phone: document.getElementById('empPhone').value.trim(),
//         position: document.getElementById('empPosition').value.trim(),
//         department: document.getElementById('empDepartment').value,
//         password: document.getElementById('empPassword').value.trim() || undefined
//       });
//       closeModal('addEmployeeModal');
//       e.target.reset();
//       loadEmployees();
//       loadOverview();
//     } catch (err) {
//       errEl.textContent = err.message;
//       errEl.style.display = 'block';
//     }
//   });

//   document.getElementById('editEmployeeForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const errEl = document.getElementById('editEmployeeError');
//     errEl.style.display = 'none';
//     try {
//       const id = document.getElementById('editEmployeeId').value;
//       const payload = {
//         name: document.getElementById('editEmpName').value.trim(),
//         email: document.getElementById('editEmpEmail').value.trim(),
//         phone: document.getElementById('editEmpPhone').value.trim(),
//         position: document.getElementById('editEmpPosition').value.trim(),
//         department: document.getElementById('editEmpDepartment').value
//       };
//       const newPassword = document.getElementById('editEmpPassword').value.trim();
//       if (newPassword) payload.password = newPassword;
//       await apiPut(`/employees/${id}`, payload);
//       closeModal('editEmployeeModal');
//       loadEmployees();
//       loadOverview();
//     } catch (err) {
//       errEl.textContent = err.message;
//       errEl.style.display = 'block';
//     }
//   });

//   // ================= TASKS =================
//   async function loadTasks() {
//     if (!employeesCache.length) await loadEmployees();
//     const tbody = document.querySelector('#taskTable tbody');
//     tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Loading...</td></tr>`;
//     try {
//       const query = taskStatusFilter ? `?status=${taskStatusFilter}` : '';
//       const res = await apiGet(`/tasks${query}`);
//       const tasks = res.data;
//       tbody.innerHTML = tasks.length
//         ? tasks.map((t) => `
//           <tr>
//             <td>${t.title}</td>
//             <td>${t.dailyGoal || '—'}</td>
//             <td>${t.assignedTo?.name || '—'}</td>
//             <td>${new Date(t.date).toLocaleDateString()}</td>
//             <td>${badge(t.priority)}</td>
//             <td>${badge(t.status)}</td>
//             <td><button class="link-btn danger-link" data-delete-task="${t._id}">Delete</button></td>
//           </tr>`).join('')
//         : `<tr><td colspan="7" class="empty-state">No tasks found.</td></tr>`;

//       tbody.querySelectorAll('[data-delete-task]').forEach((btn) => {
//         btn.addEventListener('click', async () => {
//           if (!confirm('Delete this task?')) return;
//           await apiDelete(`/tasks/${btn.dataset.deleteTask}`);
//           loadTasks();
//         });
//       });
//     } catch (e) {
//       tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Could not load tasks.</td></tr>`;
//     }
//   }

//   document.querySelectorAll('#taskStatusFilters button').forEach((btn) => {
//     btn.addEventListener('click', () => {
//       document.querySelectorAll('#taskStatusFilters button').forEach((b) => b.classList.remove('active-filter'));
//       btn.classList.add('active-filter');
//       taskStatusFilter = btn.dataset.status;
//       loadTasks();
//     });
//   });

//   document.getElementById('openAssignTask').addEventListener('click', () => {
//     document.getElementById('taskDate').value = todayStr();
//     populateEmployeeSelect();
//     openModal('assignTaskModal');
//   });

//   document.getElementById('assignTaskForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const errEl = document.getElementById('assignTaskError');
//     errEl.style.display = 'none';
//     try {
//       await apiPost('/tasks', {
//         title: document.getElementById('taskTitle').value.trim(),
//         dailyGoal: document.getElementById('taskGoal').value.trim(),
//         description: document.getElementById('taskDescription').value.trim(),
//         assignedTo: document.getElementById('taskAssignedTo').value,
//         date: document.getElementById('taskDate').value,
//         priority: document.getElementById('taskPriority').value
//       });
//       closeModal('assignTaskModal');
//       e.target.reset();
//       loadTasks();
//       loadOverview();
//     } catch (err) {
//       errEl.textContent = err.message;
//       errEl.style.display = 'block';
//     }
//   });

//   // ================= ATTENDANCE =================
//   async function loadAttendanceSection() {
//     if (!employeesCache.length) await loadEmployees();

//     const markBody = document.querySelector('#markAttendanceTable tbody');
//     markBody.innerHTML = employeesCache.map((e) => `
//       <tr>
//         <td><strong>${e.name}</strong></td>
//         <td>${e.position || '—'}</td>
//         <td>
//           <select class="mark-att-select" data-emp="${e._id}" style="padding:6px 10px; border-radius:8px; border:1px solid var(--line); background:var(--bg-soft); font-size:.82rem;">
//             <option value="present" ${e.todayAttendance === 'present' ? 'selected' : ''}>Present</option>
//             <option value="absent" ${e.todayAttendance === 'absent' ? 'selected' : ''}>Absent</option>
//             <option value="half-day" ${e.todayAttendance === 'half-day' ? 'selected' : ''}>Half-day</option>
//             <option value="leave" ${e.todayAttendance === 'leave' ? 'selected' : ''}>Leave</option>
//           </select>
//         </td>
//       </tr>`).join('');

//     markBody.querySelectorAll('.mark-att-select').forEach((sel) => {
//       sel.addEventListener('change', async () => {
//         try {
//           await apiPost('/attendance', { employee: sel.dataset.emp, date: todayStr(), status: sel.value });
//           loadOverview();
//         } catch (e) { alert(e.message); }
//       });
//     });

//     try {
//       const res = await apiGet('/attendance');
//       const logBody = document.querySelector('#attendanceLogTable tbody');
//       logBody.innerHTML = res.data.length
//         ? res.data.slice(0, 30).map((a) => `
//           <tr>
//             <td>${a.employee?.name || '—'}</td>
//             <td>${new Date(a.date).toLocaleDateString()}</td>
//             <td>${badge(a.status)}</td>
//             <td>${fmtTime(a.checkIn)}</td>
//             <td>${fmtTime(a.checkOut)}</td>
//           </tr>`).join('')
//         : `<tr><td colspan="5" class="empty-state">No attendance records yet.</td></tr>`;
//     } catch (e) { console.error(e); }
//   }

//   // ================= INIT =================
//   (async function init() {
//     currentUser = await guardDashboard('admin');
//     if (!currentUser) return;

//     document.getElementById('topbarName').textContent = currentUser.name;
//     document.getElementById('overviewName').textContent = currentUser.name.split(' ')[0];
//     document.getElementById('topbarAvatar').textContent = currentUser.name.charAt(0).toUpperCase();

//     loadOverview();
//   })();
// })();




/* ============================================================
   ADMIN DASHBOARD LOGIC
   ============================================================ */
(function () {
  const { apiGet, apiPost, guardDashboard, logout } = window.ST;

  let currentUser = null;
  let employeesCache = [];
  let taskStatusFilter = '';

  // ---------- Theme (kept in sync with main site) ----------
  try {
    const saved = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch (e) {}

  // ---------- Small API helpers with auth ----------
  async function apiPut(path, body) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', ...window.ST.authHeaders() }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
  async function apiPatch(path, body) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json', ...window.ST.authHeaders() }, body: JSON.stringify(body) });
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

  // ---------- Sidebar navigation ----------
  const sections = ['overview', 'employees', 'tasks', 'attendance'];
  function showSection(name) {
    sections.forEach((s) => {
      const el = document.getElementById(`sec-${s}`);
      if (el) el.style.display = s === name ? '' : 'none';
    });
    document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => a.classList.toggle('active', a.dataset.section === name));
    closeSidebar();
    if (name === 'employees') loadEmployees();
    if (name === 'tasks') loadTasks();
    if (name === 'attendance') loadAttendanceSection();
  }
  document.querySelectorAll('.dash-nav a[data-section]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.section); });
  });

  // ---------- Mobile sidebar ----------
  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('dashBackdrop');
  function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
  document.getElementById('dashMenuBtn').addEventListener('click', openSidebar);
  backdrop.addEventListener('click', closeSidebar);

  // ---------- Logout ----------
  document.getElementById('sidebarLogout').addEventListener('click', logout);

  // ---------- Modals ----------
  function openModal(id) { document.getElementById(id).classList.add('show'); }
  function closeModal(id) { document.getElementById(id).classList.remove('show'); }
  document.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', () => closeModal(btn.dataset.closeModal)));
  document.querySelectorAll('.dmodal-backdrop').forEach((bd) => bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.remove('show'); }));

  function badge(value) {
    return `<span class="badge badge-${value}">${value.replace('-', ' ')}</span>`;
  }

  function fmtTime(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  // ================= OVERVIEW =================
  async function loadOverview() {
    try {
      const [empRes, taskRes, attRes] = await Promise.all([
        apiGet('/employees'),
        apiGet('/tasks?date=' + new Date().toISOString().slice(0, 10)),
        apiGet('/attendance?from=' + todayStr() + '&to=' + todayStr())
      ]);
      const employees = empRes.data;
      const tasks = taskRes.data;
      const attendance = attRes.data;

      document.getElementById('statEmployees').textContent = employees.length;
      document.getElementById('statTasksToday').textContent = tasks.length;
      document.getElementById('statCompletedToday').textContent = tasks.filter((t) => t.status === 'completed').length;
      document.getElementById('statPresentToday').textContent = attendance.filter((a) => a.status === 'present').length;

      const tbody = document.querySelector('#overviewTaskTable tbody');
      tbody.innerHTML = tasks.length
        ? tasks.slice(0, 8).map((t) => `
          <tr>
            <td>${t.title}</td>
            <td>${t.assignedTo?.name || '—'}</td>
            <td>${badge(t.priority)}</td>
            <td>${badge(t.status)}</td>
          </tr>`).join('')
        : `<tr><td colspan="4" class="empty-state">No tasks assigned for today yet.</td></tr>`;
    } catch (e) { console.error(e); }
  }

  function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  // ================= EMPLOYEES =================
  async function loadEmployees() {
    const tbody = document.querySelector('#employeeTable tbody');
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Loading...</td></tr>`;
    try {
      const res = await apiGet('/employees');
      employeesCache = res.data;
      tbody.innerHTML = employeesCache.length
        ? employeesCache.map((e) => `
          <tr>
            <td><strong>${e.name}</strong><br><span style="color:var(--text-faint); font-size:.78rem;">${e.email}</span></td>
            <td>${e.phone || '—'}</td>
            <td>${e.position || '—'}</td>
            <td>${badge(e.todayAttendance)}</td>
            <td>${e.todayTaskCompleted}/${e.todayTaskCount}</td>
            <td>
              <button class="link-btn" data-edit-employee="${e._id}">Edit</button>
              <button class="link-btn danger-link" data-deactivate="${e._id}">Deactivate</button>
            </td>
          </tr>`).join('')
        : `<tr><td colspan="6" class="empty-state">No employees yet. Click "Add Employee" to get started.</td></tr>`;

      tbody.querySelectorAll('[data-edit-employee]').forEach((btn) => {
        btn.addEventListener('click', () => openEmployeeEditModal(btn.dataset.editEmployee));
      });

      tbody.querySelectorAll('[data-deactivate]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Deactivate this employee?')) return;
          await apiDelete(`/employees/${btn.dataset.deactivate}`);
          loadEmployees();
        });
      });

      populateEmployeeSelect();
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Could not load employees.</td></tr>`;
    }
  }

  function populateEmployeeSelect() {
    const select = document.getElementById('taskAssignedTo');
    select.innerHTML = '<option value="">Select employee</option>' + employeesCache.map((e) => `<option value="${e._id}">${e.name} — ${e.position || 'Employee'}</option>`).join('');
  }

  document.getElementById('openAddEmployee').addEventListener('click', () => openModal('addEmployeeModal'));

  async function openEmployeeEditModal(employeeId) {
    const employee = employeesCache.find((e) => e._id === employeeId);
    if (!employee) return;
    document.getElementById('editEmployeeId').value = employee._id;
    document.getElementById('editEmpName').value = employee.name;
    document.getElementById('editEmpEmail').value = employee.email;
    document.getElementById('editEmpPhone').value = employee.phone || '';
    document.getElementById('editEmpPosition').value = employee.position || '';
    document.getElementById('editEmpDepartment').value = employee.department || 'General';
    document.getElementById('editEmpPassword').value = '';
    document.getElementById('editEmployeeError').style.display = 'none';
    openModal('editEmployeeModal');
  }

  document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('addEmployeeError');
    errEl.style.display = 'none';
    try {
      await apiPost('/employees', {
        name: document.getElementById('empName').value.trim(),
        email: document.getElementById('empEmail').value.trim(),
        phone: document.getElementById('empPhone').value.trim(),
        position: document.getElementById('empPosition').value.trim(),
        department: document.getElementById('empDepartment').value,
        password: document.getElementById('empPassword').value.trim() || undefined
      });
      closeModal('addEmployeeModal');
      e.target.reset();
      loadEmployees();
      loadOverview();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  document.getElementById('editEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('editEmployeeError');
    errEl.style.display = 'none';
    try {
      const id = document.getElementById('editEmployeeId').value;
      const payload = {
        name: document.getElementById('editEmpName').value.trim(),
        email: document.getElementById('editEmpEmail').value.trim(),
        phone: document.getElementById('editEmpPhone').value.trim(),
        position: document.getElementById('editEmpPosition').value.trim(),
        department: document.getElementById('editEmpDepartment').value
      };
      const newPassword = document.getElementById('editEmpPassword').value.trim();
      if (newPassword) payload.password = newPassword;
      await apiPut(`/employees/${id}`, payload);
      closeModal('editEmployeeModal');
      loadEmployees();
      loadOverview();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  // ================= TASKS =================
  async function loadTasks() {
    if (!employeesCache.length) await loadEmployees();
    const tbody = document.querySelector('#taskTable tbody');
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Loading...</td></tr>`;
    try {
      const query = taskStatusFilter ? `?status=${taskStatusFilter}` : '';
      const res = await apiGet(`/tasks${query}`);
      const tasks = res.data;
      tbody.innerHTML = tasks.length
        ? tasks.map((t) => `
          <tr>
            <td>${t.title}</td>
            <td>${t.dailyGoal || '—'}</td>
            <td>${t.assignedTo?.name || '—'}</td>
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${badge(t.priority)}</td>
            <td>${badge(t.status)}</td>
            <td><button class="link-btn danger-link" data-delete-task="${t._id}">Delete</button></td>
          </tr>`).join('')
        : `<tr><td colspan="7" class="empty-state">No tasks found.</td></tr>`;

      tbody.querySelectorAll('[data-delete-task]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this task?')) return;
          await apiDelete(`/tasks/${btn.dataset.deleteTask}`);
          loadTasks();
        });
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Could not load tasks.</td></tr>`;
    }
  }

  document.querySelectorAll('#taskStatusFilters button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#taskStatusFilters button').forEach((b) => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      taskStatusFilter = btn.dataset.status;
      loadTasks();
    });
  });

  document.getElementById('openAssignTask').addEventListener('click', () => {
    document.getElementById('taskDate').value = todayStr();
    populateEmployeeSelect();
    openModal('assignTaskModal');
  });

  document.getElementById('assignTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('assignTaskError');
    errEl.style.display = 'none';
    try {
      await apiPost('/tasks', {
        title: document.getElementById('taskTitle').value.trim(),
        dailyGoal: document.getElementById('taskGoal').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        assignedTo: document.getElementById('taskAssignedTo').value,
        date: document.getElementById('taskDate').value,
        priority: document.getElementById('taskPriority').value
      });
      closeModal('assignTaskModal');
      e.target.reset();
      loadTasks();
      loadOverview();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  // ================= ATTENDANCE =================
  async function loadAttendanceSection() {
    if (!employeesCache.length) await loadEmployees();

    const markBody = document.querySelector('#markAttendanceTable tbody');
    markBody.innerHTML = employeesCache.map((e) => `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td>${e.position || '—'}</td>
        <td>
          <select class="mark-att-select" data-emp="${e._id}" style="padding:6px 10px; border-radius:8px; border:1px solid var(--line); background:var(--bg-soft); font-size:.82rem;">
            <option value="present" ${e.todayAttendance === 'present' ? 'selected' : ''}>Present</option>
            <option value="absent" ${e.todayAttendance === 'absent' ? 'selected' : ''}>Absent</option>
            <option value="half-day" ${e.todayAttendance === 'half-day' ? 'selected' : ''}>Half-day</option>
            <option value="leave" ${e.todayAttendance === 'leave' ? 'selected' : ''}>Leave</option>
          </select>
        </td>
      </tr>`).join('');

    markBody.querySelectorAll('.mark-att-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        try {
          await apiPost('/attendance', { employee: sel.dataset.emp, date: todayStr(), status: sel.value });
          loadOverview();
        } catch (e) { alert(e.message); }
      });
    });

    try {
      const res = await apiGet('/attendance');
      const logBody = document.querySelector('#attendanceLogTable tbody');
      logBody.innerHTML = res.data.length
        ? res.data.slice(0, 30).map((a) => `
          <tr>
            <td>${a.employee?.name || '—'}</td>
            <td>${new Date(a.date).toLocaleDateString()}</td>
            <td>${badge(a.status)}</td>
            <td>${fmtTime(a.checkIn)}</td>
            <td>${fmtTime(a.checkOut)}</td>
          </tr>`).join('')
        : `<tr><td colspan="5" class="empty-state">No attendance records yet.</td></tr>`;
    } catch (e) { console.error(e); }
  }

  // ================= INIT =================
  (async function init() {
    currentUser = await guardDashboard('admin');
    if (!currentUser) return;

    document.getElementById('topbarName').textContent = currentUser.name;
    document.getElementById('overviewName').textContent = currentUser.name.split(' ')[0];
    document.getElementById('topbarAvatar').textContent = currentUser.name.charAt(0).toUpperCase();

    loadOverview();
  })();
})();