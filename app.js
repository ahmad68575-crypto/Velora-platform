/* ═══════════════════════════════════════════════════
   VELORA — app.js
   Routing, data, interactions, animations
═══════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════
   DATA
════════════════════════════════════ */
const SAMPLE_POSTS = [
  {
    id: 1,
    user: 'Nova Stellaris',
    handle: '@novastellaris',
    avatar: 'https://i.pravatar.cc/44?img=12',
    time: '2 min ago',
    text: 'Just captured this nebula shot from my balcony last night 🌌 The skies were unreal. Sometimes you just need to look up.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=700&q=80',
    tags: ['#NightSky', '#Astrophotography'],
    likes: 1284,
    comments: 47,
    liked: false,
  },
  {
    id: 2,
    user: 'Kai Mercer',
    handle: '@kaimercer',
    avatar: 'https://i.pravatar.cc/44?img=8',
    time: '18 min ago',
    text: 'New workspace setup complete ✨ Dark mode, purple LEDs, and way too much coffee. This is my natural habitat.',
    image: 'https://images.unsplash.com/photo-1616628188550-808682f3926d?w=700&q=80',
    tags: ['#TechLife', '#WorksetupGoals'],
    likes: 892,
    comments: 31,
    liked: false,
  },
  {
    id: 3,
    user: 'Aria Voss',
    handle: '@ariavoss',
    avatar: 'https://i.pravatar.cc/44?img=5',
    time: '1 hr ago',
    text: 'Sometimes the best kind of art is the kind that makes you sit still for a minute. Found this piece tucked into a tiny gallery in Kyoto. No cameras allowed — but I snuck this one 🤫',
    image: null,
    tags: ['#Art', '#Kyoto', '#Minimalism'],
    likes: 543,
    comments: 19,
    liked: false,
  },
  {
    id: 4,
    user: 'Ethan Cole',
    handle: '@ethancole',
    avatar: 'https://i.pravatar.cc/44?img=20',
    time: '3 hr ago',
    text: 'Hot take: the best productivity hack is just turning off your notifications for 4 hours. Shipping more today than I have all week.',
    image: null,
    tags: ['#Productivity', '#DeepWork'],
    likes: 2104,
    comments: 88,
    liked: true,
  },
  {
    id: 5,
    user: 'Luna Park',
    handle: '@lunapark',
    avatar: 'https://i.pravatar.cc/44?img=33',
    time: '5 hr ago',
    text: 'Golden hour in the city 🌆 Osaka never gets old. Every corner feels like a new film set.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80',
    tags: ['#Osaka', '#GoldenHour', '#StreetPhotography'],
    likes: 3217,
    comments: 126,
    liked: false,
  },
  {
    id: 6,
    user: 'Nora Singh',
    handle: '@norasingh',
    avatar: 'https://i.pravatar.cc/44?img=15',
    time: '8 hr ago',
    text: 'The Velora community never ceases to amaze me. 3 years ago I posted my first watercolor here and thought nobody would care. Today I just signed my first gallery deal. Thank you all 💜',
    image: null,
    tags: ['#Velora2025', '#Art', '#Grateful'],
    likes: 8843,
    comments: 312,
    liked: false,
  },
];

const SUGGESTIONS = [
  { name: 'Aria Voss',    handle: '@ariavoss',   img: 'https://i.pravatar.cc/40?img=5' },
  { name: 'Kai Mercer',   handle: '@kaimercer',  img: 'https://i.pravatar.cc/40?img=8' },
  { name: 'Luna Park',    handle: '@lunapark',   img: 'https://i.pravatar.cc/40?img=33' },
  { name: 'Ethan Cole',   handle: '@ethancole',  img: 'https://i.pravatar.cc/40?img=20' },
];

const MEDIA_IMAGES = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=70',
  'https://images.unsplash.com/photo-1616628188550-808682f3926d?w=400&q=70',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=70',
  'https://images.unsplash.com/photo-1476900543704-4312b429b7f7?w=400&q=70',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=70',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70',
];

// State
let posts = JSON.parse(JSON.stringify(SAMPLE_POSTS)); // deep clone
let loggedIn = false;
let currentPage = 'home';
let toastTimer = null;
let userPosts = []; // user-created posts

/* ════════════════════════════════════
   ROUTING
════════════════════════════════════ */
function showPage(pageId) {
  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');

  // Deactivate all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Activate target page
  const target = document.getElementById('page-' + pageId);
  if (!target) return;
  target.classList.add('active');
  currentPage = pageId;

  // Update nav link active states
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  // Page-specific initialization
  if (pageId === 'feed')    initFeed();
  if (pageId === 'profile') initProfile();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════
   NAVBAR
════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

document.getElementById('hamburger').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
});

/* ════════════════════════════════════
   FEED
════════════════════════════════════ */
function initFeed() {
  renderPosts(posts, 'feedContainer');
  renderSuggestions();
}

function renderPosts(postList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (postList.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="padding:2.5rem;text-align:center;color:var(--text-muted);">
        <i class="fa-solid fa-wind" style="font-size:2rem;margin-bottom:1rem;display:block;"></i>
        <p>No posts found.</p>
      </div>`;
    return;
  }

  container.innerHTML = postList.map(post => buildPostCard(post)).join('');
}

function buildPostCard(post) {
  const likeClass   = post.liked ? 'liked' : '';
  const likeIcon    = post.liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  const likeCount   = formatCount(post.likes);
  const commentCount = formatCount(post.comments);

  const imageHtml = post.image
    ? `<div class="post-image"><img src="${post.image}" alt="Post image" loading="lazy"/></div>`
    : '';

  const tagsHtml = post.tags
    ? `<div class="post-tags">${post.tags.map(t => `<span class="post-tag">${t}</span>`).join('')}</div>`
    : '';

  return `
  <div class="glass-card post-card" id="post-${post.id}">
    <div class="post-header">
      <img src="${post.avatar}" alt="${post.user}" loading="lazy"/>
      <div class="post-user">
        <strong>${post.user}</strong>
        <span>${post.handle} · ${post.time}</span>
      </div>
      <button class="post-menu" onclick="showToast('Post options coming soon!')">
        <i class="fa-solid fa-ellipsis"></i>
      </button>
    </div>
    <div class="post-body">
      <p>${post.text}</p>
    </div>
    ${imageHtml}
    ${tagsHtml}
    <div class="post-actions">
      <button class="action-btn ${likeClass}" onclick="toggleLike(${post.id})">
        <i class="${likeIcon}"></i><span>${likeCount}</span>
      </button>
      <button class="action-btn" onclick="openComments(${post.id})">
        <i class="fa-regular fa-comment"></i><span>${commentCount}</span>
      </button>
      <button class="action-btn" onclick="sharePost(${post.id})">
        <i class="fa-solid fa-share-nodes"></i><span>Share</span>
      </button>
      <button class="action-btn" style="margin-left:auto;" onclick="showToast('Post saved!')">
        <i class="fa-regular fa-bookmark"></i>
      </button>
    </div>
  </div>`;
}

function toggleLike(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;

  // Re-render just this post's card
  const card = document.getElementById('post-' + postId);
  if (card) {
    const newCard = document.createElement('div');
    newCard.innerHTML = buildPostCard(post);
    const newEl = newCard.firstElementChild;
    newEl.id = 'post-' + postId;
    card.replaceWith(newEl);
  }

  showToast(post.liked ? '❤️ Liked!' : 'Like removed');
}

function openComments(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const sampleComments = [
    { user: 'Aria Voss', handle: '@ariavoss', img: 'https://i.pravatar.cc/34?img=5', text: 'This is absolutely stunning! 💜', time: '5m ago' },
    { user: 'Kai Mercer', handle: '@kaimercer', img: 'https://i.pravatar.cc/34?img=8', text: 'The composition here is chef\'s kiss 🤌', time: '12m ago' },
    { user: 'Luna Park', handle: '@lunapark', img: 'https://i.pravatar.cc/34?img=33', text: 'I need to visit this place. Adding to my list!', time: '28m ago' },
  ];

  const commentsHtml = sampleComments.map(c => `
    <div class="comment-item">
      <img src="${c.img}" alt="${c.user}"/>
      <div class="comment-body">
        <strong>${c.user}</strong><span>${c.text}</span>
        <time class="comment-time">${c.time}</time>
      </div>
    </div>
  `).join('');

  const content = `
    <h3 style="font-family:'Outfit',sans-serif;font-size:1.05rem;font-weight:600;margin-bottom:1rem;">
      Comments <span style="color:var(--text-muted);font-size:0.85rem;font-weight:400;">(${post.comments})</span>
    </h3>
    <div class="comment-list">${commentsHtml}</div>
    <div class="comment-input-row">
      <img src="https://i.pravatar.cc/34?img=12" style="width:34px;height:34px;border-radius:50%;" alt="You"/>
      <input type="text" placeholder="Write a comment…" id="commentInputModal" onkeydown="if(event.key==='Enter')addComment(${postId})"/>
      <button class="comment-send" onclick="addComment(${postId})"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
  `;

  openModal(content);
}

function addComment(postId) {
  const input = document.getElementById('commentInputModal');
  if (!input || !input.value.trim()) return;
  const post = posts.find(p => p.id === postId);
  if (post) post.comments++;
  input.value = '';
  showToast('💬 Comment posted!');
  closeModal();
}

function sharePost(postId) {
  if (navigator.share) {
    navigator.share({ title: 'Check this out on Velora!', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Link copied!'));
  }
}

function submitPost() {
  const input = document.getElementById('postInput');
  if (!input || !input.value.trim()) {
    showToast('✏️ Write something first!');
    return;
  }
  const text = input.value.trim();
  input.value = '';

  const newPost = {
    id: Date.now(),
    user: 'Nova Stellaris',
    handle: '@novastellaris',
    avatar: 'https://i.pravatar.cc/44?img=12',
    time: 'Just now',
    text,
    image: null,
    tags: [],
    likes: 0,
    comments: 0,
    liked: false,
  };

  posts.unshift(newPost);
  userPosts.unshift(newPost);
  renderPosts(posts, 'feedContainer');
  showToast('✨ Post published!');
}

/* Filter / search */
function filterFeed() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) {
    renderPosts(posts, 'feedContainer');
    return;
  }
  const filtered = posts.filter(p =>
    p.text.toLowerCase().includes(q) ||
    p.user.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
  );
  renderPosts(filtered, 'feedContainer');
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  renderPosts(posts, 'feedContainer');
}

/* Suggestions */
function renderSuggestions() {
  const container = document.getElementById('suggestions');
  if (!container) return;
  container.innerHTML = SUGGESTIONS.map(s => `
    <div class="suggest-item">
      <img src="${s.img}" alt="${s.name}" loading="lazy"/>
      <div class="suggest-info">
        <strong>${s.name}</strong>
        <span>${s.handle}</span>
      </div>
      <button class="suggest-follow" onclick="followUser(this, '${s.name}')">Follow</button>
    </div>
  `).join('');
}

function followUser(btn, name) {
  if (btn.classList.contains('following')) {
    btn.classList.remove('following');
    btn.textContent = 'Follow';
    showToast(`Unfollowed ${name}`);
  } else {
    btn.classList.add('following');
    btn.textContent = '✓ Following';
    showToast(`Following ${name}!`);
  }
}

/* ════════════════════════════════════
   PROFILE
════════════════════════════════════ */
function initProfile() {
  renderPosts(posts.slice(0, 4), 'profileFeed');
  renderPosts(posts.filter(p => p.liked).slice(0, 3), 'likedFeed');
  renderMediaGrid();
}

function renderMediaGrid() {
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  grid.innerHTML = MEDIA_IMAGES.map(src => `
    <div class="media-thumb">
      <img src="${src}" alt="Media" loading="lazy"/>
    </div>
  `).join('');
}

function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('tab-' + tabId);
  if (content) content.classList.add('active');
}

/* ════════════════════════════════════
   AUTH
════════════════════════════════════ */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;

  if (!email || !pass) { showToast('⚠️ Please fill in all fields'); return; }
  if (!isValidEmail(email)) { showToast('⚠️ Enter a valid email'); return; }
  if (pass.length < 6) { showToast('⚠️ Password too short'); return; }

  // Simulate login
  loggedIn = true;
  document.getElementById('loginBtn').classList.add('hidden');
  document.getElementById('registerBtn').classList.add('hidden');
  document.getElementById('navAvatar').classList.remove('hidden');

  showToast('👋 Welcome back, Nova!');
  setTimeout(() => showPage('feed'), 500);
}

function handleRegister() {
  const first = document.getElementById('regFirst').value.trim();
  const last  = document.getElementById('regLast').value.trim();
  const user  = document.getElementById('regUser').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPass').value;
  const agree = document.getElementById('agreeTerms').checked;

  if (!first || !last || !user || !email || !pass) { showToast('⚠️ Please fill in all fields'); return; }
  if (!isValidEmail(email)) { showToast('⚠️ Enter a valid email'); return; }
  if (pass.length < 8) { showToast('⚠️ Password must be 8+ characters'); return; }
  if (!agree) { showToast('⚠️ Please accept the terms'); return; }

  // Simulate register
  loggedIn = true;
  document.getElementById('loginBtn').classList.add('hidden');
  document.getElementById('registerBtn').classList.add('hidden');
  document.getElementById('navAvatar').classList.remove('hidden');

  showToast('🎉 Welcome to Velora, ' + first + '!');
  setTimeout(() => showPage('feed'), 500);
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.querySelector('i').className = isHidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
}

function checkStrength(val) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8)  score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { pct: '0%',   color: 'transparent', text: '' },
    { pct: '25%',  color: '#f87171',     text: 'Weak' },
    { pct: '50%',  color: '#fb923c',     text: 'Fair' },
    { pct: '75%',  color: '#facc15',     text: 'Good' },
    { pct: '100%', color: '#4ade80',     text: 'Strong' },
  ];

  const lvl = levels[score];
  fill.style.width = lvl.pct;
  fill.style.background = lvl.color;
  label.textContent = lvl.text;
  label.style.color = lvl.color;
}

/* ════════════════════════════════════
   CONTACT
════════════════════════════════════ */
function handleContact() {
  const name    = document.getElementById('ctName').value.trim();
  const email   = document.getElementById('ctEmail').value.trim();
  const subject = document.getElementById('ctSubject').value;
  const message = document.getElementById('ctMessage').value.trim();

  if (!name || !email || !subject || !message) { showToast('⚠️ Please fill in all fields'); return; }
  if (!isValidEmail(email)) { showToast('⚠️ Enter a valid email'); return; }

  // Clear fields
  document.getElementById('ctName').value = '';
  document.getElementById('ctEmail').value = '';
  document.getElementById('ctSubject').value = '';
  document.getElementById('ctMessage').value = '';

  showToast('✉️ Message sent! We\'ll reply soon.');
}

/* ════════════════════════════════════
   TOAST
════════════════════════════════════ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ════════════════════════════════════
   MODAL
════════════════════════════════════ */
function openModal(htmlContent) {
  document.getElementById('modalContent').innerHTML = htmlContent;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════
   UTILS
════════════════════════════════════ */
function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ════════════════════════════════════
   KEYBOARD SHORTCUTS
════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ════════════════════════════════════
   INIT
════════════════════════════════════ */
(function init() {
  showPage('home');

  // Animate hero on load
  document.querySelectorAll('.hero > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .about-card, .trending-pill').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
})();
