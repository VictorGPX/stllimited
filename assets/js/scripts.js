// Centralized site JS: template injection, menu, forms, and page helpers
document.addEventListener('DOMContentLoaded',async()=>{
  // inject header and footer templates when placeholders exist and no static header/footer present
  async function inject(id, url){
    const node=document.getElementById(id);
    if(!node) return;
    try{const res=await fetch(url);if(res.ok){node.innerHTML=await res.text()}}catch(e){}
    if(id==='site-header') node.classList.add('site-header');
    if(id==='site-footer') node.classList.add('site-footer');
  }
  const hasStaticHeader=document.querySelector('.site-header')!==null;
  const hasStaticFooter=document.querySelector('footer')!==null && document.querySelector('footer').id!="site-footer";
  const tasks=[];
  if(!hasStaticHeader) tasks.push(inject('site-header','assets/templates/header.html'));
  if(!hasStaticFooter) tasks.push(inject('site-footer','assets/templates/footer.html'));
  await Promise.all(tasks);

  const headerNode=document.getElementById('site-header');
  const footerNode=document.getElementById('site-footer');
  headerNode?.classList.add('site-header');
  footerNode?.classList.add('site-footer');

  // ensure consolidated stylesheet is loaded on pages without manual link
  if(!document.querySelector('link[href="assets/css/styles.css"]')){
    const l=document.createElement('link');l.rel='stylesheet';l.href='assets/css/styles.css';document.head.appendChild(l);
  }

  // menu toggle
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('nav');
  toggle?.addEventListener('click',()=>{
    nav?.classList.toggle('open');
    const menu=document.querySelector('.service-menu');
    if(menu && window.innerWidth <= 900){ menu.classList.toggle('open'); }
  });

  document.querySelectorAll('.service-menu').forEach(menu => {
    const trigger = menu.querySelector('a');
    trigger?.addEventListener('click', (event) => {
      if (window.innerWidth <= 900) {
        event.preventDefault();
        menu.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('pointermove', (event) => {
      const rect = link.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const width = Math.max(24, 100 - Math.abs(50 - x) * 1.4);
      link.style.setProperty('--nav-x', `${x}%`);
      link.style.setProperty('--nav-w', `${width}%`);
    });

    link.addEventListener('pointerleave', () => {
      link.style.setProperty('--nav-x', '50%');
      link.style.setProperty('--nav-w', '0%');
    });
  });

  const serviceNames=['Facility Management','Intercontinental Logistics','Travel & Tourism','HSE Consulting','Oil & Gas Solutions','Environmental Services','Engineering & Technical Services','Construction & Infrastructure'];
  const rotator=document.getElementById('service-rotator');
  if(rotator){
    let index=0;
    setInterval(() => {
      index = (index + 1) % serviceNames.length;
      rotator.classList.remove('animate');
      void rotator.offsetWidth;
      rotator.textContent = serviceNames[index];
      rotator.classList.add('animate');
    }, 1800);
  }

  // simple form submit handler
  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      alert('Thanks for your message. Connect this form to your preferred email or form service to receive submissions.');
      form.reset();
    });
  });

  // service page mapping
  const servicePages={facility:'facility-management.html',logistics:'intercontinental-logistics.html',travel:'travel-tourism.html',hse:'hse-consulting.html','oil-gas':'oil-gas-solutions.html',environmental:'environmental-services.html',engineering:'engineering-technical-services.html',construction:'construction-infrastructure.html'};

  // update any service-list cards
  document.querySelectorAll('.service-list article').forEach(card=>{
    const link=card.querySelector('a');
    if(link && servicePages[card.id]) link.href=servicePages[card.id];
  });

  // enhance navigation: replace plain Our Services link with dropdown when needed
  if(nav){
    const existing=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim()==='Our Services');
    if(existing && !existing.closest('.service-menu')){
      const labels={facility:'Facility Management',logistics:'Intercontinental Logistics',travel:'Travel & Tourism',hse:'HSE Consulting','oil-gas':'Oil & Gas Solutions',environmental:'Environmental Services',engineering:'Engineering & Technical Services',construction:'Construction & Infrastructure'};
      const menu=document.createElement('div');menu.className='service-menu';
      const mainLink=document.createElement('a');mainLink.href='services.html';mainLink.textContent='Our Services';
      const dropdown=document.createElement('div');dropdown.className='service-dropdown';
      Object.entries(labels).forEach(([id,label])=>{const a=document.createElement('a');a.href=servicePages[id];a.textContent=label;dropdown.append(a)});
      menu.append(mainLink,dropdown);nav.replaceChild(menu,existing);
    }
  }

  // hero background mapping for pages using .page-hero
  const heroMap={'facility-management.html':'https://stllimited.com/wp-content/uploads/2024/06/Facility-management.jpg','intercontinental-logistics.html':'https://stllimited.com/wp-content/uploads/2024/06/International-Logistics.jpg','travel-tourism.html':'https://stllimited.com/wp-content/uploads/2024/06/Travel.jpg','hse-consulting.html':'https://stllimited.com/wp-content/uploads/2025/12/natural-gas-863231-e1765535141167.jpg','oil-gas-solutions.html':'assets/images/oil-gas.png','environmental-services.html':'assets/images/environmental.png','engineering-technical-services.html':'assets/images/engineering.png','construction-infrastructure.html':'assets/images/construction.png'};
  const pageName=location.pathname.split('/').pop();
  const heroImage=heroMap[pageName];
  const hero=document.querySelector('.page-hero');
  if(hero && heroImage){
    hero.style.backgroundImage=`linear-gradient(90deg,rgba(8,45,77,.88),rgba(8,45,77,.36)),url(${heroImage})`;
    hero.style.backgroundSize='cover';hero.style.backgroundPosition='center';hero.style.color='#fff';
    hero.querySelectorAll('p').forEach(p=>p.style.color='#e7f2f8');
  }
});