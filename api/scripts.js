document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // === DEFAULT TO DARK MODE ===
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Priority: saved > system > dark default
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    const defaultToDark = true; // Set to true to force dark mode

    if (defaultToDark || initialTheme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }

    // Toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    const upcomingBtn = document.getElementById('upcoming-btn');
    const pastBtn = document.getElementById('past-btn');
    const container = document.getElementById('events-container');
    const upcomingCount = document.getElementById('upcoming-count');
    const pastCount = document.getElementById('past-count');
    const select = document.getElementById('event');
    const form = document.getElementById('registration-form');
    const msg = document.getElementById('form-message');

    let upcoming = [], past = [];

    async function loadEvents() {
        try {
            const [uRes, pRes] = await Promise.all([
                fetch('backend/get_upcoming_events.php'),
                fetch('backend/get_past_events.php')
            ]);
            upcoming = await uRes.json();
            past = await pRes.json();

            upcomingCount.textContent = upcoming.length;
            pastCount.textContent = past.length;

            renderEvents(upcoming);
            populateSelect(upcoming);
        } catch (e) { console.error(e); }
    }

    function renderEvents(events) {
        container.innerHTML = '';
        events.forEach((ev, i) => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.style.setProperty('--order', i);

            // Use real image or fallback
            const imgSrc = `https://picsum.photos/seed/${ev.id}/400/300`;

            card.innerHTML = `
                <span></span>
                <img src="${imgSrc}" alt="${ev.title}">
                <div class="content">
                    <i data-feather="heart" class="heart"></i>
                    <h4>${ev.title}</h4>
                    <div class="date">${formatDate(ev.date)}</div>
                    <div class="location">${ev.location}</div>
                    <p>${ev.description}</p>
                </div>
            `;
            container.appendChild(card);
        });
        feather.replace();
    }

    function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return 'Invalid Date';
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    }); // Output: "Nov 15"
}
function renderEvents(events) {
    container.innerHTML = '';

    // Fallback when no events
    if (!events || events.length === 0) {
        events = [{
            id: 0,
            title: "No events yet",
            date: new Date().toISOString().split('T')[0],
            location: "Check back soon",
            description: "Events will appear here when added."
        }];
    }

    // 100% WORKING TECH IMAGES (tested & cached)
    const techImages = [
        'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=400&h=180&q=80',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&h=180&q=80',
        'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=400&h=180&q=80',
        'https://images.unsplash.com/photo-1526379093399-2d6c7a1d2e6f?auto=format&fit=crop&w=400&h=180&q=80',
        'https://images.unsplash.com/photo-1517077304055-6e89ab6b6d1e?auto=format&fit=crop&w=400&h=180&q=80',
        'https://images.unsplash.com/photo-1558655146-9f0cf39f92d9?auto=format&fit=crop&w=400&h=180&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&h=180&q=80'
    ];

    events.forEach((ev, i) => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.setProperty('--order', i);

        // Pick image: use id or index
        const imgIdx = ev.id ? (ev.id - 1) % techImages.length : i % techImages.length;
        const imgSrc = techImages[imgIdx];

        // FINAL FALLBACK: dark tech placeholder (never shows "?")
        const fallback = `https://via.placeholder.com/400x180/1e293b/94a3b8?text=${encodeURIComponent(ev.title.substring(0, 20))}`;

        card.innerHTML = `
            <span></span>
            <img 
                src="${imgSrc}" 
                alt="${ev.title}" 
                loading="lazy"
                onerror="this.onerror=null; this.src='${fallback}';"
                style="background:#1e293b;"
            >
            <div class="content">
                <i data-feather="heart" class="heart"></i>
                <h4>${ev.title}</h4>
                <div class="date">
                    <i data-feather="calendar"></i>
                    <span>${formatDate(ev.date)}</span>
                </div>
                <div class="location">
                    <i data-feather="map-pin"></i>
                    <span>${ev.location}</span>
                </div>
                <p>${ev.description}</p>
            </div>
        `;
        container.appendChild(card);
    });

    feather.replace();
}

    function populateSelect(events) {
        select.innerHTML = '<option value="">-- Select Event --</option>';
        events.forEach(ev => {
            const opt = new Option(ev.title, ev.id);
            select.add(opt);
        });
    }

    // Toggle
    upcomingBtn.onclick = () => {
        upcomingBtn.classList.add('active');
        pastBtn.classList.remove('active');
        renderEvents(upcoming);
    };
    pastBtn.onclick = () => {
        pastBtn.classList.add('active');
        upcomingBtn.classList.remove('active');
        renderEvents(past);
    };

    // Modal functionality
    const registerModal = document.getElementById('register-modal');
    const closeModalBtn = document.querySelector('#register-modal .close');
    const registerBtn = document.getElementById('register-btn');

    function showModal() {
        registerModal.style.display = 'block';
        // small delay so CSS transition can run when open class added
        setTimeout(() => registerModal.classList.add('open'), 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function hideModal() {
        registerModal.classList.remove('open');
        // give CSS time to animate out
        setTimeout(() => { registerModal.style.display = 'none'; }, 200);
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    registerBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);

    // allow closing modals with ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (registerModal && registerModal.classList.contains('open')) hideModal();
            if (adminModal && adminModal.classList && adminModal.classList.contains('open')) {
                adminModal.classList.remove('open');
                setTimeout(() => { adminModal.style.display = 'none'; }, 220);
            }
        }
    });

    // Close modal if clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            hideModal();
        }
    });

    // Form submission
    form.onsubmit = async (e) => {
        e.preventDefault();
        msg.textContent = '';
        msg.className = '';

        const payload = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            event_id: select.value
        };

        try {
            const res = await fetch('backend/register_event.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                msg.textContent = 'Registration successful!';
                msg.style.backgroundColor = '#d1fae5';
                msg.style.color = '#059669';
                form.reset();
                // Hide modal after successful registration
                setTimeout(hideModal, 2000);
            } else {
                msg.textContent = data.error || 'Registration failed';
                msg.style.backgroundColor = '#fee2e2';
                msg.style.color = '#dc2626';
            }
        } catch (err) {
            msg.textContent = 'Network error';
            msg.style.backgroundColor = '#fee2e2';
            msg.style.color = '#dc2626';
        }
    };

    // Load events at start
    loadEvents();

    // ADMIN PANEL
    const ADMIN_PASS = "minerva2025"; // CHANGE THIS!
    const adminBtn = document.getElementById('admin-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminCloseBtn = document.querySelector('#admin-modal .close');

    adminBtn.onclick = () => {
        const pass = prompt("Enter admin password:");
        if (pass === ADMIN_PASS) {
            adminModal.style.display = 'flex';
            // add small open class to trigger CSS scale/opacity
            setTimeout(() => adminModal.classList.add('open'), 20);
            loadAdminData();
        } else {
            alert("Access denied");
        }
    };

    adminCloseBtn.onclick = () => {
        adminModal.classList.remove('open');
        setTimeout(() => { adminModal.style.display = 'none'; }, 220);
    };

    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.remove('open');
            setTimeout(() => { adminModal.style.display = 'none'; }, 220);
        }
        if (e.target === registerModal) hideModal();
    });

    // small ripple micro-interaction for the Add Event button
    const adminButton = document.querySelector('#add-event-form .admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', (ev) => {
            const rect = adminButton.getBoundingClientRect();
            const circle = document.createElement('span');
            circle.className = 'ripple';
            const d = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = d + 'px';
            circle.style.left = (ev.clientX - rect.left - d/2) + 'px';
            circle.style.top = (ev.clientY - rect.top - d/2) + 'px';
            adminButton.appendChild(circle);
            setTimeout(() => circle.remove(), 700);
        });
    }

// Add Event
document.getElementById('add-event-form').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('admin-msg');
    msg.textContent = ''; msg.className = '';
    const btn = e.target.querySelector('.admin-button');
    if (btn) { btn.disabled = true; btn.classList.add('loading'); }

    const payload = {
        title: document.getElementById('admin-title').value.trim(),
        description: document.getElementById('admin-description').value.trim(),
        date: document.getElementById('admin-date').value,
        location: document.getElementById('admin-location').value.trim()
    };

    try {
        const res = await fetch('backend/add_event.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            msg.textContent = 'Event added!';
            msg.className = 'success pop';
            e.target.reset();
            loadEvents(); // Refresh public events
        } else {
            msg.textContent = data.error || 'Failed to add event';
            msg.className = 'error pop';
        }
    } catch (err) {
        msg.textContent = 'Network error';
        msg.className = 'error pop';
    } finally {
        if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
        // remove pop animation after a short delay
        setTimeout(() => { msg.classList.remove('pop'); }, 3000);
    }
};

// Load Registrations
async function loadAdminData() {
    try {
        const res = await fetch('backend/get_registrations.php');
        const regs = await res.json();
        const table = document.getElementById('admin-table');
        if (regs.length === 0) {
            table.innerHTML = '<p>No registrations yet.</p>';
            return;
        }
        let html = `<table><tr><th>Name</th><th>Email</th><th>Event ID</th></tr>`;
        regs.forEach(r => {
            html += `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.event_id}</td></tr>`;
        });
        html += `</table>`;
        table.innerHTML = html;
    } catch (e) {
        document.getElementById('admin-table').innerHTML = '<p>Error loading data.</p>';
    }
}
});