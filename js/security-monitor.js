/**
 * Security Monitoring Script
 * Logs security events and sends alerts for suspicious activities
 */

class SecurityMonitor {
  constructor() {
    this.events = [];
    this.maxEvents = 100; // Keep last 100 events
    this.alertThreshold = 5; // Alert after 5 suspicious events in 5 minutes
    this.alertWindow = 5 * 60 * 1000; // 5 minutes in milliseconds

    this.init();
  }

  init() {
    // Monitor for suspicious DOM manipulation
    this.monitorDOMInjection();

    // Monitor for suspicious script loading
    this.monitorScriptInjection();

    // Monitor for suspicious form submissions
    this.monitorFormSubmissions();

    // Monitor for suspicious network requests
    this.monitorNetworkRequests();

    // Monitor for suspicious localStorage/sessionStorage access
    this.monitorStorageAccess();

    // Log security events periodically
    setInterval(() => this.checkForAlerts(), 60000); // Check every minute
  }

  logEvent(type, details, severity = 'low') {
    const event = {
      timestamp: new Date().toISOString(),
      type,
      details,
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn(`[SECURITY ${severity.toUpperCase()}] ${type}:`, details);
    }

    // Send to monitoring service in production
    this.sendToMonitoring(event);
  }

  monitorDOMInjection() {
    // Monitor for script tag injections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'SCRIPT' && !this.isLegitimateScript(node)) {
            this.logEvent('DOM_SCRIPT_INJECTION', {
              src: node.src,
              innerHTML: node.innerHTML?.substring(0, 100)
            }, 'high');
          }

          if (node.tagName === 'IFRAME' && !this.isLegitimateIframe(node)) {
            this.logEvent('DOM_IFRAME_INJECTION', {
              src: node.src
            }, 'high');
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  monitorScriptInjection() {
    // Monitor for dynamic script loading
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
      const element = originalCreateElement.call(this, tagName, options);

      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && !this.isLegitimateScriptSrc(value)) {
            window.securityMonitor.logEvent('SCRIPT_SRC_INJECTION', { src: value }, 'high');
          }
          return originalSetAttribute.call(this, name, value);
        };
      }

      return element;
    };
  }

  monitorFormSubmissions() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const formData = new FormData(form);

      // Check for suspicious patterns in form data
      for (let [key, value] of formData.entries()) {
        if (this.detectSQLInjection(value) || this.detectXSS(value)) {
          this.logEvent('SUSPICIOUS_FORM_SUBMISSION', {
            form: form.action,
            field: key,
            value: value.substring(0, 100)
          }, 'high');

          e.preventDefault(); // Block the submission
          return false;
        }
      }
    });
  }

  monitorNetworkRequests() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0] instanceof Request ? args[0].url : args[0];

      // Check for suspicious URLs
      if (window.securityMonitor.isSuspiciousUrl(url)) {
        window.securityMonitor.logEvent('SUSPICIOUS_FETCH', { url }, 'medium');
      }

      return originalFetch.apply(this, args);
    };

    // Monitor XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (window.securityMonitor.isSuspiciousUrl(url)) {
        window.securityMonitor.logEvent('SUSPICIOUS_XHR', { method, url }, 'medium');
      }
      return originalOpen.apply(this, arguments);
    };
  }

  monitorStorageAccess() {
    // Monitor localStorage access
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (window.securityMonitor.detectXSS(value)) {
        window.securityMonitor.logEvent('SUSPICIOUS_STORAGE_WRITE', { key }, 'medium');
      }
      return originalSetItem.call(this, key, value);
    };

    // Monitor sessionStorage access
    const originalSessionSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
      if (window.securityMonitor.detectXSS(value)) {
        window.securityMonitor.logEvent('SUSPICIOUS_SESSION_STORAGE_WRITE', { key }, 'medium');
      }
      return originalSessionSetItem.call(this, key, value);
    };
  }

  isLegitimateScript(node) {
    // Allow scripts from trusted domains
    const trustedDomains = [
      'thomas-tp.github.io',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'smtpjs.com',
      'cdn.botpress.cloud',
      'webchat.botpress.cloud'
    ];

    if (node.src) {
      const url = new URL(node.src);
      return trustedDomains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain));
    }

    return true; // Allow inline scripts (though CSP should restrict them)
  }

  isLegitimateIframe(node) {
    // Only allow specific iframes if needed
    return false; // Deny all iframes for security
  }

  isLegitimateScriptSrc(src) {
    if (!src) return true;

    const trustedDomains = [
      'thomas-tp.github.io',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'smtpjs.com',
      'cdn.botpress.cloud',
      'webchat.botpress.cloud'
    ];

    try {
      const url = new URL(src);
      return trustedDomains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain));
    } catch {
      return false;
    }
  }

  isSuspiciousUrl(url) {
    if (!url) return false;

    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /phpmyadmin/i,
      /wp-admin/i,
      /\.env/i,
      /admin/i,
      /config\.php/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  detectSQLInjection(payload) {
    if (!payload) return false;

    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(#)|(\%23)|(\%27)|(\%22)|(\%3B)|(\%3A)|(\%2F\*))/i,
      /(\bor\b.*\=.*\bor\b)/i,
      /(\band\b.*\=.*\band\b)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(payload));
  }

  detectXSS(payload) {
    if (!payload) return false;

    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<form[^>]*>/gi,
      /<input[^>]*>/gi,
      /<meta[^>]*>/gi,
      /<link[^>]*>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(payload));
  }

  checkForAlerts() {
    const now = Date.now();
    const recentEvents = this.events.filter(event =>
      now - new Date(event.timestamp).getTime() < this.alertWindow &&
      event.severity === 'high'
    );

    if (recentEvents.length >= this.alertThreshold) {
      this.sendAlert(recentEvents);
    }
  }

  sendAlert(events) {
    // In production, send to your monitoring service
    console.error('[SECURITY ALERT] Multiple high-severity events detected:', events);

    // You could send this to:
    // - Email service
    // - Slack webhook
    // - Security monitoring service
    // - Your own API endpoint
  }

  sendToMonitoring(event) {
    // In production, send to your monitoring endpoint
    // Example:
    // fetch('/api/security-log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(err => console.error('Failed to send security log:', err));
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

// Initialize security monitoring
if (typeof window !== 'undefined') {
  window.securityMonitor = new SecurityMonitor();
}