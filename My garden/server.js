/**
 * Harbor Local Web & API Server
 * Zero-dependency persistent Node.js server for My Garden
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit.json');
const PLANTS_FILE = path.join(DATA_DIR, 'plants.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const ABOUT_CARDS_FILE = path.join(DATA_DIR, 'about-cards.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory OTP storage for password recovery simulation
const otpStore = new Map(); // email -> { code, expiry }

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function initJsonFile(filePath, defaultData) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

initJsonFile(CONTACTS_FILE, [
  {
    id: 'ct_srv_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    mobile: '9876543210',
    service: 'garden-design',
    serviceLabel: 'Garden Design',
    message: 'Looking to redesign my rooftop terrace in Haldwani with native flowering perennials.',
    status: 'New',
    createdAt: new Date().toISOString()
  }
]);

initJsonFile(USERS_FILE, [
  {
    id: 'usr_author_moazzam',
    name: 'Moazzam Qureshi',
    email: 'moazzam@mygarden.com',
    password: 'Garden@2026',
    role: 'Author',
    title: 'Master Botanical Author',
    twoFactorEnabled: true,
    securityScore: 98,
    avatarInitials: 'MQ',
    createdAt: '2026-02-10T11:00:00.000Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr_member_alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@harbor.io',
    password: 'Harbor@2026',
    role: 'User',
    title: 'Security Member',
    twoFactorEnabled: true,
    securityScore: 92,
    avatarInitials: 'AM',
    createdAt: '2026-01-15T09:30:00.000Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr_member_elena',
    name: 'Elena Vance',
    email: 'user@mygarden.com',
    password: 'User@2026',
    role: 'User',
    title: 'Standard Garden Member',
    twoFactorEnabled: false,
    securityScore: 82,
    avatarInitials: 'EV',
    createdAt: '2026-03-01T14:20:00.000Z',
    lastLogin: new Date().toISOString()
  }
]);

initJsonFile(AUDIT_FILE, [
  {
    id: 'aud_1',
    timestamp: new Date().toISOString(),
    event: 'SERVER_BOOT',
    details: 'Harbor Node.js server started with Flower Shop, 3-Step Service Booking & OTP Gateway.',
    status: 'SUCCESS',
    ip: '127.0.0.1'
  }
]);

initJsonFile(PLANTS_FILE, []);
initJsonFile(SERVICES_FILE, []);
initJsonFile(ABOUT_CARDS_FILE, []);
initJsonFile(ORDERS_FILE, []);

// Helper: read and write JSON safely
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    // 1. GET & POST /api/plants
    if (pathname === '/api/plants' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readJson(PLANTS_FILE)));
      return;
    }

    if (pathname === '/api/plants' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const plant = JSON.parse(body);
          const list = readJson(PLANTS_FILE);
          if (!plant.id) plant.id = 'plt_' + Date.now().toString(36);
          list.unshift(plant);
          writeJson(PLANTS_FILE, list);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, plant }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid plant payload' }));
        }
      });
      return;
    }

    // 2. GET & POST /api/services
    if (pathname === '/api/services' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readJson(SERVICES_FILE)));
      return;
    }

    if (pathname === '/api/services' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const service = JSON.parse(body);
          const list = readJson(SERVICES_FILE);
          if (!service.id) service.id = 'svc_' + Date.now().toString(36);
          list.unshift(service);
          writeJson(SERVICES_FILE, list);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, service }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid service payload' }));
        }
      });
      return;
    }

    // 3. GET & POST /api/about-cards
    if (pathname === '/api/about-cards' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readJson(ABOUT_CARDS_FILE)));
      return;
    }

    if (pathname === '/api/about-cards' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const card = JSON.parse(body);
          const list = readJson(ABOUT_CARDS_FILE);
          if (!card.id) card.id = 'abt_' + Date.now().toString(36);
          list.unshift(card);
          writeJson(ABOUT_CARDS_FILE, list);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, card }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid about-card payload' }));
        }
      });
      return;
    }

    // 4. GET & POST /api/orders
    if (pathname === '/api/orders' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readJson(ORDERS_FILE)));
      return;
    }

    if (pathname === '/api/orders' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const order = JSON.parse(body);
          const list = readJson(ORDERS_FILE);
          list.unshift(order);
          writeJson(ORDERS_FILE, list);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, order }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid order payload' }));
        }
      });
      return;
    }

    // 5. GET & POST /api/contacts
    if (pathname === '/api/contacts' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readJson(CONTACTS_FILE)));
      return;
    }

    if (pathname === '/api/contacts' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const entry = JSON.parse(body);
          const list = readJson(CONTACTS_FILE);
          if (!entry.id) entry.id = 'ct_' + Date.now().toString(36);
          if (!entry.createdAt) entry.createdAt = new Date().toISOString();
          list.unshift(entry);
          writeJson(CONTACTS_FILE, list);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, contact: entry }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    // 6. GET /api/users
    if (pathname === '/api/users' && req.method === 'GET') {
      const users = readJson(USERS_FILE).map(u => ({ ...u, password: '***' }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
      return;
    }

    // 7. POST /api/auth/register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const user = JSON.parse(body);
          const users = readJson(USERS_FILE);
          // Only Moazzam Qureshi can be Author; all other accounts are strictly User
          if ((user.email || '').trim().toLowerCase() !== 'moazzam@mygarden.com') {
            user.role = 'User';
            user.title = 'Garden Member';
          }
          users.push(user);
          writeJson(USERS_FILE, users);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Registration failed' }));
        }
      });
      return;
    }

    // 8. POST /api/auth/send-otp (Password Recovery Dispatch)
    if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { email } = JSON.parse(body);
          const cleanEmail = (email || '').trim().toLowerCase();
          const users = readJson(USERS_FILE);
          const userExists = users.some(u => u.email.toLowerCase() === cleanEmail);

          if (!userExists) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No account registered with this email address.' }));
            return;
          }

          const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
          otpStore.set(cleanEmail, { code: otpCode, expiry: Date.now() + 15 * 60 * 1000 });

          console.log(`\n[EMAIL GATEWAY] 📧 Dispatched OTP to ${cleanEmail}: ${otpCode}`);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: `Verification code dispatched to ${cleanEmail}`,
            code: otpCode
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to dispatch verification code' }));
        }
      });
      return;
    }

    // 9. POST /api/auth/reset-password
    if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { email, newPassword } = JSON.parse(body);
          const users = readJson(USERS_FILE);
          const target = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
          if (target) {
            target.password = newPassword;
            writeJson(USERS_FILE, users);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Reset failed' }));
        }
      });
      return;
    }

    // 10. GET /api/audit
    if (pathname === '/api/audit' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readJson(AUDIT_FILE)));
      return;
    }
  }

  // Static File Server
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  let safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  let fullPath = path.join(__dirname, safePath);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(fullPath, 'index.html');
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(fullPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found &bull; Harbor</title><link rel="stylesheet" href="/harbor-theme.css"></head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;">
        <div>
          <h1 style="font-size:3rem;color:#e11d48;margin-bottom:12px;">404</h1>
          <p style="color:#64748b;margin-bottom:24px;">The requested file or botanical endpoint could not be found.</p>
          <a href="/index.html" class="btn-primary">Return to Harbor Garden Home &rarr;</a>
        </div>
      </body>
      </html>
    `);
  }
});

function startListening(port) {
  server.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🌿 HARBOR ROYAL GARDEN &bull; WEB & DATABASE SERVER v3.0`);
    console.log(`======================================================`);
    console.log(`📍 Web Application:  http://localhost:${port}/`);
    console.log(`🛍️ Flower Shop:      http://localhost:${port}/index.html`);
    console.log(`🛠️ Garden Services:  http://localhost:${port}/services.html`);
    console.log(`📖 About Heritage:   http://localhost:${port}/about.html`);
    console.log(`🛡️ Harbor Login:     http://localhost:${port}/login.html`);
    console.log(`🔑 Forgot Password:  http://localhost:${port}/forgot-password.html`);
    console.log(`📊 Local Database:   http://localhost:${port}/database.html`);
    console.log(`💾 JSON Storage:     ${DATA_DIR}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying port ${port + 1}...`);
      startListening(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startListening(DEFAULT_PORT);
