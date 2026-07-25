(function () {
  const API_BASE = window.ST_API_BASE || 'http://localhost:5001/api';

  function setText(id, value) {
    if (value === undefined || value === null || value === '') return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function setHref(id, value) {
    if (!value) return;
    const el = document.getElementById(id);
    if (el) el.setAttribute('href', value);
  }

  function loadHero(hero) {
    if (!hero) return;
    setText('heroTitleText', hero.title);
    setText('heroHighlightText', hero.highlight);
    setText('heroSubtitleText', hero.subtitle);
    setText('heroCtaPrimaryBtn', hero.ctaPrimaryText);
    setHref('heroCtaPrimaryBtn', hero.ctaPrimaryLink);
    setText('heroCtaSecondaryBtn', hero.ctaSecondaryText);
    setHref('heroCtaSecondaryBtn', hero.ctaSecondaryLink);

    (hero.stats || []).forEach((stat, i) => {
      const wrap = document.getElementById(`heroStat${i}`);
      if (!wrap) return;
      const counter = wrap.querySelector('.counter');
      const label = wrap.querySelector('span');
      if (counter && stat.value !== undefined && stat.value !== '') {
        counter.dataset.target = stat.value;
        if (counter.textContent !== '0') counter.textContent = stat.value;
      }
      if (label && stat.label) label.textContent = stat.label;
    });
  }

  function loadAbout(about) {
    if (!about) return;
    setText('aboutEyebrowText', about.eyebrow);
    setText('aboutTitleText', about.title);
    setText('aboutDescriptionText', about.description);
    setText('aboutMissionTitleText', about.missionTitle);
    setText('aboutMissionTextEl', about.missionText);
    setText('aboutVisionTitleText', about.visionTitle);
    setText('aboutVisionTextEl', about.visionText);
    setText('aboutValuesTitleText', about.valuesTitle);
    setText('aboutValuesTextEl', about.valuesText);
    setText('aboutBadgeValueText', about.badgeValue);
    setText('aboutBadgeTextEl', about.badgeText);
  }

  function loadContact(contact) {
    if (!contact) return;
    setText('contactPhoneText', contact.phone);
    setText('contactEmailText', contact.email);
    setText('contactAddressText', contact.address);
    setText('contactHoursWeekdayText', contact.hoursWeekday);
    setText('contactHoursSaturdayText', contact.hoursSaturday);
    setText('contactHoursSundayText', contact.hoursSunday);
  }

  function loadServices(services) {
    const grid = document.getElementById('servicesGrid');
    if (!grid || !Array.isArray(services) || services.length === 0) return;

    const arrowSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

    grid.innerHTML = services.map((s) => `
      <div class="svc-card reveal in">
        <div class="svc-icon">${s.icon}</div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="svc-feat">${(s.feats || []).map((f) => `<span>${f}</span>`).join('')}</div>
        <a href="#contact" class="svc-link">Learn More ${arrowSvg}</a>
      </div>`).join('');
  }

  async function init() {
    try {
      const [contentRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE}/content`).then((r) => r.json()),
        fetch(`${API_BASE}/services`).then((r) => r.json())
      ]);

      if (contentRes?.success) {
        loadHero(contentRes.data.hero);
        loadAbout(contentRes.data.about);
        loadContact(contentRes.data.contact);
      }
      if (servicesRes?.success) {
        loadServices(servicesRes.data);
      }
    } catch (e) {
      console.warn('Could not load dynamic site content, showing static fallback.', e);
    }
  }

  init();
})();