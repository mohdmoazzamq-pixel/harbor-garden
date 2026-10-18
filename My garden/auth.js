/**
 * HarborAuth — Authentication, Role-Based Access Control & Navbar Session Manager
 * Enforces Author vs User access rules, dynamic navbar state, and floating luxury notifications.
 */
(function(window) {
  'use strict';

  const HarborAuth = {
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
      if (!password) return { score: 0, label: 'Empty', color: '#64748b' };
      let score = 0;
      if (password.length >= 8) score += 30;
      if (password.length >= 12) score += 15;
      if (/[A-Z]/.test(password)) score += 15;
      if (/[0-9]/.test(password)) score += 20;
      if (/[^A-Za-z0-9]/.test(password)) score += 20;

      if (score < 40) return { score, label: 'Weak', color: '#f43f5e' };
      if (score < 70) return { score, label: 'Moderate', color: '#f59e0b' };
      if (score < 90) return { score, label: 'Strong', color: '#10b981' };
      return { score, label: 'Royal Grade', color: '#e6ca65' };
    },

    // Quick Login as Author (Alex Morgan) — Full Access
    quickAuthorLogin() {
      if (!window.HarborDB) return;
      try {
        const session = window.HarborDB.loginUser('alex.morgan@harbor.io', 'Harbor@2026', true);
        this.showToast('Logged in as Author Alex Morgan with full administrative clearance.', 'success', '👑 Author Access Granted');
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

    // Render navigation bar with strict RBAC rules
    renderNavbar() {
      const authContainer = document.getElementById('harborNavAuth');
      const navLinksContainer = document.getElementById('harborNavLinks');
      const navDbBtn = document.querySelector('.btn-nav-database');

      if (!window.HarborDB) return;
      const user = window.HarborDB.getCurrentUser();
      const isAuthor = window.HarborDB.isAuthor();

      // Show/hide or manage the header Database shortcut button
      if (navDbBtn) {
        if (isAuthor) {
          navDbBtn.style.display = 'inline-flex';
          navDbBtn.innerHTML = `<span>📊</span> Inquiries DB`;
        } else {
          // Regular users or guests cannot see the Database quick action button
          navDbBtn.style.display = 'none';
        }
      }

      // Check "Database" nav link in the main links list
      if (navLinksContainer) {
        const dbNavLink = navLinksContainer.querySelector('a[href="database.html"]');
        if (dbNavLink && dbNavLink.parentElement) {
          if (!isAuthor) {
            // Hide database navigation item for regular users and guests
            dbNavLink.parentElement.style.display = 'none';
          } else {
            dbNavLink.parentElement.style.display = 'list-item';
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
          <div style="display: flex; align-items: center; gap: 10px; position: relative;">
            ${rolePill}
            <button class="harbor-user-badge" id="harborUserMenuBtn" aria-label="User Account">
              <span class="harbor-status-dot"></span>
              <span class="harbor-avatar">${user.avatarInitials || 'U'}</span>
              <span>${user.name.split(' ')[0]}</span>
              <span style="font-size: 0.68rem; color: var(--harbor-gold-light);">▼</span>
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
                  <span>📊</span> Inquiries Database
                </a>
                <a href="index.html#plantListingSection" class="harbor-dropdown-item" id="navAddPlantTrigger">
                  <span>🌿</span> Add Plant to Catalog
                </a>
              ` : `
                <div style="padding: 6px 12px; font-size: 0.72rem; color: var(--harbor-text-dim); border-top: 1px dashed rgba(0,0,0,0.08);">
                  🔒 Database &amp; Audit Logs restricted to Author role
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
        const mainContainer = document.querySelector('main.db-container');
        if (mainContainer) {
          mainContainer.innerHTML = `
            <div class="access-restricted-card">
              <div class="lock-shield-icon">🔒</div>
              <h2 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--harbor-text-main); margin-bottom: 12px;">
                Author Clearance Required
              </h2>
              <p style="font-size: 0.95rem; color: var(--harbor-text-muted); line-height: 1.65; margin-bottom: 24px;">
                Access to the <strong>Client Inquiries Database</strong> and registered user credentials is restricted to <strong>Author</strong> accounts.
                ${user ? `<br>Your current role is <strong style="color:var(--harbor-emerald);">${user.role}</strong>.` : '<br>You are currently not logged in.'}
              </p>
              <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
                <button type="button" class="btn-primary" id="btnSwitchToAuthor">
                  <span>👑</span> Sign In as Author (Alex Morgan)
                </button>
                <a href="index.html" class="btn-secondary">
                  &larr; Return to Garden Home
                </a>
              </div>
            </div>
          `;

          const switchBtn = document.getElementById('btnSwitchToAuthor');
          if (switchBtn) {
            switchBtn.addEventListener('click', () => {
              this.quickAuthorLogin();
            });
          }
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
            <button type="button" class="btn-primary" id="btnUnlockAuditAuthor">
              <span>👑</span> Switch to Author Clearance (Alex Morgan)
            </button>
          </div>
        `;

        const unlockBtn = document.getElementById('btnUnlockAuditAuthor');
        if (unlockBtn) {
          unlockBtn.addEventListener('click', () => {
            this.quickAuthorLogin();
          });
        }
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
