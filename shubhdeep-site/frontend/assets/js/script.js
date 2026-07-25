
/* ============================================================
   DATA
   ============================================================ */
const services = [
  {icon:"&lt;/&gt;", name:"Custom Software Development", desc:"Bespoke systems built around how your business actually operates, not the other way around.", feats:["Discovery & scoping","Scalable architecture","Ongoing iteration"]},
  {icon:"◧", name:"Website Development", desc:"Fast, accessible, SEO-ready websites that convert visitors into customers.", feats:["Responsive design","SEO foundations","CMS integration"]},
  {icon:"▦", name:"Web Application Development", desc:"Complex, data-driven web apps built with React and modern APIs.", feats:["Real-time features","Role-based access","Dashboard & analytics"]},
  {icon:"▤", name:"Mobile App Development", desc:"Native-feel apps for iOS and Android from a single Flutter or React Native codebase.", feats:["Cross-platform","Offline support","App store launch"]},
  {icon:"⇄", name:"ERP & CRM Solutions", desc:"Unify sales, inventory, HR and operations into one connected system.", feats:["Custom workflows","Reporting suite","Third-party sync"]},
  {icon:"🛒", name:"E-Commerce Development", desc:"High-converting storefronts with secure payments and inventory automation.", feats:["Payment gateways","Cart optimisation","Multi-currency"]},
  {icon:"⬢", name:"SaaS Product Development", desc:"From MVP to multi-tenant SaaS, built for subscription growth.", feats:["Multi-tenancy","Billing integration","Usage analytics"]},
  {icon:"✎", name:"UI/UX Design", desc:"Research-driven design systems that make complex products feel simple.", feats:["User research","Design systems","Prototyping"]},
  {icon:"⇌", name:"API Development & Integration", desc:"REST and GraphQL APIs that connect your stack cleanly and securely.", feats:["REST & GraphQL","Third-party APIs","Webhooks"]},
  {icon:"☁", name:"Cloud Solutions", desc:"Architecture and migration across AWS, Azure and Google Cloud.", feats:["Cloud migration","Auto-scaling","Cost optimisation"]},
  {icon:"✦", name:"AI & Machine Learning", desc:"Practical AI features — from recommendations to intelligent automation.", feats:["LLM integration","Predictive models","Data pipelines"]},
  // {icon:"⚙", name:"DevOps", desc:"CI/CD pipelines and containerised infrastructure for reliable releases.", feats:["Docker & Kubernetes","CI/CD pipelines","Monitoring"]},
  // {icon:"⇡", name:"Digital Transformation", desc:"Modernise legacy systems without disrupting day-to-day operations.", feats:["Legacy audits","Phased migration","Change management"]},
  {icon:"🛠", name:"Maintenance & Support", desc:"Proactive monitoring, updates and 24×7 support after launch.", feats:["24×7 monitoring","Security patches","SLA-backed support"]}
];

const industries = [
  {icon:"🏥", name:"Healthcare", img:"https://images.unsplash.com/photo-1581090468327-0c17d487a86a?auto=format&fit=crop&w=900&q=80"},
  {icon:"🎓", name:"Education", img:"https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=900&q=80"},
  {icon:"💳", name:"Finance", img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"},
  {icon:"🛍", name:"Retail", img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"},
  {icon:"🏭", name:"Manufacturing", img:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"},
  {icon:"🏢", name:"Real Estate", img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"},
  {icon:"🤝", name:"NGOs", img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"},
  {icon:"🏛", name:"Government", img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"}
];

const whyItems = [
  {t:"Expert Team", d:"Senior engineers and designers who've shipped production software across industries.", active:true},
  {t:"Modern Technologies", d:"React, Node.js, Flutter and cloud-native tooling — never legacy stacks."},
  {t:"Fast Delivery", d:"Agile sprints with visible progress every two weeks, not every quarter."},
  {t:"Affordable Pricing", d:"Transparent, milestone-based pricing with no hidden costs."},
  {t:"24×7 Support", d:"A dedicated support desk that responds around the clock."},
  {t:"Security First", d:"Secure coding practices and regular audits baked into every build."},
  {t:"Built to Scale", d:"Architecture designed to handle your next 10x of growth, not just today's load."}
];

const techData = {
  Frontend:["React","Next.js","TypeScript","Tailwind CSS","Redux","Vite"],
  Backend:["Node.js","Express","NestJS","Python","GraphQL","REST APIs"],
  Cloud:["AWS","Azure","Google Cloud","Docker","Kubernetes","Terraform"],
  Database:["MongoDB","PostgreSQL","MySQL","Redis","Firebase","DynamoDB"],
  Mobile:["Flutter","React Native","Swift","Kotlin","Expo","Firebase"],
  DevOps:["Docker","Kubernetes","Git","GitHub Actions","Jenkins","Prometheus"]
};

const projects = [
  {cat:"Web App", title:"Nimbus Retail — Inventory Platform", desc:"Real-time multi-store inventory and order sync for a growing retail chain.", stack:["React","Node.js","MongoDB"], glyph:"N", img:"https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=900&q=80"},
  {cat:"Mobile App", title:"CareBridge — Patient App", desc:"Appointment booking and telehealth companion app for clinics.", stack:["Flutter","Firebase","REST"], glyph:"C", img:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"},
  {cat:"SaaS", title:"EduSpark — Learning SaaS", desc:"Multi-tenant LMS serving 40+ schools with live classes and grading.", stack:["React","Express","AWS"], glyph:"E", img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"},
  {cat:"E-Commerce", title:"Vantage — B2B Storefront", desc:"Wholesale ordering portal with tiered pricing and bulk checkout.", stack:["Next.js","Stripe","MySQL"], glyph:"V", img:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80"},
  {cat:"ERP", title:"Meridian — Finance ERP", desc:"Unified accounting, payroll and compliance reporting suite.", stack:["React","PostgreSQL","Docker"], glyph:"M", img:"https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=900&q=80"},
  {cat:"Web App", title:"GreenField — Donor Portal", desc:"Transparent donation tracking and impact reporting for an NGO network.", stack:["React","Node.js","GraphQL"], glyph:"G", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80"}
];

const processSteps = [
  {t:"Requirement Analysis", d:"Understand goals, users and constraints."},
  {t:"Planning", d:"Roadmap, milestones and architecture."},
  {t:"UI/UX Design", d:"Wireframes to polished prototypes."},
  {t:"Development", d:"Agile sprints, code reviews."},
  {t:"Testing", d:"QA, security and performance checks."},
  {t:"Deployment", d:"Staged rollout to production."},
  {t:"Support", d:"Monitoring and continuous improvement."}
];

const testimonials = [
  {q:"Shubhdeep Technosoft rebuilt our scheduling system in under three months and our no-show rate dropped by more than half.", n:"Anita Sharma", r:"COO, CareBridge Health", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"},
  {q:"Communication was excellent throughout. They felt like an extension of our own product team, not an outside vendor.", n:"Marcus Webb", r:"Founder, Nimbus Retail", img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"},
  {q:"Our LMS now handles ten times the traffic without breaking a sweat. The migration to their architecture was seamless.", n:"Priya Nair", r:"CTO, EduSpark", img:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"}
];

const team = [
  {n:"Pragya Bhatnakar", r:"Chief Executive Officer", },
  {n:"Abhishek Tiwari", r:"Chief Technology Officer"},
  {n:"Vidhya Bisen", r:"Full-Stack Developer"},
  {n:"Prachi Patle", r:"Full-Stack Developer"}
];

// img:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"

const pricing = [
  {n:"Starter", price:"$2,999", d:"For small projects and MVPs.", feats:["Up to 6 weeks delivery","Single platform (web or mobile)","Basic UI/UX design","30 days post-launch support"]},
  {n:"Professional", price:"$9,999", d:"For growing products and businesses.", feats:["Up to 12 weeks delivery","Web + mobile development","Full design system","API integrations","90 days support & SLA"], pop:true},
  {n:"Enterprise", price:"Custom", d:"For large-scale, mission-critical systems.", feats:["Dedicated engineering pod","Cloud architecture & DevOps","AI/ML capabilities","24×7 priority support"]}
];

const faqs = [
  {q:"How long does a typical project take?", a:"Most MVPs launch within 6–12 weeks; larger enterprise platforms typically run 3–6 months, scoped in phases so you see working software early."},
  {q:"Do you sign NDAs before discussing a project?", a:"Yes. We're happy to sign an NDA before any detailed discussion so your idea and data stay protected from day one."},
  {q:"What is your pricing model?", a:"We offer fixed-price for well-defined scopes and time-and-materials for evolving products, always with milestone-based billing and no hidden costs."},
  {q:"Who owns the code once the project is delivered?", a:"You do. All source code, designs and documentation are handed over in full, with clean repository access."},
  {q:"Do you provide support after launch?", a:"Yes — every plan includes a post-launch support window, and we offer ongoing maintenance retainers after that."}
];

const blogs = [
  {cat:"Engineering", icon:"⚙", title:"Choosing between REST and GraphQL for your next API", meta:"8 min read · Jan 2026", img:"https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80"},
  {cat:"Product", icon:"◈", title:"A practical framework for scoping your MVP", meta:"6 min read · Dec 2025", img:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"},
  {cat:"Cloud", icon:"☁", title:"Cutting AWS costs without cutting performance", meta:"7 min read · Nov 2025", img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"}
];

const jobs = [
  {t:"Senior Full-Stack Developer", tags:["React","Node.js","Remote"]},
  {t:"Mobile Engineer (Flutter)", tags:["Flutter","Firebase","Hybrid"]},
  {t:"Product Designer (UI/UX)", tags:["Figma","Design Systems","Remote"]},
  {t:"DevOps Engineer", tags:["Kubernetes","AWS","Hybrid"]}
];

/* ============================================================
   RENDER
   ============================================================ */
const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;
const arrowSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

document.getElementById('servicesGrid').innerHTML = services.map(s=>`
  <div class="svc-card reveal">
    <div class="svc-icon">${s.icon}</div>
    <h3>${s.name}</h3>
    <p>${s.desc}</p>
    <div class="svc-feat">${s.feats.map(f=>`<span>${f}</span>`).join('')}</div>
    <a href="#contact" class="svc-link">Learn More ${arrowSvg}</a>
  </div>`).join('');

document.getElementById('industriesGrid').innerHTML = industries.map(i=>`
  <div class="ind-card reveal">
    <div class="industry-bg"><img src="${i.img}" alt="${i.name}" /></div>
    <span><span class="ind-icon">${i.icon}</span>${i.name}</span>
  </div>`).join('');

document.getElementById('timelineList').innerHTML = whyItems.map(w=>`
  <div class="tl-item ${w.active?'active':''}"><h4>${w.t}</h4><p>${w.d}</p></div>`).join('');

const techKeys = Object.keys(techData);
document.getElementById('techTabs').innerHTML = techKeys.map((k,i)=>`<button class="tech-tab ${i===0?'active':''}" data-tab="${k}">${k}</button>`).join('');
document.getElementById('techPanels').innerHTML = techKeys.map((k,i)=>`
  <div class="tech-panel ${i===0?'active':''}" data-panel="${k}">
    ${techData[k].map(t=>`<div class="tech-chip"><div class="glyph">${t.slice(0,2)}</div><span>${t}</span></div>`).join('')}
  </div>`).join('');
document.querySelectorAll('.tech-tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tech-tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tech-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tech-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
  });
});

function renderPortfolio(filter){
  const list = filter==='All' ? projects : projects.filter(p=>p.cat===filter);
  document.getElementById('portGrid').innerHTML = list.map(p=>`
    <div class="port-card reveal in">
      <div class="port-thumb">
        <img src="${p.img}" alt="${p.title}" />
        <span class="tag">${p.cat}</span>
        <span class="glyph-big">${p.glyph}</span>
      </div>
      <div class="port-body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="port-stack">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div>
        <a href="#contact" class="svc-link">View Details ${arrowSvg}</a>
      </div>
    </div>`).join('');
}
const cats = ['All', ...new Set(projects.map(p=>p.cat))];
document.getElementById('filterBar').innerHTML = cats.map((c,i)=>`<button class="filter-btn ${i===0?'active':''}" data-filter="${c}">${c}</button>`).join('');
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderPortfolio(btn.dataset.filter);
  });
});
renderPortfolio('All');

document.getElementById('processTrack').innerHTML = processSteps.map((s,i)=>`
  <div class="proc-step reveal"><div class="proc-num">0${i+1}</div><h5>${s.t}</h5><p>${s.d}</p></div>`).join('');

document.getElementById('testGrid').innerHTML = testimonials.map(t=>`
  <div class="test-card reveal">
    <div class="stars">★★★★★</div>
    <p class="quote">"${t.q}"</p>
    <div class="test-person"><div class="avatar"><img src="${t.img}" alt="${t.n}" /></div><div><b>${t.n}</b><span>${t.r}</span></div></div>
  </div>`).join('');

document.getElementById('teamGrid').innerHTML = team.map(t=>`
  <div class="team-card reveal">
    <div class="team-photo"><img src="${t.img}" alt="${t.n}" /></div>
    <h4>${t.n}</h4><span class="role">${t.r}</span>
  </div>`).join('');

document.getElementById('priceGrid').innerHTML = pricing.map(p=>`
  <div class="price-card ${p.pop?'pop':''} reveal">
    ${p.pop?'<div class="badge">Most Popular</div>':''}
    <h4>${p.n}</h4>
    <p class="desc">${p.d}</p>
    <div class="price">${p.price}${p.price!=='Custom'?'<span>/project</span>':''}</div>
    <ul class="price-list">${p.feats.map(f=>`<li>${checkSvg}${f}</li>`).join('')}</ul>
    <a href="#contact" class="btn ${p.pop?'btn-light':'btn-ghost'}" style="width:100%;">Choose ${p.n}</a>
  </div>`).join('');

document.getElementById('faqList').innerHTML = faqs.map((f,i)=>`
  <div class="faq-item ${i===0?'open':''}">
    <button class="faq-q">${f.q}<span class="faq-plus"></span></button>
    <div class="faq-a"><p>${f.a}</p></div>
  </div>`).join('');
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if(item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
  q.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight=null;});
    if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

document.getElementById('blogGrid').innerHTML = blogs.map(b=>`
  <div class="blog-card reveal">
    <div class="blog-thumb"><img src="${b.img}" alt="${b.title}" /><span class="bicon">${b.icon}</span></div>
    <div class="blog-body">
      <span class="blog-cat">${b.cat}</span>
      <h4>${b.title}</h4>
      <div class="blog-meta">${b.meta}</div>
    </div>
  </div>`).join('');

document.getElementById('careerList').innerHTML = jobs.map(j=>`
  <div class="job-row reveal">
    <div class="job-info"><h4>${j.t}</h4><div class="job-tags">${j.tags.map(t=>`<span>${t}</span>`).join('')}</div></div>
    <a href="#contact" class="btn btn-ghost btn-sm">Apply Now</a>
  </div>`).join('');

/* ============================================================
   INTERACTIONS
   ============================================================ */
// Preloader
window.addEventListener('load', ()=>{
  setTimeout(()=>document.getElementById('preloader').classList.add('hide'), 500);
});

// Scroll progress + header state + back to top + reveal
const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backToTop');
function onScroll(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  progress.style.width = (scrolled/max*100) + '%';
  header.classList.toggle('scrolled', scrolled > 20);
  backTop.classList.toggle('show', scrolled > 500);
}
document.addEventListener('scroll', onScroll);
onScroll();
backTop.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Counters
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target/60));
      const t = setInterval(()=>{
        cur += step;
        if(cur>=target){cur=target; clearInterval(t);}
        el.textContent = cur + (target>=100?'+':'');
      },25);
      counterObserver.unobserve(el);
    }
  });
},{threshold:.5});
counters.forEach(c=>counterObserver.observe(c));

// Dark mode
const themeToggle = document.getElementById('themeToggle');
function setTheme(dark){
  document.documentElement.classList.toggle('dark', dark);
  themeToggle.textContent = dark ? '☀' : '☾';
}
setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
themeToggle.addEventListener('click', ()=> setTheme(!document.documentElement.classList.contains('dark')) );

// Mobile drawer
const drawer = document.getElementById('mobileDrawer');
const backdrop = document.getElementById('drawerBackdrop');
function openDrawer(){ drawer.classList.add('open'); backdrop.classList.add('show'); }
function closeDrawer(){ drawer.classList.remove('open'); backdrop.classList.remove('show'); }
document.getElementById('hamburgerBtn').addEventListener('click', openDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
backdrop.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeDrawer));

// Search modal
const searchModal = document.getElementById('searchModal');
document.getElementById('searchBtn').addEventListener('click', ()=>{
  searchModal.classList.add('open');
  document.getElementById('searchInput').focus();
});
searchModal.addEventListener('click', (e)=>{ if(e.target===searchModal) searchModal.classList.remove('open'); });
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape') searchModal.classList.remove('open');
  if((e.metaKey||e.ctrlKey) && e.key==='k'){ e.preventDefault(); searchModal.classList.add('open'); document.getElementById('searchInput').focus(); }
});

// Cookie consent
const cookieBar = document.getElementById('cookieBar');
if(!localStorage_safe('cookieConsent')){
  setTimeout(()=>cookieBar.classList.add('show'), 1200);
}
function localStorage_safe(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
document.getElementById('cookieAccept').addEventListener('click', ()=>{
  try{ localStorage.setItem('cookieConsent','accepted'); }catch(e){}
  cookieBar.classList.remove('show');
});
document.getElementById('cookieDecline').addEventListener('click', ()=>{
  try{ localStorage.setItem('cookieConsent','declined'); }catch(e){}
  cookieBar.classList.remove('show');
});

// Chatbot
const chatPanel = document.getElementById('chatPanel');
const chatToggle = document.getElementById('chatToggle');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
chatToggle.addEventListener('click', ()=> chatPanel.classList.toggle('open'));
function addMsg(text, who){
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.textContent = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function botReply(q){
  q = q.toLowerCase();
  if(q.includes('price')||q.includes('cost')) return "Our projects typically start around $2,999 for a Starter build. Use the Project Cost Estimator on the page for a tailored range, or tell me more about your project.";
  if(q.includes('service')) return "We offer custom software, web & mobile development, ERP/CRM, e-commerce, SaaS, UI/UX, cloud, AI/ML and DevOps. Which one are you interested in?";
  if(q.includes('time')||q.includes('long')) return "Most MVPs launch in 6–12 weeks; larger platforms run 3–6 months, delivered in visible sprints.";
  if(q.includes('contact')||q.includes('call')||q.includes('talk')) return "You can reach us at hello@shubhdeeptechnosoft.com or fill out the contact form below — we reply within one business day.";
  return "Thanks for the message! For a detailed answer, our team would love to chat — fill out the contact form and we'll follow up shortly.";
}
function sendChat(){
  const val = chatInput.value.trim();
  if(!val) return;
  addMsg(val, 'user');
  chatInput.value = '';
  setTimeout(()=>addMsg(botReply(val), 'bot'), 500);
}
document.getElementById('chatSend').addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendChat(); });

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#10B981';
  e.target.reset();
  setTimeout(()=>{ btn.textContent = original; btn.style.background = ''; }, 2600);
});

// Newsletter
document.getElementById('nlForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Subscribed ✓';
  e.target.reset();
  setTimeout(()=>btn.textContent='Join', 2200);
});

// Project cost estimator
const estTypeData = ['Website','Web App','Mobile App','ERP / SaaS'];
const estCompData = ['Simple','Moderate','Complex','Enterprise'];
const estRanges = {
  Website:[[1500,3500],[3500,7000],[7000,14000],[14000,30000]],
  'Web App':[[4000,8000],[8000,16000],[16000,32000],[32000,65000]],
  'Mobile App':[[5000,10000],[10000,20000],[20000,40000],[40000,80000]],
  'ERP / SaaS':[[8000,15000],[15000,30000],[30000,60000],[60000,120000]]
};
let estType = 'Web App', estComp = 'Moderate';
document.getElementById('estType').innerHTML = estTypeData.map(t=>`<div class="est-opt ${t===estType?'active':''}" data-t="${t}">${t}</div>`).join('');
document.getElementById('estComplexity').innerHTML = estCompData.map(c=>`<div class="est-opt ${c===estComp?'active':''}" data-c="${c}">${c}</div>`).join('');
function updateEstimate(){
  const idx = estCompData.indexOf(estComp);
  const [lo,hi] = estRanges[estType][idx];
  document.getElementById('estOutput').textContent = `$${lo.toLocaleString()} – $${hi.toLocaleString()}`;
}
document.querySelectorAll('#estType .est-opt').forEach(el=>el.addEventListener('click', ()=>{
  document.querySelectorAll('#estType .est-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active'); estType = el.dataset.t; updateEstimate();
}));
document.querySelectorAll('#estComplexity .est-opt').forEach(el=>el.addEventListener('click', ()=>{
  document.querySelectorAll('#estComplexity .est-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active'); estComp = el.dataset.c; updateEstimate();
}));
updateEstimate();

// Smooth-scroll active state re-observe for dynamically injected reveal elements
setTimeout(()=>{ document.querySelectorAll('.reveal:not(.in)').forEach(el=>revealObserver.observe(el)); }, 300);
