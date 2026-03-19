<template>
  <div class="notfound-page">
    <div class="notfound-content">
      <div class="error-code">404</div>
      <div class="error-icon">🔍</div>
      <h1>Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
      <div class="notfound-actions">
        <router-link to="/" class="btn-home">← Go Home</router-link>
        <router-link to="/dashboard" class="btn-dash">Open Dashboard</router-link>
      </div>
      <div class="quick-links">
        <span class="ql-label">Quick links:</span>
        <router-link to="/orders" class="ql-link">Orders</router-link>
        <router-link to="/about" class="ql-link">About</router-link>
      </div>
    </div>
    <div class="bg-glow"></div>
  </div>
</template>

<script setup></script>

<style scoped>
.notfound-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  padding: 40px 24px;
}
.bg-glow {
  position: absolute;
  width: 600px; height: 600px;
  background: rgba(99,102,241,0.12);
  border-radius: 50%;
  filter: blur(100px);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.notfound-content { position: relative; z-index: 1; max-width: 480px; animation: fadeUp 0.6s ease both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -4px;
}
.error-icon { font-size: 48px; margin-bottom: 16px; }
.notfound-content h1 { font-size: 28px; font-weight: 700; color: #f1f5f9; margin: 0 0 12px; }
.notfound-content p  { font-size: 16px; color: #64748b; line-height: 1.6; margin: 0 0 32px; }

.notfound-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
.btn-home {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 10px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  color: #e2e8f0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-home:hover { background: rgba(255,255,255,0.12); }
.btn-dash {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}
.btn-dash:hover { opacity: 0.88; }

.quick-links { display: flex; align-items: center; gap: 10px; justify-content: center; flex-wrap: wrap; }
.ql-label { font-size: 13px; color: #475569; }
.ql-link  { font-size: 13px; color: #60a5fa; text-decoration: none; padding: 4px 10px; border-radius: 6px; background: rgba(59,130,246,0.1); transition: background 0.2s; }
.ql-link:hover { background: rgba(59,130,246,0.2); }
</style>