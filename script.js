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
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1498764398968438815/jnI87xt5Sc6sppqXuQrpXhgRhytxCiP7L_OmXQD-zFkcTF5wj1PDA0vUywqp6P2-uMP5"; 
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
            title: "New Message",
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


//Quick Paste
    const textarea = document.getElementById('textInput');
    const charCountDisplay = document.getElementById('charCount');

    // Live character count
    textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        charCountDisplay.innerText = `${count.toLocaleString()} Characters`;
    });

    function downloadFile() {
        const textContent = textarea.value;
        if (!textContent) {
            alert("Please enter some text first.");
            return;
        }
        
        const blob = new Blob([textContent], { type: 'text/plain' });
        const link = document.createElement('a');
        
        // Dynamic filename based on first line or timestamp
        const timestamp = new Date().toISOString().slice(0,10);
        link.download = `paste_${timestamp}.txt`;
        
        link.href = window.URL.createObjectURL(blob);
        link.click();
        window.URL.revokeObjectURL(link.href);
    }


   
