import { InjectionToken } from '@angular/core';

export interface InactivityConfig {
  timeoutMs: number;        // total inactivity before automatic logout (ms)
  warningMs: number;        // show warning this many ms before logout (ms)
  activityEvents?: string[];// browser events considered as activity
  countdownTickMs?: number; // how often the countdown UI updates (ms)
  redirectUrl?: string;     // where to navigate after logout
  broadcastChannelName?: string; // channel name for multi-tab sync
}

export const DEFAULT_INACTIVITY_CONFIG: InactivityConfig = {
  timeoutMs: 5 * 60 * 1000,       // 5 minutes
  warningMs: 30 * 1000,           // 30 seconds warning
  activityEvents: ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart'],
  countdownTickMs: 1000,
  redirectUrl: '/login',
  broadcastChannelName: 'app-inactivity'
};

export const INACTIVITY_CONFIG = new InjectionToken<InactivityConfig>('INACTIVITY_CONFIG');
