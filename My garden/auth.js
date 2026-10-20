/**
 * HarborAuth — Authentication, Role-Based Access Control, Theme Engine & Navbar Session Manager
 * Enforces Author vs User access rules, dynamic navbar state, dark/light theme switching, and notifications.
 */
(function(window) {
  'use strict';

  // Immediate theme application to prevent Flash of Unstyled Theme (FOUC)
  const initialTheme = localStorage.getItem('harbor_theme_mode') || 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);

  const HarborAuth = {
    // ==========================================
    // Dark / Light Theme Controller
    // ==========================================
    getTheme() {
      return localStorage.getItem('harbor_theme_mode') || 'light';
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('harbor_theme_mode', theme);
      this.updateThemeButtons(theme);
    },

    toggleTheme() {
      const nextTheme = this.getTheme() === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme);
      this.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Espresso' : 'Light Cream'} luxury mode`, 'info', 'Theme Updated');
    },

    updateThemeButtons(theme) {
      const isDark = theme === 'dark';
      document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
        btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        btn.title = `Switch to ${isDark ? 'Light Cream' : 'Dark Espresso'} mode`;
        btn.innerHTML = `
          <span class="theme-toggle-icon">${isDark ? '☀️' : '🌙'}</span>
          <span class="theme-toggle-text">${isDark ? 'Light' : 'Dark'}</span>
        `;
      });
    },

    initTheme() {
      const currentTheme = this.getTheme();
      document.documentElement.setAttribute('data-theme', currentTheme);

      // Inject theme toggle button into header navigation actions if present
      const navActions = document.querySelector('.harbor-nav-actions');
      if (navActions && !document.getElementById('harborThemeToggleBtn')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.id = 'harborThemeToggleBtn';
        toggleBtn.className = 'btn-theme-toggle';
        toggleBtn.addEventListener('click', () => this.toggleTheme());
        navActions.insertBefore(toggleBtn, navActions.firstChild);
      }

      // Standalone pages (login, forgot-password) get a floating luxury theme toggle
      if (!navActions && !document.getElementById('harborFloatingThemeBtn')) {
        const floatingBtn = document.createElement('button');
        floatingBtn.type = 'button';
        floatingBtn.id = 'harborFloatingThemeBtn';
        floatingBtn.className = 'btn-theme-toggle harbor-floating-theme-toggle';
        floatingBtn.style.position = 'fixed';
        floatingBtn.style.top = '18px';
        floatingBtn.style.right = '20px';
        floatingBtn.style.zIndex = '9999';
        floatingBtn.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(floatingBtn);
      }

      this.updateThemeButtons(currentTheme);
    },

    // Show a floating luxury toast alert
    showToast(message, type = 'success', title = '') {
      let container = document.getElementById('harborToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'harborToastContainer';
        container.className = 'harbor-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `harbor-toast ${type}`;

      const iconMap = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
      };

      const defaultTitle = {
        success: 'Confirmed',
        error: 'Access Notice',
        info: 'Harbor Notice',
        warning: 'Permission Notice'
      };

      toast.innerHTML = `
        <span class="harbor-toast-icon">${iconMap[type] || '•'}</span>
        <div class="harbor-toast-content">
          <div class="harbor-toast-title">${title || defaultTitle[type] || 'Notice'}</div>
          <div class="harbor-toast-msg">${message}</div>
        </div>
        <button class="harbor-toast-close" aria-label="Close">&times;</button>
      `;

      toast.querySelector('.harbor-toast-close').addEventListener('click', () => {
        toast.remove();
      });

      container.appendChild(toast);

      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(40px)';
          toast.style.transition = 'all 0.35s ease';
          setTimeout(() => toast.remove(), 350);
        }
      }, 4500);
    },

    calculatePasswordStrength(password) {
      if (!password) return { score: 0, label: 'Empty', color: '#8c7362' };
      let score = 0;
      if (password.length >= 8) score += 30;
      if (password.length >= 12) score += 15;
      if (/[A-Z]/.test(password)) score += 15;
      if (/[0-9]/.test(password)) score += 20;
      if (/[^A-Za-z0-9]/.test(password)) score += 20;

      if (score < 40) return { score, label: 'Weak', color: '#f43f5e' };
      if (score < 70) return { score, label: 'Moderate', color: '#F4AE52' };
      if (score < 90) return { score, label: 'Strong', color: '#10b981' };
      return { score, label: 'Royal Grade', color: '#D4621A' };
    },

    // Quick Login as Sole Author (Moazzam Qureshi) — Full Access
    quickAuthorLogin() {
      if (!window.HarborDB) return;
      try {
        const session = window.HarborDB.loginUser('moazzam@mygarden.com', 'Garden@2026', true);
        this.showToast('Logged in as Author Moazzam Qureshi with full administrative clearance.', 'success', '👑 Author Access Granted');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      } catch (err) {
        this.showToast(err.message, 'error', 'Sign In Failed');
      }
    },

    // Quick Login as Regular User (Elena Vance) — Restricted Database & Audit
    quickUserLogin() {
      if (!window.HarborDB) return;
      try {
        const session = window.HarborDB.loginUser('user@mygarden.com', 'User@2026', true);
        this.showToast('Logged in as Member Elena Vance (Database & Audit logs restricted).', 'info', '👤 User Access');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      } catch (err) {
        this.showToast(err.message, 'error', 'Sign In Failed');
      }
    },

    // Legacy quick demo alias
    quickDemoLogin() {
      this.quickAuthorLogin();
    },

    logout() {
      if (window.HarborDB) {
        window.HarborDB.logout();
      }
      this.showToast('You have safely signed out of your Harbor session.', 'info', 'Signed Out');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 400);
    },

    // Render navigation bar with strict RBAC rules and sculpted button designs
    renderNavbar() {
      const authContainer = document.getElementById('harborNavAuth');
      const navLinksContainer = document.getElementById('harborNavLinks');
      const navDbBtn = document.querySelector('.btn-nav-database');

      if (!window.HarborDB) return;
      const user = window.HarborDB.getCurrentUser();
      const isAuthor = window.HarborDB.isAuthor();

      // Show/hide and shape the header Database button
      if (navDbBtn) {
        if (isAuthor) {
          navDbBtn.style.display = 'inline-flex';
          navDbBtn.innerHTML = `<span class="btn-db-icon">📊</span> Database`;
          navDbBtn.title = 'Access Author Master Database Center';
        } else {
          // Regular users or guests cannot see the Database quick action button
          navDbBtn.style.display = 'none';
        }
      }

      // Check navigation links and give Service Portal and Database links perfect sculpted shapes
      if (navLinksContainer) {
        // Portal button shape
        const portalLink = navLinksContainer.querySelector('a[href="portal.html"]');
        if (portalLink) {
          portalLink.classList.add('nav-portal-btn');
          if (!portalLink.querySelector('.portal-icon-span')) {
            portalLink.innerHTML = `<span class="portal-icon-span">🛡️</span> Security Portal`;
          }
        }

        // Database nav link (Author only)
        const dbNavLink = navLinksContainer.querySelector('a[href="database.html"]');
        if (dbNavLink && dbNavLink.parentElement) {
          if (!isAuthor) {
            dbNavLink.parentElement.style.display = 'none';
          } else {
            dbNavLink.parentElement.style.display = 'list-item';
            if (!dbNavLink.querySelector('.db-nav-icon-span')) {
              dbNavLink.innerHTML = `<span class="db-nav-icon-span">📊</span> Database`;
            }
          }
        }
      }

      if (!authContainer) return;

      if (user) {
        const isAuthorUser = user.role === 'Author';
        const rolePill = isAuthorUser
          ? `<span class="role-badge-author">👑 Author</span>`
          : `<span class="role-badge-user">👤 Member</span>`;

        authContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; position: relative;">
            ${rolePill}
            <button class="harbor-user-badge" id="harborUserMenuBtn" aria-label="User Account">
              <span class="harbor-status-dot"></span>
              <span class="harbor-avatar">${user.avatarInitials || 'U'}</span>
              <span>${user.name.split(' ')[0]}</span>
              <span style="font-size: 0.68rem; color: var(--harbor-gold);">▼</span>
            </button>
            
            <div class="harbor-user-dropdown" id="harborUserDropdown">
              <div class="harbor-dropdown-header">
                <div class="harbor-dropdown-name">${user.name}</div>
                <div class="harbor-dropdown-email">${user.email} &bull; <strong>${user.role}</strong></div>
              </div>

              <a href="portal.html" class="harbor-dropdown-item">
                <span>🛡️</span> Security Command Center
              </a>

              ${isAuthorUser ? `
                <a href="database.html" class="harbor-dropdown-item">
                  <span>📊</span> Master Database Center
                </a>
                <a href="index.html#plantListingSection" class="harbor-dropdown-item" id="navAddPlantTrigger">
                  <span>🌿</span> Add Plant to Catalog
                </a>
              ` : `
                <div style="padding: 8px 14px; font-size: 0.72rem; color: var(--harbor-text-dim); border-top: 1px dashed var(--harbor-border);">
                  🔒 Database &amp; Audit Logs restricted to Author
                </div>
              `}

              <a href="contact.html" class="harbor-dropdown-item">
                <span>✉️</span> Submit Inquiry
              </a>

              <button class="harbor-dropdown-item logout" id="harborLogoutBtn">
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        `;

        const btn = document.getElementById('harborUserMenuBtn');
        const dropdown = document.getElementById('harborUserDropdown');
        const logoutBtn = document.getElementById('harborLogoutBtn');

        if (btn && dropdown) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
          });

          document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== btn) {
              dropdown.classList.remove('show');
            }
          });
        }

        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => this.logout());
        }
      } else {
        // Not logged in
        authContainer.innerHTML = `
          <a href="login.html" class="btn-harbor-login">
            <span>🛡️</span> Sign In
          </a>
        `;
      }
    },

    // Enforce page-level RBAC guard for database.html
    enforceDatabaseAccess() {
      if (!window.location.pathname.endsWith('database.html')) return;
      if (!window.HarborDB) return;

      const user = window.HarborDB.getCurrentUser();
      const isAuthor = window.HarborDB.isAuthor();

      if (!isAuthor) {
        const authorizedView = document.getElementById('dbAuthorizedView');
        const lockedView = document.getElementById('dbLockedView');
        if (authorizedView && lockedView) {
          authorizedView.style.display = 'none';
          lockedView.style.display = 'block';
        }
      }
    },

    // Enforce Audit Tab restriction on portal.html
    enforcePortalAuditRules() {
      if (!window.location.pathname.endsWith('portal.html')) return;
      if (!window.HarborDB) return;

      const isAuthor = window.HarborDB.isAuthor();
      const auditTabBtn = document.getElementById('tabAudit');
      const auditPanel = document.getElementById('panelAudit');

      if (!isAuthor && auditTabBtn && auditPanel) {
        // Change Audit Tab styling to indicate locked state
        auditTabBtn.innerHTML = `<span>🔒</span> Audit Trail (Author Only)`;
        auditTabBtn.style.opacity = '0.6';
        auditTabBtn.title = 'Audit trail is strictly reserved for Author accounts';

        auditPanel.innerHTML = `
          <div class="harbor-card" style="text-align: center; padding: 48px 24px;">
            <div style="font-size: 2.2rem; color: var(--harbor-danger); margin-bottom: 14px;">🔒</div>
            <h3 style="font-size: 1.35rem; color: var(--harbor-text-main); margin-bottom: 10px;">Audit Trail Logs Restricted</h3>
            <p style="color: var(--harbor-text-muted); max-width: 520px; margin: 0 auto 20px; font-size: 0.9rem;">
              Security audit trail logs, IP access origins, and credential modification logs are only viewable by verified <strong>Author</strong> accounts.
            </p>
            <a href="login.html" class="btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
              <span>👑</span> Sign In with Author Account
            </a>
          </div>
        `;
      }
    },

    setupMobileMenu() {
      const toggle = document.getElementById('harborMenuToggle');
      const links = document.getElementById('harborNavLinks');
      if (toggle && links) {
        toggle.addEventListener('click', () => {
          links.classList.toggle('show');
        });
      }
    },

    init() {
      this.initTheme();
      this.renderNavbar();
      this.setupMobileMenu();
      this.enforceDatabaseAccess();
      this.enforcePortalAuditRules();
    }
  };

  window.HarborAuth = HarborAuth;

  document.addEventListener('DOMContentLoaded', () => {
    HarborAuth.init();
  });

})(window);
