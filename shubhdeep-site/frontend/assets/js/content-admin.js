(function () {
  const { apiGet, apiPost } = window.ST;

  async function apiPut(path, body) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
  async function apiDelete(path) {
    const res = await fetch(`${window.ST_API_BASE}${path}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }

  function flashMsg(el, text, isError) {
    el.textContent = text;
    el.style.display = 'block';
    el.style.color = isError ? '#EF4444' : '#10B981';
    setTimeout(() => { el.style.display = 'none'; }, 2500);
  }

  document.querySelectorAll('.dash-nav a[data-section="content"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('#sec-overview,#sec-employees,#sec-tasks,#sec-attendance,#sec-content').forEach((sec) => {
        if (sec) sec.style.display = sec.id === 'sec-content' ? '' : 'none';
      });
      document.querySelectorAll('.dash-nav a[data-section]').forEach((l) => l.classList.toggle('active', l === a));
      loadHero();
    });
  });

  document.querySelectorAll('.content-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.content-tab').forEach((b) => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      document.querySelectorAll('.content-panel').forEach((p) => (p.style.display = 'none'));
      document.getElementById(`panel-${btn.dataset.tab}`).style.display = '';
      if (btn.dataset.tab === 'hero') loadHero();
      if (btn.dataset.tab === 'about') loadAbout();
      if (btn.dataset.tab === 'contact') loadContact();
      if (btn.dataset.tab === 'services') loadServices();
    });
  });

  async function loadHero() {
    try {
      const res = await apiGet('/content/hero');
      const d = res.data || {};
      document.getElementById('heroTitle').value = d.title || '';
      document.getElementById('heroHighlight').value = d.highlight || '';
      document.getElementById('heroSubtitle').value = d.subtitle || '';
      document.getElementById('heroCtaPrimaryText').value = d.ctaPrimaryText || '';
      document.getElementById('heroCtaPrimaryLink').value = d.ctaPrimaryLink || '';
      document.getElementById('heroCtaSecondaryText').value = d.ctaSecondaryText || '';
      document.getElementById('heroCtaSecondaryLink').value = d.ctaSecondaryLink || '';
      const stats = d.stats || [];
      for (let i = 0; i < 4; i++) {
        document.getElementById(`heroStat${i}Value`).value = stats[i]?.value ?? '';
        document.getElementById(`heroStat${i}Label`).value = stats[i]?.label ?? '';
      }
    } catch (e) { console.error(e); }
  }

  document.getElementById('heroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('heroSaveMsg');
    const stats = [];
    for (let i = 0; i < 4; i++) {
      const value = document.getElementById(`heroStat${i}Value`).value.trim();
      const label = document.getElementById(`heroStat${i}Label`).value.trim();
      if (value || label) stats.push({ value, label });
    }
    try {
      await apiPut('/content/hero', {
        title: document.getElementById('heroTitle').value.trim(),
        highlight: document.getElementById('heroHighlight').value.trim(),
        subtitle: document.getElementById('heroSubtitle').value.trim(),
        ctaPrimaryText: document.getElementById('heroCtaPrimaryText').value.trim(),
        ctaPrimaryLink: document.getElementById('heroCtaPrimaryLink').value.trim(),
        ctaSecondaryText: document.getElementById('heroCtaSecondaryText').value.trim(),
        ctaSecondaryLink: document.getElementById('heroCtaSecondaryLink').value.trim(),
        stats
      });
      flashMsg(msg, 'Hero section saved ✓', false);
    } catch (err) {
      flashMsg(msg, err.message, true);
    }
  });

  async function loadAbout() {
    try {
      const res = await apiGet('/content/about');
      const d = res.data || {};
      document.getElementById('aboutEyebrow').value = d.eyebrow || '';
      document.getElementById('aboutTitle').value = d.title || '';
      document.getElementById('aboutDescription').value = d.description || '';
      document.getElementById('aboutMissionTitle').value = d.missionTitle || '';
      document.getElementById('aboutMissionText').value = d.missionText || '';
      document.getElementById('aboutVisionTitle').value = d.visionTitle || '';
      document.getElementById('aboutVisionText').value = d.visionText || '';
      document.getElementById('aboutValuesTitle').value = d.valuesTitle || '';
      document.getElementById('aboutValuesText').value = d.valuesText || '';
      document.getElementById('aboutBadgeValue').value = d.badgeValue || '';
      document.getElementById('aboutBadgeText').value = d.badgeText || '';
    } catch (e) { console.error(e); }
  }

  document.getElementById('aboutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('aboutSaveMsg');
    try {
      await apiPut('/content/about', {
        eyebrow: document.getElementById('aboutEyebrow').value.trim(),
        title: document.getElementById('aboutTitle').value.trim(),
        description: document.getElementById('aboutDescription').value.trim(),
        missionTitle: document.getElementById('aboutMissionTitle').value.trim(),
        missionText: document.getElementById('aboutMissionText').value.trim(),
        visionTitle: document.getElementById('aboutVisionTitle').value.trim(),
        visionText: document.getElementById('aboutVisionText').value.trim(),
        valuesTitle: document.getElementById('aboutValuesTitle').value.trim(),
        valuesText: document.getElementById('aboutValuesText').value.trim(),
        badgeValue: document.getElementById('aboutBadgeValue').value.trim(),
        badgeText: document.getElementById('aboutBadgeText').value.trim()
      });
      flashMsg(msg, 'About section saved ✓', false);
    } catch (err) {
      flashMsg(msg, err.message, true);
    }
  });

  async function loadContact() {
    try {
      const res = await apiGet('/content/contact');
      const d = res.data || {};
      document.getElementById('contactPhone').value = d.phone || '';
      document.getElementById('contactEmail').value = d.email || '';
      document.getElementById('contactAddress').value = d.address || '';
      document.getElementById('contactHoursWeekday').value = d.hoursWeekday || '';
      document.getElementById('contactHoursSaturday').value = d.hoursSaturday || '';
      document.getElementById('contactHoursSunday').value = d.hoursSunday || '';
      document.getElementById('contactSocialLinkedin').value = d.socialLinkedin || '';
      document.getElementById('contactSocialTwitter').value = d.socialTwitter || '';
      document.getElementById('contactSocialInstagram').value = d.socialInstagram || '';
      document.getElementById('contactSocialGithub').value = d.socialGithub || '';
    } catch (e) { console.error(e); }
  }

  document.getElementById('contactContentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('contactSaveMsg');
    try {
      await apiPut('/content/contact', {
        phone: document.getElementById('contactPhone').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        address: document.getElementById('contactAddress').value.trim(),
        hoursWeekday: document.getElementById('contactHoursWeekday').value.trim(),
        hoursSaturday: document.getElementById('contactHoursSaturday').value.trim(),
        hoursSunday: document.getElementById('contactHoursSunday').value.trim(),
        socialLinkedin: document.getElementById('contactSocialLinkedin').value.trim(),
        socialTwitter: document.getElementById('contactSocialTwitter').value.trim(),
        socialInstagram: document.getElementById('contactSocialInstagram').value.trim(),
        socialGithub: document.getElementById('contactSocialGithub').value.trim()
      });
      flashMsg(msg, 'Contact info saved ✓', false);
    } catch (err) {
      flashMsg(msg, err.message, true);
    }
  });

  function openModal(id) { document.getElementById(id).classList.add('show'); }
  function closeModal(id) { document.getElementById(id).classList.remove('show'); }
  document.querySelectorAll('#serviceModal [data-close-modal]').forEach((btn) => btn.addEventListener('click', () => closeModal('serviceModal')));
  document.getElementById('serviceModal').addEventListener('click', (e) => { if (e.target.id === 'serviceModal') closeModal('serviceModal'); });

  async function loadServices() {
    const tbody = document.querySelector('#serviceTable tbody');
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Loading...</td></tr>`;
    try {
      const res = await apiGet('/services/all');
      const services = res.data;
      tbody.innerHTML = services.length
        ? services.map((s) => `
          <tr>
            <td>${s.order}</td>
            <td style="font-size:1.1rem;">${s.icon}</td>
            <td><strong>${s.name}</strong></td>
            <td style="max-width:280px; white-space:normal;">${s.desc}</td>
            <td><span class="badge ${s.isActive ? 'badge-completed' : 'badge-pending'}">${s.isActive ? 'Published' : 'Hidden'}</span></td>
            <td style="white-space:nowrap;">
              <button class="link-btn" data-edit-service="${s._id}">Edit</button>
              &nbsp;·&nbsp;
              <button class="link-btn danger-link" data-delete-service="${s._id}">Delete</button>
            </td>
          </tr>`).join('')
        : `<tr><td colspan="6" class="empty-state">No services yet. Click "Add Service" to create one.</td></tr>`;

      tbody.querySelectorAll('[data-edit-service]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const s = services.find((x) => x._id === btn.dataset.editService);
          openServiceModal(s);
        });
      });
      tbody.querySelectorAll('[data-delete-service]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this service? This cannot be undone.')) return;
          await apiDelete(`/services/${btn.dataset.deleteService}`);
          loadServices();
        });
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Could not load services.</td></tr>`;
    }
  }

  function openServiceModal(service) {
    document.getElementById('serviceModalTitle').textContent = service ? 'Edit Service' : 'Add Service';
    document.getElementById('serviceId').value = service?._id || '';
    document.getElementById('serviceIcon').value = service?.icon || '';
    document.getElementById('serviceOrder').value = service?.order ?? 0;
    document.getElementById('serviceName').value = service?.name || '';
    document.getElementById('serviceDesc').value = service?.desc || '';
    document.getElementById('serviceFeats').value = (service?.feats || []).join(', ');
    document.getElementById('serviceIsActive').checked = service ? !!service.isActive : true;
    document.getElementById('serviceFormError').style.display = 'none';
    openModal('serviceModal');
  }

  document.getElementById('openAddServiceBtn').addEventListener('click', () => openServiceModal(null));

  document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('serviceFormError');
    errEl.style.display = 'none';

    const payload = {
      icon: document.getElementById('serviceIcon').value.trim(),
      order: Number(document.getElementById('serviceOrder').value) || 0,
      name: document.getElementById('serviceName').value.trim(),
      desc: document.getElementById('serviceDesc').value.trim(),
      feats: document.getElementById('serviceFeats').value,
      isActive: document.getElementById('serviceIsActive').checked
    };
    const id = document.getElementById('serviceId').value;

    try {
      if (id) {
        await apiPut(`/services/${id}`, payload);
      } else {
        await apiPost('/services', payload);
      }
      closeModal('serviceModal');
      loadServices();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });
})();