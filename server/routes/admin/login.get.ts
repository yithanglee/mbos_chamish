import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login - MBOS Chamish</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 20%, #1e293b, #0f172a, #020617);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f8fafc;
      padding: 1.5rem;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .logo-container {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-container img {
      height: 48px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin-top: 1rem;
      letter-spacing: -0.02em;
    }
    p.subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-top: 0.35rem;
    }
    .badge-neon {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(0, 230, 153, 0.12);
      color: #00e699;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      margin-top: 0.75rem;
      border: 1px solid rgba(0, 230, 153, 0.25);
    }
    .badge-neon::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00e699;
      box-shadow: 0 0 8px #00e699;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #cbd5e1;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.5rem;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;
    }
    input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }
    button.btn-primary {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      color: #fff;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);
    }
    button.btn-primary:hover {
      background: linear-gradient(135deg, #38bdf8, #1d4ed8);
      transform: translateY(-1px);
    }
    .alert-error {
      display: none;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
    .footer-note {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.75rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-container">
      <img src="/img/logo/logo1.png" alt="MBOS Logo" onerror="this.style.display='none'">
      <h1>Admin Portal</h1>
      <p class="subtitle">Product & Website Content Management</p>
      <div><span class="badge-neon">Neon Auth & Database Connected</span></div>
    </div>

    <div id="alertError" class="alert-error"></div>

    <form id="loginForm">
      <div class="form-group">
        <label for="passcode">Admin Passcode / Neon Auth Token</label>
        <input type="password" id="passcode" placeholder="Enter admin passcode or API key" required autofocus>
      </div>

      <button type="submit" class="btn-primary" id="submitBtn">Sign In</button>
    </form>

    <div class="footer-note">
      Connected to Neon Postgres &bull; Edge Nitro SSR
    </div>
  </div>

  <script>
    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('alertError');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.style.display = 'none';
      submitBtn.textContent = 'Verifying...';
      submitBtn.disabled = true;

      const passcode = document.getElementById('passcode').value.trim();

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: passcode, apiKey: passcode })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          window.location.href = '/admin';
        } else {
          alertBox.textContent = data.statusMessage || data.message || 'Invalid passcode. Please try again.';
          alertBox.style.display = 'block';
        }
      } catch (err) {
        alertBox.textContent = 'Network or connection error. Please try again.';
        alertBox.style.display = 'block';
      } finally {
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
      }
    });
  </script>
</body>
</html>`;
});
