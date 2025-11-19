import { Component, OnInit, AfterViewInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { LoaderService } from '../../../core/loader.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class DynamicComponent implements OnInit, AfterViewInit {
  headerShow = signal(false);
  // inside DynamicComponent class (add alongside headerShow, loading etc.)
theme = signal<'light' | 'dark'>('light'); // theme signal
accentColor = signal<string>('--149ddd');  // optional stored accent (value only used when set)


  // Contact UI flags
  loading = false;
  sent = false;
  error = '';
  private sendMailUrl = 'http://localhost:3000/api/send-mail';
  // page data object (all HTML will read from here)
  pageData: any = {};
  // sanitized map url for iframe
  mapUrl!: SafeResourceUrl;
  // constructor(@Inject(PLATFORM_ID) private platformId: Object, private loader: LoaderService) { }
  // constructor(@Inject(PLATFORM_ID) private platformId: Object, private loader: LoaderService, private http: HttpClient) { }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private loader: LoaderService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    // Build the JSON data used by template
    this.pageData = {
      header: {
        sitename: 'NAVIN T V Smart Portfolio',
        profileImg: 'assets/img/portfolios/IMG_0976.JPG',
        social: [
          { name: 'twitter', href: '#', icon: 'bi bi-twitter-x' },
          { name: 'facebook', href: '#', icon: 'bi bi-facebook' },
          { name: 'instagram', href: '#', icon: 'bi bi-instagram' },
          { name: 'skype', href: '#', icon: 'bi bi-skype' },
          { name: 'linkedin', href: '#', icon: 'bi bi-linkedin' }
        ],
        nav: [
          { label: 'Home', href: '#hero', icon: 'bi bi-house' },
          { label: 'About', href: '#about', icon: 'bi bi-person' },
          { label: 'Stats', href: '#stats', icon: 'bi bi-bar-chart' },
          { label: 'Skills', href: '#skills', icon: 'bi bi-bar-chart' },
          { label: 'Resume', href: '#resume', icon: 'bi bi-file-earmark-text' },
          { label: 'Portfolio', href: '#portfolio', icon: 'bi bi-images' },
          { label: 'Services', href: '#services', icon: 'bi bi-hdd-stack' },
          { label: 'Testimonials', href: '#testimonials', icon: 'bi bi-chat-dots' },
          { label: 'Pricing', href: '#pricing', icon: 'bi bi-tags' },
          { label: 'Contact', href: '#contact', icon: 'bi bi-envelope' }
        ]
      },
      hero: {
        name: 'NAVIN T V',
        typedItems: ['Full Stack Developer', 'Frontend Engineer', 'UI Specialist'],
        contactLine: 'navintv4@gmail.com · +91 9080148956 · Chennai',
        heroBg: 'assets/img/portfolios/hero-bg.jpg'
      },
      about: {
        title: 'About',
        summary: 'Full Stack Developer with 4+ years of experience building responsive, user-friendly, and scalable web applications. Skilled in Angular (v8–v14), Java, JavaScript, Spring Boot, HTML5, CSS3, Bootstrap, and SQL. Strong in UI optimization, API integration, and performance tuning; experienced delivering enterprise banking solutions and mentoring junior developers.',
        image: 'assets/img/portfolios/IMG_0976.JPG',
        profile: {
          birthday: '1 Jun 1996',
          website: 'https://navin-my-portfolio.web.app',
          phone: '+91 9080148956',
          city: 'Chennai, Tamil Nadu',
          age: 29,
          degree: 'BE (EEE)',
          email: 'navintv4@gmail.com',
          freelance: 'Available'
        },
        roleTitle: 'Full Stack Web Developer',
        extra: 'Experienced building loan origination and enterprise banking modules (RLO, CLOS), performance-tuned UI components, and end-to-end features for web applications. Comfortable working across frontend + backend stacks, mentoring teammates, and shipping production-ready code.'
      },
      stats: [
        { icon: 'bi bi-clock-history', value: 4, label: 'Years Experience', subtitle: 'Full Stack Developer' },
        { icon: 'bi bi-journal-richtext', value: 5, label: 'Projects', subtitle: 'Selected case studies' },
        { icon: 'bi bi-building', value: 2, label: 'Companies', subtitle: 'Professional experience' },
        { icon: 'bi bi-award', value: 1, label: 'Certifications', subtitle: 'OCP — Jun 2022' }
      ],
      skills: {
        left: [
          { icon: 'assets/icons/portfolio/icons8-html-48.png', name: 'HTML5', val: 100 },
          { icon: 'assets/icons/portfolio/icons8-css-48.png', name: 'CSS3 / Bootstrap', val: 90 },
          { icon: 'assets/icons/portfolio/icons8-js-64.png', name: 'JavaScript / jQuery', val: 85 },
          { icon: 'assets/icons/portfolio/icons8-angularjs-48.png', name: 'Angular (v8 - v14)', val: 85 },
          { icon: 'assets/icons/portfolio/icons8-java-48.png', name: 'Java / Spring Boot', val: 75 },
          { icon: 'assets/icons/portfolio/icons8-postman-inc-24.png', name: 'Postman / API Testing', val: 80 }
        ],
        right: [
          { icon: 'assets/icons/portfolio/icons8-sql-48.png', name: 'SQL / PL-SQL', val: 80 },
          { icon: 'assets/icons/portfolio/icons8-sql-48.png', name: 'Oracle Database', val: 85 },
          { icon: 'assets/icons/portfolio/icons8-sql-48.png', name: 'PostgreSQL', val: 80 },
          { icon: 'assets/icons/portfolio/icons8-github-64.png', name: 'GitHub', val: 85 },
          { icon: 'assets/icons/portfolio/icons8-git-50.png', name: 'Git', val: 90 },
          { icon: 'assets/icons/portfolio/icons8-android-os-48.png', name: 'OS: Windows & macOS', val: 95 }
        ]
      },
      resume: {
        summary: {
          name: 'NAVIN T V',
          title: 'Full Stack Developer with 4+ years of experience in building responsive and scalable web applications, strong in Angular, Java, Spring Boot, and SQL.',
          location: 'Chennai, Tamil Nadu',
          phone: '+91 9080148956',
          email: 'navintv4@gmail.com'
        },
        education: [
          { degree: 'BE (Electrical & Electronics Engineering)', years: '2014 - 2018', school: 'Krishnasamy College of Engineering and Technology (Affiliated to Anna University)', gpa: '6.8' }
        ],
        experience: [
          {
            title: 'Fullstack Developer — Intellect Design Arena Ltd.',
            period: 'Oct 2022 – Aug 2025',
            bullets: [
              'Built and maintained loan origination modules (RLO, CLOS) and onboarding flows for banking clients.',
              'Designed UI components with Angular and Bootstrap; integrated REST APIs and improved cross-platform performance.',
              'Mentored junior developers, performed code reviews, and enforced best practices.',
              'Optimized UI performance to reduce load times and improve scalability.'
            ]
          },
          {
            title: 'Frontend UI Developer — Delta Itech Solutions Pvt Ltd.',
            period: 'Aug 2021 – Oct 2022',
            bullets: [
              'Created interactive components using Angular, HTML5, CSS3 and JavaScript.',
              'Integrated APIs and built billing, tracking and reporting modules.',
              'Worked on projects across construction, education, and government domains.'
            ]
          }
        ],
        projects: [
          { title: 'Corporate Loan Origination System (CLOS)', desc: 'Built onboarding, borrower details, and financial modules for Arab Bank.' },
          { title: 'Retail Loan Origination (RLO)', desc: 'Developed loan application and customer onboarding modules for Exim Bank.' },
          { title: 'QMS & Readymix', desc: 'Quarry management and civil construction apps for tracking vehicles, billing, inventory and fuel/machine management.' }
        ],
        certifications: ['Oracle Certified Professional (OCP) — Jun 2022']
      },
      portfolio: [
        { category: 'banking', title: 'Corporate Loan Origination (CLOS)', img: 'assets/img/portfolios/portfolio/app-1.jpg', desc: 'Onboarding, borrower details and financial modules.' },
        { category: 'banking', title: 'Retail Loan Origination (RLO)', img: 'assets/img/portfolios/portfolio/app-2.jpg', desc: 'Customer onboarding and loan application modules.' },
        { category: 'construction', title: 'QMS (Quarry Management)', img: 'assets/img/portfolios/portfolio/product-1.jpg', desc: 'Vehicle and load tracking, tax and billing automation.' },
        { category: 'construction', title: 'Readymix', img: 'assets/img/portfolios/portfolio/branding-1.jpg', desc: 'Inventory, billing and fuel/machine management app.' },
        { category: 'education', title: 'Student Tracking System', img: 'assets/img/portfolios/portfolio/books-1.jpg', desc: 'Monitor student records, attendance and performance.' },
        { category: 'tools', title: 'UI Components & Tools', img: 'assets/img/portfolios/portfolio/product-2.jpg', desc: 'Reusable Angular components & utilities.' }
      ],
      services: [
        { title: 'Full-Stack Development', desc: 'Angular + Java/Spring Boot implementations for scalable web applications and APIs.', icon: 'bi bi-code-slash' },
        { title: 'Performance & Optimization', desc: 'UI performance tuning, lazy-loading, bundle optimizations and faster page loads.', icon: 'bi bi-speedometer2' },
        { title: 'API Integration & Backend', desc: 'REST API integration, data validation, and end-to-end feature integration with backend teams.', icon: 'bi bi-box-seam' },
        { title: 'Mentoring & Code Reviews', desc: 'Best-practice enforcement, code reviews and mentoring junior developers.', icon: 'bi bi-people' },
        { title: 'Enterprise Banking Solutions', desc: 'Domain experience in loan origination (RLO/CLOS), compliance workflows and onboarding flows.', icon: 'bi bi-shield-check' },
        { title: 'Custom Tooling & Dashboards', desc: 'Administrative dashboards, reporting modules and operational tools for business users.', icon: 'bi bi-gear' }
      ],
      testimonials: [
        { quote: 'Delivered complex onboarding flows on time with clear communication. The UI improvements noticeably reduced user errors.', author: 'Project Stakeholder', role: 'Enterprise Banking' },
        { quote: 'Implemented reusable Angular components that sped up development across multiple teams — well-structured and documented.', author: 'Team Lead', role: 'Frontend Team' },
        { quote: 'Responsive and reliable — helped stabilize the production release and improved page load times significantly.', author: 'QA Manager', role: 'Operations' }
      ],
      pricing: [
        { tier: 'Basic', price: '$15', period: '/Hour', badge: 'Starter', features: ['Need your wireframe', 'Design with Figma, Framer', 'Product Design'] },
        { tier: 'Standard', price: '$59', period: '/Hour', badge: 'Popular', features: ['Website Design', 'Mobile Apps Design', 'Product Design', 'Digital Marketing'] },
        { tier: 'Premium', price: '$120', period: '/Hour', badge: 'Enterprise', features: ['Dedicated Support', 'Onsite/Remote Training', 'Advanced Integrations', 'Priority SLA'] }
      ],
      contact: {
        address: '203, C-29, Cosmo City, Pudupakkam, Chennai - 603103, Tamil Nadu',
        phone: '+91 9080148956',
        email: 'navintv4@gmail.com',


        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d428.0238490674251!2d80.19741539267399!3d12.807427519411343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525bbd823abd5d%3A0x1783371632d9d684!2sC26%20Cosmocity!5e0!3m2!1sen!2sin!4v1763300406811!5m2!1sen!2sin' // truncated for readability; use full original URL
      }
    };

    // sanitize the map url for iframe binding
    try {
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pageData.contact.mapUrl);
    } catch (e) {
      // fallback to a safe empty string
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    this.restoreThemeFromStorage();
  }

  ngAfterViewInit() {
    // Initialize all vendor libraries after view is rendered (browser only)
    if (isPlatformBrowser(this.platformId)) {
      this.initializeVendorLibraries();
    }
  }

  // Toggle header on click
  toggleHeader() {
    this.headerShow.update(val => !val);
  }

  // Close header when a nav link is clicked
  closeHeader(event?: Event) {
    // If called from a click event, handle same-page hash navigation manually
    if (event && isPlatformBrowser(this.platformId)) {
      const target = (event.currentTarget as HTMLAnchorElement)?.getAttribute('href') ?? '';
      // Only handle real hash links (not plain '#')
      if (target.startsWith('#') && target !== '#') {
        event.preventDefault();
        const el = document.querySelector(target) as HTMLElement | null;
        if (el) {
          const scrollMarginTop = parseInt(getComputedStyle(el).scrollMarginTop || '0') || 0;
          window.scrollTo({ top: el.offsetTop - scrollMarginTop, behavior: 'smooth' });
        } else {
          // Fallback: change the hash (will not reload if handled in-page)
          try { location.hash = target; } catch (e) { /* ignore */ }
        }
      }
    }

    if (this.headerShow()) {
      this.headerShow.set(false);
    }

    // Ensure the app loader is hidden (safe to call multiple times)
    if (isPlatformBrowser(this.platformId)) {
      try { this.loader.hide(); } catch (e) { /* ignore */ }
    }
  }

  // Initialize all vendor libraries
  private initializeVendorLibraries() {
    this.initAOS();
    this.initTyped();
    this.initPureCounter();
    this.initWaypoints();
    this.initGLightbox();
    this.initIsotope();
    this.initSwiper();
    this.initScrollTop();
    this.initNavmenuScrollspy();
  }

  private initAOS() {
    if (typeof (window as any).AOS !== 'undefined') {
      (window as any).AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  private initTyped() {
    const selectTyped = document.querySelector('.typed');
    if (selectTyped && typeof (window as any).Typed !== 'undefined') {
      const typed_strings = selectTyped.getAttribute('data-typed-items');
      if (typed_strings) {
        new (window as any).Typed('.typed', {
          strings: typed_strings.split(','),
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }
  }

  private initPureCounter() {
    if (typeof (window as any).PureCounter !== 'undefined') {
      new (window as any).PureCounter();
    }
  }

  private initWaypoints() {
    const skillsAnimation = document.querySelectorAll('.skills-animation');
    console.debug('initWaypoints: found skillsAnimation elements:', skillsAnimation.length);
    if (skillsAnimation.length === 0) return;

    // If Waypoint is available, use it. Otherwise fall back to IntersectionObserver.
    if (typeof (window as any).Waypoint !== 'undefined') {
      console.debug('initWaypoints: Waypoint available, using Waypoint.');
      skillsAnimation.forEach((item: any) => {
        new (window as any).Waypoint({
          element: item,
          offset: '80%',
          handler: function (direction: string) {
            const progress = item.querySelectorAll('.progress .progress-bar');
            progress.forEach((el: any) => {
              el.style.width = el.getAttribute('aria-valuenow') + '%';
            });
          }
        });
      });
      return;
    }

    // Fallback: use IntersectionObserver to animate progress bars when visible
    console.debug('initWaypoints: Waypoint not available, IntersectionObserver present?', 'IntersectionObserver' in window);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const item = entry.target as Element;
          const progressBars = item.querySelectorAll('.progress .progress-bar');
          progressBars.forEach((el: Element) => {
            const val = (el as HTMLElement).getAttribute('aria-valuenow') ?? '0';
            (el as HTMLElement).style.width = val + '%';
          });
          obs.unobserve(item);
        });
      }, { threshold: 0.2 });

      skillsAnimation.forEach((item: Element) => observer.observe(item));
      return;
    }

    // Last resort: animate immediately
    skillsAnimation.forEach((item: any) => {
      const progressBars = item.querySelectorAll('.progress .progress-bar');
      progressBars.forEach((el: any) => {
        el.style.width = el.getAttribute('aria-valuenow') + '%';
      });
    });
  }

  private initGLightbox() {
    if (typeof (window as any).GLightbox !== 'undefined') {
      (window as any).GLightbox({
        selector: '.glightbox'
      });
    }
  }

  private initIsotope() {
    if (typeof (window as any).Isotope !== 'undefined' && typeof (window as any).imagesLoaded !== 'undefined') {
      document.querySelectorAll('.isotope-layout').forEach((isotopeItem: any) => {
        const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
        const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
        const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

        let initIsotope: any;
        (window as any).imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
          initIsotope = new (window as any).Isotope(isotopeItem.querySelector('.isotope-container'), {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter,
            sortBy: sort
          });
        });

        isotopeItem.querySelectorAll('.isotope-filters li').forEach((filterBtn: any) => {
          filterBtn.addEventListener('click', function (this: HTMLElement) {
            isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
            this.classList.add('filter-active');
            initIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
            // Re-initialize AOS after isotope filtering
            if (typeof (window as any).AOS !== 'undefined') {
              (window as any).AOS.refresh();
            }
          });
        });
      });
    }
  }

  private initSwiper() {
    if (typeof (window as any).Swiper !== 'undefined') {
      document.querySelectorAll('.init-swiper').forEach((swiperElement: any) => {
        // Try to get config from script tag first (for backward compatibility)
        let config: any;
        const scriptTag = swiperElement.querySelector('.swiper-config');

        if (scriptTag) {
          try {
            const configText = scriptTag.innerHTML.trim();
            config = JSON.parse(configText);
          } catch (e) {
            console.warn('Failed to parse Swiper config from script tag:', e);
            config = this.getDefaultSwiperConfig();
          }
        } else {
          // Use default config if no script tag found
          config = this.getDefaultSwiperConfig();
        }

        try {
          new (window as any).Swiper(swiperElement, config);
        } catch (e) {
          console.warn('Failed to initialize Swiper:', e);
        }
      });
    }
  }

  private getDefaultSwiperConfig() {
    return {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 1
        }
      }
    };
  }

  // private initScrollTop() {
  //   const scrollTop = document.querySelector('.scroll-top');
  //   if (!scrollTop) return;

  //   // Toggle active class based on scroll position
  //   const toggleScrollTop = () => {
  //     window.scrollY > 100 
  //       ? scrollTop.classList.add('active') 
  //       : scrollTop.classList.remove('active');
  //   };

  //   // Add click listener to scroll to top
  //   scrollTop.addEventListener('click', (e: Event) => {
  //     e.preventDefault();
  //     window.scrollTo({
  //       top: 0,
  //       behavior: 'smooth'
  //     });
  //   });

  //   // Initialize on load and listen to scroll events
  //   window.addEventListener('load', toggleScrollTop);
  //   document.addEventListener('scroll', toggleScrollTop);
  // }

  private initScrollTop() {
    const scrollTop = document.querySelector('.scroll-top');
    const callBtn = document.getElementById('call-button');

    // Toggle active class based on scroll position
    const toggleScrollTop = () => {
      const active = window.scrollY > 100;
      if (scrollTop) {
        active ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
      if (callBtn) {
        active ? callBtn.classList.add('active') : callBtn.classList.remove('active');
      }
    };

    // Add click listener to scroll to top
    if (scrollTop) {
      scrollTop.addEventListener('click', (e: Event) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Note: We DO NOT intercept the call button click — the href="tel:..." will open the dialer directly.
    // Initialize on load and listen to scroll events
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop, { passive: true });

    // call once immediately
    toggleScrollTop();
  }


  private initNavmenuScrollspy() {
    const navmenulinks = document.querySelectorAll('.navmenu a');
    if (navmenulinks.length === 0) return;

    const navmenuScrollspy = () => {
      const position = window.scrollY + 300; // Offset from top
      let activeFound = false;

      navmenulinks.forEach((navmenulink: any) => {
        if (!navmenulink.hash) return;

        const section = document.querySelector(navmenulink.hash) as HTMLElement;
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;

        // Check if viewport is within section bounds
        if (position >= sectionTop && position < sectionBottom) {
          navmenulink.classList.add('active');
          activeFound = true;
        } else {
          navmenulink.classList.remove('active');
        }
      });

      // If no section found, clear all active (at top of page)
      if (!activeFound) {
        navmenulinks.forEach((link: any) => {
          link.classList.remove('active');
        });
      }
    };

    // Call immediately to check on load
    navmenuScrollspy();

    // Initialize on load and listen to scroll events with debounce
    let scrollTimeout: any;
    const scrollHandler = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        navmenuScrollspy();
      }, 50);
    };

    window.addEventListener('load', navmenuScrollspy);
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }


  submitContact(form: NgForm) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.error = '';
    this.sent = false;

    if (!form || form.invalid) {
      this.error = 'Please fill all required fields.';
      return;
    }

    const body = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    };

    this.loading = true;

    this.http.post<any>(this.sendMailUrl, body).subscribe({
      next: (res) => {
        this.loading = false;
        this.sent = true;
        form.resetForm();
      },
      error: (err) => {
        console.error('send-mail error', err);
        this.loading = false;
        this.error = err?.error?.message ?? 'Failed to send message. Try again later.';
      }
    });
  }











  private applyThemeToDocument(theme: 'light' | 'dark') {
  try {
    const root = document.documentElement;
    if (!root) return;
    root.classList.toggle('dark-theme', theme === 'dark');
    // Optionally update CSS variable for accent (if you store accentColor value)
    const accent = localStorage.getItem('site-accent-color');
    if (accent) {
      root.style.setProperty('--accent-color', accent);


      // root.style.setProperty('--background-color', theme === 'dark' ? '#121212' : '#ffffff');
    }
  } catch (e) { /* ignore in SSR or non-browser */ }
}

setTheme(theme: 'light' | 'dark') {
  this.theme.set(theme);
  // persist preference
  try { localStorage.setItem('site-theme', theme); } catch (e) {}
  this.applyThemeToDocument(theme);
}

toggleTheme() {
  const next = this.theme() === 'light' ? 'dark' : 'light';
  this.setTheme(next);
}

/**
 * Optional: change accent color dynamically
 * pass e.g. '#ff6b6b' or 'rgb(40,167,69)'
 */
setAccentColor(color: string) {
  try {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('site-accent-color', color);
  } catch (e) { /* ignore */ }
}

/** Restore theme/accent from localStorage (call from ngOnInit) */
private restoreThemeFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem('site-theme') as ('light'|'dark') | null;
    if (saved === 'dark' || saved === 'light') {
      this.theme.set(saved);
      this.applyThemeToDocument(saved);
    } else {
      // optionally use system preference as default:
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme: 'dark'|'light' = prefersDark ? 'dark' : 'light';
      this.theme.set(defaultTheme);
      this.applyThemeToDocument(defaultTheme);
    }

    const savedAccent = localStorage.getItem('site-accent-color');
    if (savedAccent) {
      document.documentElement.style.setProperty('--accent-color', savedAccent);
    }
  } catch (e) { /* ignore */ }
}

}
