<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-glow glow-1"></div>
      <div class="bg-glow glow-2"></div>
      <div class="grid-lines"></div>
    </div>

    <div class="login-left">
      <div class="brand">
        <span class="brand-icon">📊</span>
        <span class="brand-name">HalleyX</span>
      </div>
      <div class="left-content">
        <h1>Welcome back</h1>
        <p>Sign in to access your analytics dashboard and manage customer orders.</p>
        <div class="feature-list">
          <div class="feature-item" v-for="f in features" :key="f">
            <span class="check">✓</span>
            <span>{{ f }}</span>
          </div>
        </div>
      </div>
      <div class="left-footer">© 2026 HalleyX Dashboard</div>
    </div>

    <div class="login-right">
      <div class="login-card">
        <div class="card-header">
          <h2>Sign in</h2>
          <p>Enter your credentials to continue</p>
        </div>

        <div class="form-group">
          <label>Email address</label>
          <div class="input-wrap">
            <span class="input-icon">✉</span>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :class="{ 'has-error': errors.email }"
              @keyup.enter="handleLogin"
            />
          </div>
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              :class="{ 'has-error': errors.password }"
              @keyup.enter="handleLogin"
            />
            <button class="eye-btn" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="form-hint">
          <span>Demo credentials:</span>
          <code>admin@halleyx.com</code>
          <span>/</span>
          <code>admin123</code>
        </div>

        <button class="btn-login" @click="handleLogin" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Sign in →</span>
        </button>

        <div v-if="loginError" class="login-error">
          ❌ {{ loginError }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router   = useRouter()
const email    = ref("")
const password = ref("")
const loading  = ref(false)
const showPassword = ref(false)
const loginError   = ref("")
const errors = ref({ email: "", password: "" })

const features = [
  "Custom drag-and-drop dashboard builder",
  "Real-time order management & tracking",
  "5 chart types with live data",
  "Responsive across all devices",
]

function validate() {
  errors.value = { email: "", password: "" }
  let valid = true
  if (!email.value)    { errors.value.email    = "Email is required";    valid = false }
  if (!password.value) { errors.value.password = "Password is required"; valid = false }
  return valid
}

async function handleLogin() {
  if (!validate()) return
  loading.value    = true
  loginError.value = ""

  await new Promise(r => setTimeout(r, 800))

  if (email.value === "admin@halleyx.com" && password.value === "admin123") {
    localStorage.setItem("halleyx_auth", "true")
    router.push("/dashboard")
  } else {
    loginError.value = "Invalid email or password. Use the demo credentials."
  }
  loading.value = false
}
</script>

<style scoped>
* { box-sizing: border-box; }
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  background: #0a0f1e;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
}

/* BG */
.login-bg { position: absolute; inset: 0; z-index: 0; }
.bg-glow  { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.15; }
.glow-1   { width: 600px; height: 600px; background: #3b82f6; top: -200px; left: -100px; }
.glow-2   { width: 500px; height: 500px; background: #6366f1; bottom: -150px; right: -100px; }
.grid-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Left panel */
.login-left {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.brand { display: flex; align-items: center; gap: 10px; margin-bottom: auto; }
.brand-icon { font-size: 24px; }
.brand-name { font-size: 20px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
.left-content { margin: auto 0; }
.left-content h1 { font-size: 42px; font-weight: 800; color: #f1f5f9; margin: 0 0 16px; letter-spacing: -1px; }
.left-content p  { font-size: 16px; color: #64748b; line-height: 1.7; margin: 0 0 32px; max-width: 380px; }
.feature-list { display: flex; flex-direction: column; gap: 12px; }
.feature-item { display: flex; align-items: center; gap: 12px; font-size: 15px; color: #94a3b8; }
.check { width: 22px; height: 22px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #10b981; flex-shrink: 0; }
.left-footer { font-size: 13px; color: #334155; margin-top: auto; padding-top: 32px; }

/* Right panel */
.login-right {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  position: relative;
  z-index: 1;
}
.login-card { width: 100%; max-width: 380px; }
.card-header { margin-bottom: 32px; }
.card-header h2 { font-size: 28px; font-weight: 800; color: #f1f5f9; margin: 0 0 8px; }
.card-header p  { font-size: 14px; color: #64748b; margin: 0; }

/* Form */
.form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: #94a3b8; }
.input-wrap {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.input-wrap:focus-within { border-color: #3b82f6; }
.input-icon { padding: 0 12px; font-size: 14px; color: #475569; flex-shrink: 0; }
.input-wrap input {
  flex: 1; padding: 12px 0; background: transparent;
  border: none; outline: none; color: #e2e8f0; font-size: 14px;
}
.input-wrap input.has-error { color: #f87171; }
.input-wrap input::placeholder { color: #334155; }
.eye-btn { background: none; border: none; padding: 0 12px; cursor: pointer; font-size: 14px; color: #475569; transition: color 0.2s; }
.eye-btn:hover { color: #94a3b8; transform: none; }
.error-text { font-size: 12px; color: #f87171; }

/* Demo hint */
.form-hint {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.15);
  border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #64748b;
  margin-bottom: 20px;
}
.form-hint code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: #60a5fa; font-size: 12px; }

/* Login button */
.btn-login {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-login:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-error {
  margin-top: 14px; padding: 10px 14px; border-radius: 8px;
  background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2);
  font-size: 13px; color: #f87171; text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .login-left  { display: none; }
  .login-right { width: 100%; padding: 32px 20px; }
}
</style>