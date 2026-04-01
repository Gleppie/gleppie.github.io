    const projectData = {
        discord: {
            title: "Discord IP Logger",
            notes: "Usage: Replace the placeholder with your specific Discord Webhook URL.",
            code: `// Discord Webhook Logic\nconsole.log("Logger Active");`
        },
    };

    function toggleDropdown(event) {
        event.stopPropagation();
        const dropdown = document.getElementById("toolsDropdown");
        const isShowing = dropdown.classList.toggle("show");
        event.currentTarget.setAttribute('aria-expanded', isShowing);
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropdown-trigger')) {
            const dropdown = document.getElementById("toolsDropdown");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                document.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
            }
        }
    }

    function openSource(id) {
        const project = projectData[id];
        if(!project) return;
        
        document.getElementById('modal-title').innerText = project.title;
        document.getElementById('modal-notes').innerText = project.notes;
        document.getElementById('modal-code').textContent = project.code;
        document.getElementById('source-modal').style.display = 'flex';
        
        // Hide dropdown
        document.getElementById("toolsDropdown").classList.remove("show");
    }

    function closeSource(event) {
        document.getElementById('source-modal').style.display = 'none';
    }

    function filterProjects(area, btn) {
        // UI updates
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtering logic
        document.querySelectorAll('.project-entry').forEach(entry => {
            if (area === 'all' || entry.dataset.area === area) {
                entry.classList.remove('hidden');
            } else {
                entry.classList.add('hidden');
            }
        });
        
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (!sessionStorage.getItem('disclaimerAccepted')) {
            document.getElementById('disclaimer-modal').style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling while active
        }
    });

    function acceptDisclaimer() {
        sessionStorage.setItem('disclaimerAccepted', 'true');
        document.getElementById('disclaimer-modal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

   const iconSet = [
    { name: 'Heart', symbol: '❤️' },
    { name: 'Star', symbol: '⭐' },
    { name: 'Cloud', symbol: '☁️' },
    { name: 'Fire', symbol: '🔥' },
    { name: 'Moon', symbol: '🌙' },
    { name: 'Sun', symbol: '☀️' },
    { name: 'Zap', symbol: '⚡' },
    { name: 'Leaf', symbol: '🍃' }
];

let targetIcon = null;

function initPatternCaptcha() {
    const grid = document.getElementById('iconGrid');
    const prompt = document.getElementById('targetIconName');
    const verifiedInput = document.getElementById('captchaVerified');
    const btn = document.getElementById('footerBtn');
    
    // Reset state
    grid.innerHTML = '';
    verifiedInput.value = "false";
    btn.disabled = true;
    btn.innerText = "Verify to Send";

    // Shuffle and pick 4 random icons
    const shuffled = [...iconSet].sort(() => 0.5 - Math.random()).slice(0, 4);
    targetIcon = shuffled[Math.floor(Math.random() * shuffled.length)];
    prompt.innerText = targetIcon.name;

    shuffled.forEach(icon => {
        const el = document.createElement('div');
        el.className = 'captcha-icon';
        el.innerHTML = icon.symbol;
        el.onclick = () => {
            // Remove previous selections
            document.querySelectorAll('.captcha-icon').forEach(i => i.classList.remove('selected'));
            
            if (icon.name === targetIcon.name) {
                el.classList.add('selected');
                verifiedInput.value = "true";
                btn.disabled = false;
                btn.innerText = "Send to Discord";
            } else {
                // Wrong choice? Reset.
                alert("Verification failed. Try again.");
                initPatternCaptcha();
            }
        };
        grid.appendChild(el);
    });
}

// Load on start
window.addEventListener('DOMContentLoaded', initPatternCaptcha);

async function sendFooterContact() {
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1484599982823706848/cBe7o7RyM5ggCA65irouT2NxozZAEFP0kFWfz5kFM4QIVcaJvLcc-KatXGPr6IH3ukef"; 
    const isVerified = document.getElementById('captchaVerified').value === "true";
    const contact = document.getElementById('footerContact').value;
    const msg = document.getElementById('footerMsg').value;
    const btn = document.getElementById('footerBtn');

    if (!isVerified) return;
    if (!msg) return alert("Message is empty.");

    btn.innerText = "Sending...";
    btn.disabled = true;

    const payload = {
        embeds: [{
            title: "📬 SandBox Contact (Verified)",
            color: 3066993, // Greenish for success
            fields: [
                { name: "From", value: contact || "Anonymous", inline: true },
                { name: "Message", value: msg }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            btn.innerText = "Sent";
            document.getElementById('footerContact').value = "";
            document.getElementById('footerMsg').value = "";
            setTimeout(initPatternCaptcha, 3000); // Reset captcha for next use
        }
    } catch (err) {
        alert("Error sending message.");
        btn.disabled = false;
    }
}
