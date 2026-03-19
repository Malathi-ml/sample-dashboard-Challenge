<template>
  <div class="app-shell">

    <!-- ── SIDEBAR ── -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">

      <!-- Logo -->
      <div class="sidebar-logo">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">📊</span>
          <span class="logo-text" v-show="!sidebarCollapsed">HalleyX</span>
        </router-link>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expand' : 'Collapse'">
          {{ sidebarCollapsed ? '›' : '‹' }}
        </button>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <div class="nav-section-label" v-show="!sidebarCollapsed">Main</div>

        <router-link to="/dashboard" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">⊞</span>
          <span class="nav-label" v-show="!sidebarCollapsed">Dashboard</span>
        </router-link>

        <router-link to="/dashboard-config" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">⚙</span>
          <span class="nav-label" v-show="!sidebarCollapsed">Configure</span>
        </router-link>

        <div class="nav-section-label" v-show="!sidebarCollapsed">Data</div>

        <router-link to="/orders" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">🛒</span>
          <span class="nav-label" v-show="!sidebarCollapsed">Orders</span>
          <span class="nav-badge" v-if="orderCount > 0 && !sidebarCollapsed">{{ orderCount }}</span>
        </router-link>

        <div class="nav-divider"></div>

        <router-link to="/about" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">ℹ</span>
          <span class="nav-label" v-show="!sidebarCollapsed">About</span>
        </router-link>

        <router-link to="/" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">⌂</span>
          <span class="nav-label" v-show="!sidebarCollapsed">Home</span>
        </router-link>
      </nav>

      <!-- Bottom status -->
      <div class="sidebar-bottom" v-show="!sidebarCollapsed">
        <div class="status-row">
          <div class="status-dot"></div>
          <span class="status-text">Server online</span>
        </div>
        <button class="btn-logout" @click="logout">⏻ Logout</button>
      </div>

    </aside>

    <!-- ── MAIN CONTENT ── -->
    <main class="main-content" :class="{ expanded: sidebarCollapsed }">

      <!-- Top bar -->
      <div class="topbar">
        <div class="topbar-left">
          <div class="page-breadcrumb">{{ currentPageName }}</div>
        </div>
        <div class="topbar-right">
          <div class="topbar-stat">
            <span class="stat-dot blue"></span>
            <span>{{ orderCount }} Orders</span>
          </div>
          <div class="topbar-stat">
            <span class="stat-dot green"></span>
            <span>{{ completedCount }} Completed</span>
          </div>
          <div class="topbar-stat">
            <span class="stat-dot amber"></span>
            <span>{{ pendingCount }} Pending</span>
          </div>
        </div>
      </div>

      <!-- Toast Notifications -->
      <transition-group name="toast" tag="div" class="toast-container">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
        >
          <span class="toast-icon">{{ toastIcon(toast.type) }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="removeToast(toast.id)">✕</button>
        </div>
      </transition-group>

      <!-- Page content -->
      <div class="page-content">
        <slot />
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route  = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)
const orders = ref([])

/* ── Fetch order counts ── */
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/orders")
    orders.value = res.data
  } catch {}
})

const orderCount    = computed(() => orders.value.length)
const completedCount = computed(() => orders.value.filter(o => o.status === "Completed").length)
const pendingCount   = computed(() => orders.value.filter(o => o.status === "Pending").length)

/* ── Breadcrumb ── */
const pageNames = {
  "/dashboard":        "Dashboard",
  "/dashboard-config": "Configure Dashboard",
  "/orders":           "Customer Orders",
  "/about":            "About",
  "/":                 "Home",
}
const currentPageName = computed(() => pageNames[route.path] || "Page")

/* ── Toast System ── */
const toasts = ref([])
let toastId = 0

function addToast(message, type = "success") {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 3500)
}
function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}
function toastIcon(type) {
  return { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" }[type] || "✅"
}

/* ── Logout ── */
function logout() {
  localStorage.removeItem("halleyx_auth")
  router.push("/login")
}

/* ── Provide toast to all child pages ── */
provide("toast", addToast)
provide("refreshOrders", async () => {
  try {
    const res = await axios.get("http://localhost:5000/orders")
    orders.value = res.data
  } catch {}
})
</script>

<style scoped>
/* ── Shell ── */
.app-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #0a0f1e;
}

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: #0d1424;
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, min-width 0.25s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 50;
}
.sidebar.collapsed { width: 64px; min-width: 64px; }

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  overflow: hidden;
}
.logo-icon { font-size: 20px; flex-shrink: 0; }
.logo-text  { font-size: 17px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; white-space: nowrap; }
.collapse-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  color: #64748b;
  border-radius: 6px;
  padding: 3px 7px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  line-height: 1;
}
.collapse-btn:hover { color: #e2e8f0; background: rgba(255,255,255,0.08); transform: none; }

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
}
.nav-section-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #334155;
  padding: 10px 8px 4px;
  white-space: nowrap;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 9px;
  text-decoration: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.18s;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: #cbd5e1; }
.nav-item-active {
  background: rgba(59,130,246,0.15) !important;
  color: #60a5fa !important;
  border: 1px solid rgba(59,130,246,0.2);
}
.nav-icon  { font-size: 16px; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-badge {
  background: #3b82f6;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}
.nav-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 6px 8px;
}

.sidebar-bottom {
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }
.status-text { font-size: 12px; color: #475569; }
.btn-logout {
  width: 100%;
  padding: 8px 12px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #f87171;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.btn-logout:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.4); transform: none; }

/* ── Main Content ── */
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
}

/* ── Topbar ── */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.15);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 10px;
}
.page-breadcrumb {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
}
.topbar-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.topbar-stat  { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; }
.stat-dot.blue  { background: #3b82f6; }
.stat-dot.green { background: #10b981; }
.stat-dot.amber { background: #f59e0b; }

/* ── Toast ── */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  min-width: 280px;
  max-width: 380px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  pointer-events: all;
  border: 1px solid rgba(255,255,255,0.08);
}
.toast-success { background: #0f2820; color: #34d399; border-color: rgba(52,211,153,0.2); }
.toast-error   { background: #2a0f0f; color: #f87171; border-color: rgba(248,113,113,0.2); }
.toast-warning { background: #2a1f0a; color: #fbbf24; border-color: rgba(251,191,36,0.2);  }
.toast-info    { background: #0f1a2a; color: #60a5fa; border-color: rgba(96,165,250,0.2);  }
.toast-icon  { font-size: 16px; flex-shrink: 0; }
.toast-msg   { flex: 1; line-height: 1.4; }
.toast-close {
  background: none; border: none; cursor: pointer;
  color: inherit; opacity: 0.6; font-size: 13px;
  padding: 0 2px; transition: opacity 0.2s; flex-shrink: 0;
}
.toast-close:hover { opacity: 1; transform: none; }

/* Toast animation */
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(100%); }
.toast-leave-to     { opacity: 0; transform: translateX(100%); }

/* ── Page content ── */
.page-content { flex: 1; overflow-y: auto; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .sidebar { position: fixed; left: 0; top: 0; z-index: 100; }
  .sidebar.collapsed { width: 0; min-width: 0; }
  .main-content { margin-left: 220px; }
  .main-content.expanded { margin-left: 0; }
  .topbar-right { display: none; }
}
@media (max-width: 480px) {
  .main-content { margin-left: 0; }
}
</style>