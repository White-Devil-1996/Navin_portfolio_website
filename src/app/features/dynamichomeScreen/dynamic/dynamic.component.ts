import { Component, OnInit, AfterViewInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoaderService } from '../../../core/loader.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css'],
  standalone: true
})
export class DynamicComponent implements OnInit, AfterViewInit {
  headerShow = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private loader: LoaderService) { }

  ngOnInit() {
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
          handler: function(direction: string) {
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
        (window as any).imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
          initIsotope = new (window as any).Isotope(isotopeItem.querySelector('.isotope-container'), {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter,
            sortBy: sort
          });
        });

        isotopeItem.querySelectorAll('.isotope-filters li').forEach((filterBtn: any) => {
          filterBtn.addEventListener('click', function(this: HTMLElement) {
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

  private initScrollTop() {
    const scrollTop = document.querySelector('.scroll-top');
    if (!scrollTop) return;

    // Toggle active class based on scroll position
    const toggleScrollTop = () => {
      window.scrollY > 100 
        ? scrollTop.classList.add('active') 
        : scrollTop.classList.remove('active');
    };

    // Add click listener to scroll to top
    scrollTop.addEventListener('click', (e: Event) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Initialize on load and listen to scroll events
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
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

}
