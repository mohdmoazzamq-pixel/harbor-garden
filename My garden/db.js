/**
 * HarborDB — Local Database Engine for My Garden & Harbor Security Portal
 * Supports Role-Based Access Control (Author vs User), Persistent Plant Listings,
 * Inquiries Database, Audit Trails, and Password Recovery.
 */
(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    CONTACTS: 'harbor_garden_contacts',
    USERS: 'harbor_garden_users',
    AUDIT: 'harbor_garden_audit',
    SESSION: 'harbor_garden_session',
    RESET_TOKENS: 'harbor_garden_reset_tokens',
    PLANTS: 'harbor_garden_plants_v2'
  };

  // Default seed users with explicit Author vs User roles
  const SEED_USERS = [
    {
      id: 'usr_author_alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@harbor.io',
      password: 'Harbor@2026',
      role: 'Author',
      title: 'Lead Security & Botanical Author',
      twoFactorEnabled: true,
      securityScore: 98,
      avatarInitials: 'AM',
      createdAt: '2026-01-15T09:30:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'usr_author_moazzam',
      name: 'Moazzam Qureshi',
      email: 'moazzam@mygarden.com',
      password: 'Garden@2026',
      role: 'Author',
      title: 'Botanical Estate Author',
      twoFactorEnabled: true,
      securityScore: 94,
      avatarInitials: 'MQ',
      createdAt: '2026-02-10T11:00:00.000Z',
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
  ];

  // The 10 original flowers with full specialities and step-by-step growing guides
  const SEED_PLANTS = [
    {
      id: 'plt_peony',
      name: 'Peony',
      scientific: 'Paeonia lactiflora',
      image: 'https://hips.hearstapps.com/clv.h-cdn.co/assets/17/13/1490640739-gettyimages-126026586.jpg?crop=0.5357277882797731xw:1xh;center,top',
      bloomSeason: 'Late spring to early summer',
      seasonCategory: 'spring',
      speciality: "These eye-catching perennials are the queens of the garden with magnificent form, intoxicating scent, and decades-long lifespans. Friendly ants visit solely to sip nectar without harming the majestic blooms.",
      growGuide: "Plant in fertile, humus-rich, well-draining soil with at least 6 hours of morning sunlight. Position tuber eyes no deeper than 1.5 to 2 inches below ground level. Water deeply once per week at soil level, avoiding soaking delicate petals. Stake tall stems in early spring to support the heavy double blooms.",
      isCustom: false,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'plt_sunflower',
      name: 'Sunflower',
      scientific: 'Helianthus annuus',
      image: 'https://hips.hearstapps.com/hmg-prod/images/sunflowers-blooming-against-sky-royalty-free-image-1573171826.jpg?crop=0.8xw:1xh;center,top',
      bloomSeason: 'Late summer to early fall',
      seasonCategory: 'summer',
      speciality: "Joyful, towering sun-followers available in vivid yellows, deep velvets, and dwarf statures. Unmatched for lifting spirits, nurturing wild birds, and bringing sheer grandeur to garden borders.",
      growGuide: "Sow seeds directly outdoors after spring frost in loose, nutrient-rich soil with 6-8 hours of direct sunshine. Plant seeds 1 inch deep spaced 12-18 inches apart. Water deeply along the root zone during germination and bud formation. Support tall varieties with sturdy bamboo stakes in windy zones.",
      isCustom: false,
      createdAt: '2026-01-02T00:00:00.000Z'
    },
    {
      id: 'plt_black_eyed_susan',
      name: 'Black-Eyed Susan',
      scientific: 'Rudbeckia hirta',
      image: 'https://hips.hearstapps.com/hmg-prod/images/full-frame-shot-of-yellow-flowering-plants-columbus-royalty-free-image-1709658257.jpg?crop=1xw:0.9375xh;center,top',
      bloomSeason: 'Late summer to early fall',
      seasonCategory: 'summer',
      speciality: "A golden prairie beacon that smiles for weeks on end. It requires zero coddling thanks to its legendary drought tolerance and remarkable disease resistance.",
      growGuide: "Adaptable to almost all well-draining garden loams from clay to sandy soil. Prefers full sun. Space crowns 18 inches apart. Water moderately until root system establishes, after which it withstands intense summer dry spells. Deadhead spent blossom cones to stimulate continuous second-wave blooms.",
      isCustom: false,
      createdAt: '2026-01-03T00:00:00.000Z'
    },
    {
      id: 'plt_tulip',
      name: 'Tulip',
      scientific: 'Tulipa gesneriana',
      image: 'https://hips.hearstapps.com/clv.h-cdn.co/assets/16/18/tulip.jpg?crop=0.536xw:1.00xh;0.0182xw,0',
      bloomSeason: 'Early to late spring',
      seasonCategory: 'spring',
      speciality: "Their stately, cup-shaped royal blooms announce that spring has arrived. Unbeatable saturated color intensity across crimson, apricot, gold, and deep plum hues.",
      growGuide: "Plant firm bulbs during cool autumn before ground freezes. Bury bulbs 6 to 8 inches deep with pointed tip facing skyward. Requires fertile, porous, fast-draining soil with protection from soggy winter waterlogging. Feed with slow-release organic bone meal at planting time.",
      isCustom: false,
      createdAt: '2026-01-04T00:00:00.000Z'
    },
    {
      id: 'plt_snowdrop',
      name: 'Snowdrop',
      scientific: 'Galanthus nivalis',
      image: 'https://hips.hearstapps.com/hmg-prod/images/spring-snowdrops-galanthus-nivalis-royalty-free-image-1709587839.jpg?crop=0.53358xw:1xh;center,top',
      bloomSeason: 'Late winter to earliest spring',
      seasonCategory: 'spring',
      speciality: "Charming, delicate bell-shaped white heads brave cold ground while snow still blankets the earth. Naturally deer, rabbit, and rodent resistant.",
      growGuide: "Plant in autumn in cool, moist, organic-rich soil beneath deciduous shrubs or trees where spring sun filters through bare branches. Plant bulbs 3 inches deep in natural drifts. Keep soil consistently moist but never submerged during active winter and spring growth.",
      isCustom: false,
      createdAt: '2026-01-05T00:00:00.000Z'
    },
    {
      id: 'plt_fritillaria',
      name: 'Fritillaria',
      scientific: 'Fritillaria meleagris',
      image: 'https://hips.hearstapps.com/hmg-prod/images/flowering-snakeshead-lily-royalty-free-image-1709589246.jpg?crop=0.557xw:1.00xh;0.383xw,0',
      bloomSeason: 'Mid-spring',
      seasonCategory: 'spring',
      speciality: "Intriguing checkered, pendant bell flowers nod gracefully atop slender grassy foliage. High visual intrigue and naturally disliked by garden rodents and burrowing critters.",
      growGuide: "Plant delicate bulbs in early autumn. Place bulbs on their side at a 45-degree angle 4 inches deep so moisture does not collect inside the central hollow cavity. Provide moist, gritty, humus-rich soil in light dappled shade or meadow margins.",
      isCustom: false,
      createdAt: '2026-01-06T00:00:00.000Z'
    },
    {
      id: 'plt_azalea',
      name: 'Azalea',
      scientific: 'Rhododendron indicum',
      image: 'https://hips.hearstapps.com/hmg-prod/images/close-up-of-pink-azalea-flowers-filling-frame-royalty-free-image-1709656178.jpg?crop=0.53333xw:1xh;center,top',
      bloomSeason: 'Spring',
      seasonCategory: 'spring',
      speciality: "Flamboyant evergreen and deciduous shrubs that saturate the garden landscape in luminous pinks, corals, and purples with lush foliage.",
      growGuide: "Requires naturally acidic, well-aerated soil (pH 4.5 to 5.5) enriched with peat moss or pine bark compost. Shallow root system demands consistent moisture and 3 inches of organic pine needle mulch. Situate in dappled morning sun and sheltered afternoon shade.",
      isCustom: false,
      createdAt: '2026-01-07T00:00:00.000Z'
    },
    {
      id: 'plt_foam_flower',
      name: 'Foam Flower',
      scientific: 'Tiarella cordifolia',
      image: 'https://hips.hearstapps.com/hmg-prod/images/white-tiarella-spring-symphony-foam-flower-in-bloom-royalty-free-image-1709589477.jpg?crop=0.536xw:1.00xh;0.336xw,0',
      bloomSeason: 'Spring to summer',
      seasonCategory: 'spring',
      speciality: "Masses of ethereal, frilly white starry spikes create a dreamy woodland carpet. Evergreen foliage provides ornamental leaf marbling through autumn chill.",
      growGuide: "Ideal groundcover for shaded woodland gardens, rockeries, and moist tree bases. Plant in organically rich, moisture-retentive, loose compost. Maintain light even moisture throughout warmer months. Divide runner clumps every 3 years in early spring.",
      isCustom: false,
      createdAt: '2026-01-08T00:00:00.000Z'
    },
    {
      id: 'plt_astrantia',
      name: 'Astrantia (Masterwort)',
      scientific: 'Astrantia major',
      image: 'https://hips.hearstapps.com/hmg-prod/images/beautiful-pink-flowers-of-astrantia-major-a-summer-royalty-free-image-1709585164.jpg?crop=0.802xw:1.00xh;0.150xw,0',
      bloomSeason: 'Spring to summer',
      seasonCategory: 'summer',
      speciality: "An aristocratic cottage garden treasure featuring delicate papery bracts and pincushion florets. Highly prized cut flower that magnetizes beneficial pollinators.",
      growGuide: "Prefers deep, cool, moisture-retentive loamy soils in full morning sun to partial shade. Mulch heavily in early summer to keep root temperatures cool. Cut back to ground after initial flowering to stimulate fresh foliage and a vibrant second flush of autumn blooms.",
      isCustom: false,
      createdAt: '2026-01-09T00:00:00.000Z'
    },
    {
      id: 'plt_allium',
      name: 'Allium',
      scientific: 'Allium giganteum',
      image: 'https://hips.hearstapps.com/hmg-prod/images/rhs-garden-wisley-surrey-allium-globemaster-onion-royalty-free-image-1709590587.jpg?crop=0.536xw:1.00xh;0.315xw,0',
      bloomSeason: 'Spring to summer',
      seasonCategory: 'spring',
      speciality: "Spectacular architectural spheres of lilac, violet, and amethyst hover atop sturdy upright scapes. Natural deer and pest repellent due to gentle organic allium scent.",
      growGuide: "Plant large bulbs in autumn 6 inches deep in loose, sun-baked, well-draining garden soil. Ensure site receives full sun all day. Water moderately during active spring growth, then allow soil to dry out naturally during summer bulb dormancy.",
      isCustom: false,
      createdAt: '2026-01-10T00:00:00.000Z'
    }
  ];

  // Default sample contacts
  const SEED_CONTACTS = [
    {
      id: 'ct_17101801',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      mobile: '9876543210',
      service: 'garden-design',
      serviceLabel: 'Garden Design',
      message: 'Looking to redesign my rooftop terrace in Haldwani with native flowering perennials.',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'ct_17101802',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      mobile: '9898989898',
      service: 'maintenance',
      serviceLabel: 'Garden Maintenance',
      message: 'Need monthly hedge trimming, pruning, and seasonal fertilizer care for our cottage garden.',
      status: 'Contacted',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
    },
    {
      id: 'ct_17101803',
      name: 'Dr. Ananya Roy',
      email: 'ananya.roy@example.com',
      mobile: '9123456789',
      service: 'organic-gardening',
      serviceLabel: 'Organic Gardening',
      message: 'Interested in setting up organic vegetable garden beds (spinach, coriander, tomatoes).',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
    }
  ];

  // Default audit logs
  const SEED_AUDIT = [
    {
      id: 'aud_seed_1',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      event: 'SYSTEM_BOOT',
      details: 'Harbor Local Database initialized with Author & User RBAC rules.',
      status: 'SUCCESS',
      ip: '127.0.0.1'
    },
    {
      id: 'aud_seed_2',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      event: 'AUTHOR_LOGIN',
      details: 'Author Alex Morgan authenticated with full administrative clearance.',
      status: 'SUCCESS',
      ip: '192.168.1.104'
    }
  ];

  class LocalDatabase {
    constructor() {
      this.init();
    }

    init() {
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      } else {
        // Ensure Alex Morgan and Elena Vance roles are refreshed if existing cache had old roles
        const users = this.getUsers();
        let changed = false;
        users.forEach(u => {
          if (u.email === 'alex.morgan@harbor.io' && u.role !== 'Author') {
            u.role = 'Author';
            changed = true;
          }
          if (u.email === 'user@mygarden.com' && u.role !== 'User') {
            u.role = 'User';
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }
      }

      if (!localStorage.getItem(STORAGE_KEYS.PLANTS)) {
        localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(SEED_PLANTS));
      }

      if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(SEED_CONTACTS));
      }

      if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT));
      }

      if (!localStorage.getItem(STORAGE_KEYS.RESET_TOKENS)) {
        localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify({}));
      }
    }

    generateId(prefix = 'id') {
      return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    }

    formatServiceLabel(serviceKey) {
      const map = {
        'garden-design': 'Garden Design',
        'planting': 'Planting Services',
        'maintenance': 'Garden Maintenance',
        'lawn-care': 'Lawn Care',
        'plant-care': 'Tree and Plant Care',
        'organic-gardening': 'Organic Gardening'
      };
      return map[serviceKey] || serviceKey || 'General Gardening Inquiry';
    }

    // ==========================================
    // Role-Based Access Control (RBAC) Helpers
    // ==========================================
    getCurrentSession() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    getCurrentUser() {
      const session = this.getCurrentSession();
      return session ? session.user : null;
    }

    isAuthor() {
      const user = this.getCurrentUser();
      return !!(user && (user.role === 'Author' || user.role === 'Admin'));
    }

    canAccessDatabase() {
      return this.isAuthor();
    }

    canAccessAudit() {
      return this.isAuthor();
    }

    canListPlants() {
      return this.isAuthor();
    }

    // ==========================================
    // Plant Listings Collection
    // ==========================================
    getPlants() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PLANTS);
        return data ? JSON.parse(data) : SEED_PLANTS;
      } catch (e) {
        return SEED_PLANTS;
      }
    }

    savePlant({ name, image, bloomSeason, speciality, growGuide, scientific, seasonCategory }) {
      if (!this.isAuthor()) {
        throw new Error('Access Denied: Only Author accounts are authorized to list flowers or trees in the botanical collection. Please sign in as an Author.');
      }

      if (!name || !name.trim()) throw new Error('Plant / Flower name is required.');
      if (!speciality || !speciality.trim()) throw new Error('Flower speciality is required.');
      if (!bloomSeason || !bloomSeason.trim()) throw new Error('Blooming season detail is required.');
      if (!growGuide || !growGuide.trim()) throw new Error('How to Grow guide is required.');

      const plants = this.getPlants();
      const newPlant = {
        id: this.generateId('plt'),
        name: name.trim(),
        scientific: (scientific || name.trim() + ' sp.').trim(),
        image: (image && image.trim()) || 'https://images.pexels.com/photos/7694761/pexels-photo-7694761.jpeg',
        bloomSeason: bloomSeason.trim(),
        seasonCategory: seasonCategory || 'spring',
        speciality: speciality.trim(),
        growGuide: growGuide.trim(),
        isCustom: true,
        createdBy: this.getCurrentUser() ? this.getCurrentUser().name : 'Botanical Author',
        createdAt: new Date().toISOString()
      };

      plants.unshift(newPlant);
      localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
      this.addAuditLog('PLANT_ADDED', `New plant listed in collection: "${newPlant.name}"`, 'SUCCESS');
      this.syncToServer('POST', '/api/plants', newPlant);

      return newPlant;
    }

    deletePlant(plantId) {
      if (!this.isAuthor()) {
        throw new Error('Only Author accounts are permitted to remove plants from the catalog.');
      }
      const plants = this.getPlants();
      const target = plants.find(p => p.id === plantId);
      const filtered = plants.filter(p => p.id !== plantId);
      localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(filtered));
      this.addAuditLog('PLANT_DELETED', `Plant removed: ${target ? target.name : plantId}`, 'WARNING');
      this.syncToServer('DELETE', `/api/plants/${plantId}`);
      return true;
    }

    resetPlantsToSeed() {
      localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(SEED_PLANTS));
      return SEED_PLANTS;
    }

    // ==========================================
    // Contacts Collection
    // ==========================================
    getContacts() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    saveContact(entry) {
      const contacts = this.getContacts();
      const newContact = {
        id: this.generateId('ct'),
        name: (entry.name || '').trim(),
        email: (entry.email || '').trim().toLowerCase(),
        mobile: (entry.mobile || '').trim(),
        service: entry.service || '',
        serviceLabel: this.formatServiceLabel(entry.service),
        message: (entry.message || '').trim(),
        status: 'New',
        createdAt: new Date().toISOString()
      };

      contacts.unshift(newContact);
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      this.addAuditLog('CONTACT_SUBMISSION', `Inquiry submitted by ${newContact.name} (${newContact.serviceLabel})`, 'INFO');
      this.syncToServer('POST', '/api/contacts', newContact);

      return newContact;
    }

    updateContactStatus(contactId, newStatus) {
      if (!this.isAuthor()) {
        throw new Error('Author clearance required to alter inquiry database status.');
      }
      const contacts = this.getContacts();
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        contact.status = newStatus;
        contact.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        this.addAuditLog('CONTACT_STATUS_UPDATE', `Inquiry #${contactId} updated to "${newStatus}"`, 'INFO');
        this.syncToServer('PATCH', `/api/contacts/${contactId}`, { status: newStatus });
        return contact;
      }
      return null;
    }

    deleteContact(contactId) {
      if (!this.isAuthor()) {
        throw new Error('Author clearance required to delete database records.');
      }
      const contacts = this.getContacts();
      const filtered = contacts.filter(c => c.id !== contactId);
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filtered));
      this.addAuditLog('CONTACT_DELETED', `Inquiry #${contactId} deleted from local database`, 'WARNING');
      this.syncToServer('DELETE', `/api/contacts/${contactId}`);
      return true;
    }

    // ==========================================
    // Users & Authentication
    // ==========================================
    getUsers() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    findUserByEmail(email) {
      if (!email) return null;
      const cleanEmail = email.trim().toLowerCase();
      const users = this.getUsers();
      return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
    }

    registerUser({ name, email, password, role = 'User' }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (name || '').trim();

      if (!cleanEmail || !password || password.length < 6) {
        throw new Error('Invalid email or password must be at least 6 characters.');
      }

      if (this.findUserByEmail(cleanEmail)) {
        throw new Error('An account with this email address already exists.');
      }

      const users = this.getUsers();
      const initials = cleanName
        ? cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

      const newUser = {
        id: this.generateId('usr'),
        name: cleanName || 'Harbor User',
        email: cleanEmail,
        password: password,
        role: role === 'Author' ? 'Author' : 'User', // default to User
        title: role === 'Author' ? 'Botanical Author' : 'Garden Member',
        twoFactorEnabled: false,
        securityScore: 85,
        avatarInitials: initials,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.addAuditLog('USER_REGISTRATION', `New ${newUser.role} registered: ${cleanEmail}`, 'SUCCESS');
      this.syncToServer('POST', '/api/auth/register', newUser);

      return newUser;
    }

    loginUser(email, password, rememberMe = true) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const user = this.findUserByEmail(cleanEmail);

      if (!user) {
        this.addAuditLog('LOGIN_FAILED', `Failed login attempt for unknown email: ${cleanEmail}`, 'WARNING');
        throw new Error('No account found with this email address.');
      }

      if (user.password !== password) {
        this.addAuditLog('LOGIN_FAILED', `Incorrect password for user: ${cleanEmail}`, 'WARNING');
        throw new Error('Incorrect password. Please verify your credentials or use Forgot Password.');
      }

      user.lastLogin = new Date().toISOString();
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      const sessionData = {
        token: 'hbr_tok_' + Math.random().toString(36).substr(2) + Date.now().toString(36),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // 'Author' or 'User'
          title: user.title,
          twoFactorEnabled: user.twoFactorEnabled,
          securityScore: user.securityScore,
          avatarInitials: user.avatarInitials,
          lastLogin: user.lastLogin
        },
        rememberMe: !!rememberMe,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
      this.addAuditLog('USER_LOGIN', `${user.name} (${user.role}) logged in successfully`, 'SUCCESS');
      this.syncToServer('POST', '/api/auth/login', { email: cleanEmail, role: user.role });

      return sessionData;
    }

    logout() {
      const current = this.getCurrentUser();
      if (current) {
        this.addAuditLog('USER_LOGOUT', `${current.name} (${current.role}) signed out`, 'INFO');
      }
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    // ==========================================
    // Forgot Password & Reset System
    // ==========================================
    generateResetCode(email) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const user = this.findUserByEmail(cleanEmail);
      if (!user) {
        throw new Error('No registered account was found with this email address.');
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = Date.now() + 15 * 60 * 1000;

      let tokens = {};
      try {
        tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_TOKENS) || '{}');
      } catch (e) {}

      tokens[cleanEmail] = { code, expiry, attempts: 0 };
      localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
      this.addAuditLog('PASSWORD_RESET_REQUEST', `Reset security code generated for ${cleanEmail}`, 'INFO');

      return { email: cleanEmail, code: code, expiryMinutes: 15 };
    }

    verifyResetCode(email, inputCode) {
      const cleanEmail = (email || '').trim().toLowerCase();
      let tokens = {};
      try {
        tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_TOKENS) || '{}');
      } catch (e) {}

      const record = tokens[cleanEmail];
      if (!record) {
        throw new Error('No active reset request found for this email. Please request a new code.');
      }

      if (Date.now() > record.expiry) {
        delete tokens[cleanEmail];
        localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
        throw new Error('This verification code has expired. Please request a new code.');
      }

      if (record.code !== inputCode.toString().trim()) {
        record.attempts = (record.attempts || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
        if (record.attempts >= 5) {
          delete tokens[cleanEmail];
          localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
          throw new Error('Too many invalid attempts. Reset request has been revoked for security.');
        }
        throw new Error('Invalid verification code. Please check and re-enter.');
      }

      return true;
    }

    resetPasswordWithCode(email, inputCode, newPassword) {
      this.verifyResetCode(email, inputCode);

      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long.');
      }

      const cleanEmail = (email || '').trim().toLowerCase();
      const users = this.getUsers();
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) throw new Error('Account could not be found to update password.');

      user.password = newPassword;
      user.updatedAt = new Date().toISOString();
      user.securityScore = Math.min(100, (user.securityScore || 85) + 5);

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      let tokens = {};
      try {
        tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_TOKENS) || '{}');
      } catch (e) {}
      delete tokens[cleanEmail];
      localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));

      this.addAuditLog('PASSWORD_RESET_SUCCESS', `Password successfully reset for account ${cleanEmail}`, 'SUCCESS');
      this.syncToServer('POST', '/api/auth/reset-password', { email: cleanEmail, newPassword });

      return true;
    }

    toggle2FA(userId, enable) {
      const users = this.getUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        user.twoFactorEnabled = !!enable;
        user.securityScore = enable ? 96 : 82;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        const session = this.getCurrentSession();
        if (session && session.user.id === userId) {
          session.user.twoFactorEnabled = user.twoFactorEnabled;
          session.user.securityScore = user.securityScore;
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        }

        this.addAuditLog('2FA_TOGGLED', `Two-Factor Authentication ${enable ? 'enabled' : 'disabled'} for ${user.email}`, 'INFO');
        return user;
      }
      return null;
    }

    // ==========================================
    // Audit Trail
    // ==========================================
    getAuditLogs() {
      // Only Authors can access audit logs
      if (!this.canAccessAudit()) {
        return [];
      }
      try {
        const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    addAuditLog(event, details, status = 'INFO') {
      let logs = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
        logs = raw ? JSON.parse(raw) : [];
      } catch (e) {
        logs = [];
      }
      const newLog = {
        id: this.generateId('aud'),
        timestamp: new Date().toISOString(),
        event,
        details,
        status,
        ip: '127.0.0.1 (Local)'
      };
      logs.unshift(newLog);
      if (logs.length > 250) logs.pop();
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
    }

    // ==========================================
    // Export Data Utilities
    // ==========================================
    exportContactsCSV() {
      if (!this.canAccessDatabase()) {
        throw new Error('Author clearance required to export database.');
      }
      const contacts = this.getContacts();
      if (!contacts.length) return '';
      const headers = ['ID', 'Date', 'Name', 'Email', 'Mobile', 'Service', 'Status', 'Message'];
      const rows = contacts.map(c => [
        `"${c.id}"`,
        `"${new Date(c.createdAt).toLocaleString()}"`,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.mobile || '').replace(/"/g, '""')}"`,
        `"${(c.serviceLabel || '').replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${(c.message || '').replace(/"/g, '""')}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    exportDatabaseJSON() {
      if (!this.canAccessDatabase()) {
        throw new Error('Author clearance required to export database.');
      }
      return JSON.stringify({
        plants: this.getPlants(),
        contacts: this.getContacts(),
        users: this.getUsers().map(u => ({ ...u, password: '***' })),
        auditLogs: this.canAccessAudit() ? this.getAuditLogs() : [],
        exportedAt: new Date().toISOString()
      }, null, 2);
    }

    // Server Sync
    async syncToServer(method, endpoint, payload) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: payload ? JSON.stringify(payload) : undefined,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (err) {}
    }
  }

  window.HarborDB = new LocalDatabase();

})(window);
