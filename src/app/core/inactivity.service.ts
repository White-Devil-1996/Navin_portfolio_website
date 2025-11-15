import { Injectable, inject, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // adjust path to your auth service
import { InactivityConfig, INACTIVITY_CONFIG, DEFAULT_INACTIVITY_CONFIG } from './inactivity-config';
import { fromEvent, merge, Subscription, timer, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InactivityService implements OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthService);
  private config = inject(INACTIVITY_CONFIG, { optional: true }) as InactivityConfig || DEFAULT_INACTIVITY_CONFIG;
  private platformId = inject(PLATFORM_ID);

  private activitySub?: Subscription;
  private timeoutSub?: Subscription;
  private warningSub?: Subscription;
  private bc: BroadcastChannel | null = null;

  private modalEl: HTMLElement | null = null;
  private toastEl: HTMLElement | null = null;
  private countdown$ = new BehaviorSubject<number>(0);

  private lastActivity = Date.now();

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    // Only setup browser APIs if we're in the browser
    if (!this.isBrowser()) {
      return;
    }
    // setup BroadcastChannel or fallback
    try {
      if ('BroadcastChannel' in window) this.bc = new BroadcastChannel(this.config.broadcastChannelName || DEFAULT_INACTIVITY_CONFIG.broadcastChannelName!);
    } catch {
      this.bc = null;
    }
    if (this.bc) {
      this.bc.onmessage = (m) => this.onBroadcastMessage(m.data);
    } else {
      window.addEventListener('storage', this.onStorageEvent);
    }
  }

  // start watching for user activity
  startWatching() {
    this.stopWatching(); // clean start

    // create merged stream of events
    const streams = (this.config.activityEvents || DEFAULT_INACTIVITY_CONFIG.activityEvents!)
      .map(evt => fromEvent(document, evt));
    const merged = merge(...streams);

    this.activitySub = merged.subscribe(() => this.onActivity());

    // start timers
    this.resetTimers();
  }

  stopWatching() {
    this.activitySub?.unsubscribe();
    this.timeoutSub?.unsubscribe();
    this.warningSub?.unsubscribe();
    this.hideModal();
  }

  // call this on each activity event
  private onActivity() {
    this.lastActivity = Date.now();
    // if modal visible, hide it and treat as staying signed in
    if (this.modalEl) {
      this.hideModal();
      this.broadcast('reset-timer');
    }
    this.resetTimers();
  }

  private resetTimers() {
    this.timeoutSub?.unsubscribe();
    this.warningSub?.unsubscribe();

    const total = this.config.timeoutMs ?? DEFAULT_INACTIVITY_CONFIG.timeoutMs;
    const warn = this.config.warningMs ?? DEFAULT_INACTIVITY_CONFIG.warningMs;

    const timeUntilWarning = Math.max(0, total - warn);

    // warning timer
    this.warningSub = timer(timeUntilWarning).subscribe(() => this.onWarning());

    // final timeout timer
    this.timeoutSub = timer(total).subscribe(() => this.onTimeout());
  }

  // invoked when warning period begins
  private onWarning() {
    const warnDuration = this.config.warningMs ?? DEFAULT_INACTIVITY_CONFIG.warningMs;
    this.showModalWithCountdown(Math.ceil(warnDuration / 1000));
    this.broadcast('warning-shown');
  }

  // final timeout reached - perform logout
  private async onTimeout() {
    this.broadcast('logout');
    await this.performLogoutAndCleanup(true);
  }

  // show a simple modal with countdown and Stay Signed In button
  private showModalWithCountdown(initialSeconds: number) {
    this.hideModal(); // ensure single modal

    const container = document.createElement('div');
    container.className = 'inactivity-modal-overlay';
    container.innerHTML = `
      <div class="inactivity-modal">
        <h3>You're about to be signed out</h3>
        <p>You will be signed out due to inactivity in <span id="inactivity-countdown">${initialSeconds}</span> seconds.</p>
        <div class="inactivity-actions">
          <button id="inactivity-stay-btn" class="inactivity-btn primary">Stay signed in</button>
          <button id="inactivity-logout-btn" class="inactivity-btn secondary">Sign out now</button>
        </div>
      </div>
    `;
    // styling
    const style = document.createElement('style');
    style.textContent = this.modalCss();
    container.appendChild(style);

    document.body.appendChild(container);
    this.modalEl = container;

    const countdownSpan = container.querySelector('#inactivity-countdown') as HTMLElement;
    const stayBtn = container.querySelector('#inactivity-stay-btn') as HTMLButtonElement;
    const logoutBtn = container.querySelector('#inactivity-logout-btn') as HTMLButtonElement;

    let secondsLeft = initialSeconds;
    countdownSpan.textContent = String(secondsLeft);
    this.countdown$.next(secondsLeft);

    // tick
    const tickMs = this.config.countdownTickMs ?? DEFAULT_INACTIVITY_CONFIG.countdownTickMs!;
    this.timeoutSub?.unsubscribe(); // ensure final logout timer already set, but we still update UI
    const tickSub = timer(0, tickMs).subscribe(() => {
      secondsLeft--;
      if (secondsLeft < 0) {
        tickSub.unsubscribe();
        // do nothing here — onTimeout will fire via the main timer; ensure we hide modal
        this.hideModal();
        return;
      }
      if (countdownSpan) countdownSpan.textContent = String(secondsLeft);
      this.countdown$.next(secondsLeft);
    });

    stayBtn.addEventListener('click', () => {
      tickSub.unsubscribe();
      this.hideModal();
      this.broadcast('reset-timer');
      this.resetTimers();
    });

    logoutBtn.addEventListener('click', async () => {
      tickSub.unsubscribe();
      this.hideModal();
      this.broadcast('logout');
      await this.performLogoutAndCleanup(true);
    });
  }

  private hideModal() {
    if (!this.modalEl) return;
    try { this.modalEl.remove(); } catch {}
    this.modalEl = null;
  }

  // modal CSS (scoped)
  private modalCss() {
    return `
    .inactivity-modal-overlay{
      position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.45);z-index:99998;
      font-family: system-ui, Arial, sans-serif;
    }
    .inactivity-modal{
      background:#fff;padding:20px;border-radius:8px;max-width:420px;width:90%;box-shadow:0 12px 40px rgba(0,0,0,0.25);
      text-align:center;
    }
    .inactivity-modal h3{margin:0 0 8px;font-size:1.1rem}
    .inactivity-modal p{margin:0 0 16px;color:#333}
    .inactivity-actions{display:flex;gap:10px;justify-content:center}
    .inactivity-btn{padding:8px 14px;border-radius:6px;border:0;cursor:pointer;font-weight:600}
    .inactivity-btn.primary{background:#1976d2;color:#fff}
    .inactivity-btn.secondary{background:transparent;border:1px solid #ccc;color:#333}
    `;
  }

  // perform logout cleanup: clear storages, caches, optional IndexedDB, navigate, show toast
  private async performLogoutAndCleanup(redirect = true) {
    try {
      // call auth logout (server-side token revoke if implemented)
      try { this.auth.logout(); } catch (e) {}

      // clear session/local storage
      try { sessionStorage.clear(); } catch {}
      try { localStorage.clear(); } catch {}

      // clear caches
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        } catch {}
      }

      // best-effort IndexedDB wipe (modern browsers)
      try {
        // @ts-ignore
        if (indexedDB && indexedDB.databases) {
          // @ts-ignore
          const dbs = await indexedDB.databases();
          if (Array.isArray(dbs)) {
            await Promise.all(dbs.map(db => new Promise((res) => {
              try {
                const req = indexedDB.deleteDatabase(db.name || '');
                req.onsuccess = () => res(true);
                req.onerror = () => res(true);
                req.onblocked = () => res(true);
              } catch { res(true); }
            })));
          }
        }
      } catch {}

      // stop watchers
      this.stopWatching();

      // navigate to login (if requested)
      if (redirect) {
        try { await this.router.navigate([this.config.redirectUrl || DEFAULT_INACTIVITY_CONFIG.redirectUrl!], { queryParams: { sessionExpired: true } }); } catch {}
      }

      // show toast
      this.showToast('You were signed out due to inactivity', 4000);

    } catch (err) {
      console.error('Error during logout cleanup', err);
    }
  }

  // lightweight toast
  private showToast(message: string, ms = 3000) {
    this.hideToast();
    const container = document.createElement('div');
    container.className = 'inactivity-toast';
    container.innerHTML = `<div class="toast-message">${message}</div>`;
    const style = document.createElement('style');
    style.textContent = `
      .inactivity-toast{position:fixed;bottom:24px;right:24px;background:rgba(0,0,0,0.85);color:#fff;padding:10px 14px;border-radius:8px;z-index:99999;box-shadow:0 10px 30px rgba(0,0,0,0.3);font-family:system-ui,Arial,sans-serif}
      .inactivity-toast .toast-message{font-size:0.95rem}
      @media (max-width:600px){ .inactivity-toast{right:12px;left:12px;bottom:20px} }
    `;
    container.appendChild(style);
    document.body.appendChild(container);
    this.toastEl = container;
    setTimeout(() => this.hideToast(), ms);
  }

  private hideToast() {
    if (!this.toastEl) return;
    try { this.toastEl.remove(); } catch {}
    this.toastEl = null;
  }

  // broadcast messages to other tabs
  private broadcast(action: 'logout' | 'reset-timer' | 'warning-shown') {
    if (this.bc) {
      try { this.bc.postMessage(action); } catch {}
    } else {
      try {
        localStorage.setItem('app_inactivity_action', action);
        setTimeout(() => localStorage.removeItem('app_inactivity_action'), 200);
      } catch {}
    }
  }

  private onBroadcastMessage(data: any) {
    if (!data) return;
    if (data === 'logout') {
      // another tab triggered logout
      this.performLogoutAndCleanup(false);
    } else if (data === 'reset-timer') {
      this.resetTimers();
    } else if (data === 'warning-shown') {
      // optionally show same modal? we'll keep UX simple: only reset timers
      // this.resetTimers();
    }
  }

  private onStorageEvent = (ev: StorageEvent) => {
    if (!ev.key) return;
    if (ev.key === 'app_inactivity_action' && ev.newValue) {
      this.onBroadcastMessage(ev.newValue);
    }
  }

  ngOnDestroy(): void {
    this.stopWatching();
    if (this.isBrowser()) {
      if (this.bc) try { this.bc.close(); } catch {}
      else window.removeEventListener('storage', this.onStorageEvent);
    }
  }
}
