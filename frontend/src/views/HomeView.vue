<template>
  <div class="home-page">

    <!-- ── NAVBAR ── -->
    <nav class="navbar" :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">
          <span class="logo-icon">📊</span>
          <span class="logo-text">HalleyX</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/"          class="nav-link" active-class="nav-active">Home</router-link>
          <router-link to="/about"     class="nav-link" active-class="nav-active">About</router-link>
          <router-link to="/dashboard" class="nav-link" active-class="nav-active">Dashboard</router-link>
          <router-link to="/orders"    class="nav-link" active-class="nav-active">Orders</router-link>
        </div>
        <span class="nav-cta" @click="handleGetStarted" style="cursor:pointer">Get Started →</span>
      </div>
    </nav>

    <!-- ══════════════════════════════════════
         SECTION 1 — HERO
         Image: Dark tech / server room
    ══════════════════════════════════════ -->
    <section class="section section-hero">
      <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80&auto=format&fit=crop')"></div>
      <div class="img-overlay overlay-dark"></div>
      <div class="grid-overlay"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="section-content hero-content">
        <div class="hero-badge">📊 Analytics Platform v1.0</div>
        <h1 class="hero-title">
          <span class="title-white">HalleyX</span>
          <span class="title-gradient">Dashboard</span>
        </h1>
        <p class="hero-desc">
          A powerful, real-time customer order management and analytics platform.
          Build custom dashboards, track KPIs, and visualize your business data — all in one place.
        </p>
        <div class="hero-actions">
          <span class="btn-primary" @click="handleGetStarted" style="cursor:pointer">Get Started →</span>
          <router-link to="/dashboard" class="btn-outline">View Dashboard</router-link>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECTION 2 — LIVE STATS
         Image: Abstract data / network nodes
    ══════════════════════════════════════ -->
    <section class="section section-stats">
      <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format&fit=crop')"></div>
      <div class="img-overlay overlay-blue"></div>
      <div class="section-content">
        <div class="section-label">📡 Live Data</div>
        <h2 class="section-title">Real numbers, right now</h2>
        <p class="section-desc">Live statistics pulled directly from your order database</p>
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, i) in liveStats" :key="i" :style="{ animationDelay: i * 0.1 + 's' }">
            <div class="stat-bar-left" :style="{ background: stat.color }"></div>
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-info">
              <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECTION 3 — FEATURES
         Image: Analytics charts on screen
    ══════════════════════════════════════ -->
    <section class="section section-features">
      <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop')"></div>
      <div class="img-overlay overlay-dark-deep"></div>
      <div class="section-content">
        <div class="section-label">⚡ Capabilities</div>
        <h2 class="section-title">Everything you need</h2>
        <p class="section-desc">Built for teams who want powerful analytics without the complexity</p>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon-wrap" :style="{ background: f.bg }">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
            <div class="feature-line" :style="{ background: f.color }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECTION 4 — HOW IT WORKS
         Image: Person working on laptop / workflow
    ══════════════════════════════════════ -->
    <section class="section section-steps">
      <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop')"></div>
      <div class="img-overlay overlay-purple"></div>
      <div class="section-content">
        <div class="section-label">🗺 Guide</div>
        <h2 class="section-title">How it works</h2>
        <p class="section-desc">Get up and running in 3 simple steps</p>
        <div class="steps-row">
          <div class="step-card" v-for="(step, i) in steps" :key="i">
            <div class="step-number">0{{ i + 1 }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECTION 5 — TECH STACK
         Image: Code / programming screen
    ══════════════════════════════════════ -->
    <section class="section section-tech">
      <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80&auto=format&fit=crop')"></div>
      <div class="img-overlay overlay-dark-green"></div>
      <div class="section-content">
        <div class="section-label">🛠 Stack</div>
        <h2 class="section-title">Built with modern tech</h2>
        <p class="section-desc">Industry standard tools trusted by top engineering teams</p>
        <div class="tech-grid">
          <div class="tech-card" v-for="tech in techStack" :key="tech.name">
            <div class="tech-glyph">{{ tech.icon }}</div>
            <div class="tech-name">{{ tech.name }}</div>
            <div class="tech-role">{{ tech.role }}</div>
            <div class="tech-bar" :style="{ background: tech.color }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECTION 6 — CTA
         Image: City lights / success / growth
    ══════════════════════════════════════ -->
    <section class="section section-cta">
      <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&auto=format&fit=crop')"></div>
      <div class="img-overlay overlay-cta"></div>
      <div class="section-content cta-content">
        <div class="section-label">🚀 Ready?</div>
        <h2 class="cta-title">Start building your<br>analytics dashboard today</h2>
        <p class="cta-desc">Turn your order data into powerful insights with HalleyX</p>
        <div class="cta-actions">
          <span class="btn-primary btn-lg" @click="handleGetStarted" style="cursor:pointer">Get Started Free →</span>
          <router-link to="/about" class="btn-outline btn-lg">Learn More</router-link>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span>📊</span>
          <span class="logo-text">HalleyX Dashboard</span>
        </div>
        <div class="footer-links">
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
          <router-link to="/orders">Orders</router-link>
        </div>
        <div class="footer-copy">© 2026 HalleyX. All rights reserved.</div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router     = useRouter()
const isScrolled = ref(false)

function onScroll() { isScrolled.value = window.scrollY > 40 }

/* ── Smart "Get Started" — if already logged in go to dashboard ── */
function handleGetStarted() {
  const isLoggedIn = localStorage.getItem("halleyx_auth") === "true"
  if (isLoggedIn) {
    router.push("/dashboard")
  } else {
    router.push("/login")
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll)
  fetchStats()
})
onUnmounted(() => window.removeEventListener("scroll", onScroll))

const liveStats = ref([
  { icon: "📦", label: "Total Orders",  value: "—", color: "#3b82f6" },
  { icon: "⏳", label: "Pending",       value: "—", color: "#f59e0b" },
  { icon: "⚡", label: "In Progress",   value: "—", color: "#6366f1" },
  { icon: "✅", label: "Completed",     value: "—", color: "#10b981" },
  { icon: "💰", label: "Total Revenue", value: "—", color: "#ec4899" },
])
async function fetchStats() {
  try {
    const res = await axios.get("http://localhost:5000/orders")
    const o = res.data
    liveStats.value[0].value = o.length
    liveStats.value[1].value = o.filter(x => x.status === "Pending").length
    liveStats.value[2].value = o.filter(x => x.status === "In progress").length
    liveStats.value[3].value = o.filter(x => x.status === "Completed").length
    liveStats.value[4].value = "$" + o.reduce((s,x) => s+(x.total||0),0).toLocaleString()
  } catch {}
}

const features = [
  { icon:"📊", title:"Custom Dashboards",    desc:"Drag and drop widgets to build your perfect analytics view with charts, KPIs and tables.",   bg:"rgba(59,130,246,0.2)",  color:"#3b82f6" },
  { icon:"📋", title:"Order Management",     desc:"Full CRUD for customer orders with validation, real-time search and status tracking.",         bg:"rgba(99,102,241,0.2)",  color:"#6366f1" },
  { icon:"📈", title:"5 Chart Types",        desc:"Bar, Line, Area, Scatter and Pie charts powered by Chart.js — always connected to live data.", bg:"rgba(16,185,129,0.2)",  color:"#10b981" },
  { icon:"🔢", title:"KPI Cards",            desc:"Monitor Total Revenue, Order Count and Averages with fully configurable KPI widgets.",         bg:"rgba(245,158,11,0.2)",  color:"#f59e0b" },
  { icon:"🔍", title:"Smart Date Filtering", desc:"Filter all dashboard data by Today, Last 7, 30 or 90 days or view All time instantly.",        bg:"rgba(236,72,153,0.2)",  color:"#ec4899" },
  { icon:"📱", title:"Fully Responsive",     desc:"Adaptive 12 / 8 / 4 column grid that works on Desktop, Tablet and Mobile perfectly.",         bg:"rgba(139,92,246,0.2)",  color:"#8b5cf6" },
]

const steps = [
  { icon:"➕", title:"Add Orders",  desc:"Create customer orders with full billing and product information using the clean popup form" },
  { icon:"⚙️", title:"Configure",   desc:"Drag widgets onto your canvas, configure axes, metrics, colors and table columns per widget" },
  { icon:"📊", title:"Analyze",     desc:"View your live dashboard with charts and KPIs — filter by any date range to drill into insights" },
]

const techStack = [
  { icon:"💚", name:"Vue 3",    role:"Frontend framework",  color:"#42d392" },
  { icon:"⚡", name:"Vite",     role:"Build tool",          color:"#f59e0b" },
  { icon:"📊", name:"Chart.js", role:"Data visualization",  color:"#ff6384" },
  { icon:"🟢", name:"Node.js",  role:"Runtime environment", color:"#68a063" },
  { icon:"🚂", name:"Express",  role:"REST API server",     color:"#94a3b8" },
  { icon:"🍃", name:"MongoDB",  role:"NoSQL database",      color:"#10b981" },
  { icon:"🗄️", name:"Mongoose", role:"Schema modeling",     color:"#e74c3c" },
  { icon:"🔗", name:"Axios",    role:"HTTP client",         color:"#5a67d8" },
]
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.home-page { background: #080d1a; color: #e2e8f0; overflow-x: hidden; }

/* ── NAVBAR ── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  transition: all 0.3s ease;
}
.navbar.scrolled {
  background: rgba(8,13,26,0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 30px rgba(0,0,0,0.4);
}
.nav-inner {
  max-width: 1280px; margin: 0 auto; padding: 0 32px;
  height: 68px; display: flex; align-items: center; gap: 24px;
}
.nav-logo  { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
.logo-icon { font-size: 22px; }
.logo-text { font-size: 18px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
.nav-links { display: flex; gap: 4px; flex: 1; }
.nav-link  { padding: 7px 14px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.65); transition: all 0.2s; }
.nav-link:hover  { color: #fff; background: rgba(255,255,255,0.1); }
.nav-active      { color: #fff !important; background: rgba(255,255,255,0.12) !important; }
.nav-cta { padding: 9px 20px; border-radius: 9px; background: linear-gradient(135deg,#3b82f6,#6366f1); color: white; text-decoration: none; font-size: 13px; font-weight: 700; transition: opacity 0.2s, transform 0.2s; flex-shrink: 0; }
.nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

/* ── SHARED SECTION ── */
.section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── IMAGE BACKGROUND (parallax effect) ── */
.img-bg {
  position: absolute;
  inset: -60px;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: 0;
  transition: transform 0.1s linear;
}

/* ── OVERLAYS — one per section ── */
.img-overlay {
  position: absolute; inset: 0; z-index: 1;
}
.overlay-dark       { background: linear-gradient(135deg, rgba(8,13,26,0.88) 0%, rgba(8,13,26,0.75) 100%); }
.overlay-blue       { background: linear-gradient(135deg, rgba(5,15,40,0.9) 0%, rgba(15,30,70,0.85) 100%); }
.overlay-dark-deep  { background: linear-gradient(135deg, rgba(5,10,20,0.92) 0%, rgba(10,20,40,0.88) 100%); }
.overlay-purple     { background: linear-gradient(135deg, rgba(15,10,40,0.9) 0%, rgba(30,15,60,0.85) 100%); }
.overlay-dark-green { background: linear-gradient(135deg, rgba(5,20,15,0.92) 0%, rgba(5,25,20,0.88) 100%); }
.overlay-cta        { background: linear-gradient(135deg, rgba(8,13,26,0.85) 0%, rgba(20,15,50,0.82) 100%); }

/* Grid overlay on hero */
.grid-overlay {
  position: absolute; inset: 0; z-index: 2;
  background-image:
    linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
  background-size: 64px 64px;
}
.orb { position: absolute; border-radius: 50%; filter: blur(100px); z-index: 2; }
.orb-1 { width: 600px; height: 600px; background: rgba(59,130,246,0.15); top: -200px; right: -100px; animation: floatOrb 8s ease-in-out infinite; }
.orb-2 { width: 400px; height: 400px; background: rgba(99,102,241,0.12); bottom: -100px; left: -100px; animation: floatOrb 10s ease-in-out infinite 3s; }
@keyframes floatOrb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }

/* ── SECTION CONTENT ── */
.section-content {
  position: relative; z-index: 3;
  width: 100%; max-width: 1280px;
  margin: 0 auto; padding: 120px 32px 90px;
}
.section-label {
  display: inline-block; padding: 5px 14px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
  color: #60a5fa; background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25);
  margin-bottom: 16px;
}
.section-title { font-size: clamp(32px,5vw,54px); font-weight: 800; color: #fff; margin: 0 0 16px; letter-spacing: -1px; text-shadow: 0 2px 20px rgba(0,0,0,0.5); }
.section-desc  { font-size: 17px; color: rgba(255,255,255,0.55); margin: 0 0 48px; max-width: 520px; line-height: 1.7; }

/* ══════════════════
   HERO
══════════════════ */
.hero-content { text-align: center; padding-top: 150px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 18px; border-radius: 24px; margin-bottom: 28px;
  border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08);
  font-size: 13px; color: rgba(255,255,255,0.8); backdrop-filter: blur(10px);
}
.hero-title {
  display: flex; flex-direction: column; align-items: center;
  font-size: clamp(64px,10vw,108px); font-weight: 900;
  line-height: 0.95; margin: 0 0 28px; letter-spacing: -4px;
}
.title-white    { color: #fff; text-shadow: 0 0 80px rgba(59,130,246,0.4); }
.title-gradient {
  background: linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#a78bfa 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-desc { font-size: 19px; color: rgba(255,255,255,0.65); line-height: 1.75; margin: 0 auto 40px; max-width: 600px; }
.hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

/* ══════════════════
   STATS
══════════════════ */
.stats-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; }
.stat-card {
  position: relative; overflow: hidden;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px; padding: 24px 18px;
  display: flex; align-items: center; gap: 14px;
  backdrop-filter: blur(12px);
  transition: transform 0.25s, background 0.25s;
  animation: slideUp 0.5s ease both;
}
.stat-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.12); }
.stat-bar-left { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
.stat-icon  { font-size: 28px; flex-shrink: 0; }
.stat-value { font-size: 30px; font-weight: 800; line-height: 1; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }
@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

/* ══════════════════
   FEATURES
══════════════════ */
.features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.feature-card {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 18px; padding: 28px; transition: all 0.25s;
  backdrop-filter: blur(12px);
}
.feature-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.feature-icon-wrap { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
.feature-card h3 { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 10px; }
.feature-card p  { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.65; margin: 0 0 20px; }
.feature-line    { height: 2px; border-radius: 2px; width: 40px; }

/* ══════════════════
   HOW IT WORKS
══════════════════ */
.steps-row {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 20px; align-items: stretch;
}
.step-card {
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px; padding: 36px 28px; text-align: center;
  transition: all 0.25s; backdrop-filter: blur(14px);
  display: flex; flex-direction: column; align-items: center;
}
.step-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); }
.step-number { font-size: 52px; font-weight: 900; letter-spacing: -2px; color: rgba(255,255,255,0.07); margin-bottom: 12px; line-height: 1; }
.step-icon   { font-size: 36px; margin-bottom: 16px; }
.step-card h3 { font-size: 19px; font-weight: 700; color: #fff; margin: 0 0 12px; }
.step-card p  { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.65; margin: 0; }

/* ══════════════════
   TECH STACK
══════════════════ */
.tech-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.tech-card {
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 24px 20px; text-align: center;
  transition: all 0.25s; backdrop-filter: blur(12px);
}
.tech-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.12); }
.tech-glyph { font-size: 32px; margin-bottom: 10px; }
.tech-name  { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.tech-role  { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 14px; }
.tech-bar   { height: 2px; border-radius: 2px; width: 40px; margin: 0 auto; }

/* ══════════════════
   CTA
══════════════════ */
.cta-content { text-align: center; }
.cta-title { font-size: clamp(36px,5vw,64px); font-weight: 900; color: #fff; margin: 0 0 20px; letter-spacing: -2px; line-height: 1.1; text-shadow: 0 2px 40px rgba(0,0,0,0.5); }
.cta-desc  { font-size: 18px; color: rgba(255,255,255,0.55); margin: 0 auto 40px; max-width: 480px; line-height: 1.7; }
.cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

/* ── Buttons ── */
.btn-primary {
  display: inline-block; background: linear-gradient(135deg,#3b82f6,#6366f1);
  color: white; text-decoration: none; padding: 13px 28px; border-radius: 12px;
  font-size: 15px; font-weight: 700; transition: transform 0.2s, opacity 0.2s;
  box-shadow: 0 8px 32px rgba(59,130,246,0.35);
}
.btn-primary:hover { transform: translateY(-2px); opacity: 0.9; }
.btn-outline {
  display: inline-block; background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.85); text-decoration: none; padding: 13px 28px; border-radius: 12px;
  font-size: 15px; font-weight: 600; border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.2s; backdrop-filter: blur(10px);
}
.btn-outline:hover { background: rgba(255,255,255,0.18); color: #fff; transform: translateY(-2px); }
.btn-lg { padding: 15px 34px; font-size: 16px; border-radius: 13px; }

/* ── FOOTER ── */
.footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 28px 0; background: #050a14; }
.footer-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.footer-brand { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: #475569; }
.footer-links { display: flex; gap: 20px; }
.footer-links a { color: #334155; text-decoration: none; font-size: 14px; transition: color 0.2s; }
.footer-links a:hover { color: #64748b; }
.footer-copy { font-size: 13px; color: #1e293b; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .stats-grid    { grid-template-columns: repeat(3,1fr); }
  .features-grid { grid-template-columns: repeat(2,1fr); }
  .tech-grid     { grid-template-columns: repeat(4,1fr); }
}
@media (max-width: 768px) {
  .stats-grid    { grid-template-columns: repeat(2,1fr); }
  .features-grid { grid-template-columns: 1fr; }
  .steps-row     { grid-template-columns: 1fr; }
  .tech-grid     { grid-template-columns: repeat(2,1fr); }
  .hero-title    { font-size: 52px; letter-spacing: -2px; }
  .nav-links     { display: none; }
  .footer-inner  { flex-direction: column; text-align: center; }
  .img-bg        { background-attachment: scroll; }
}
@media (max-width: 480px) {
  .stats-grid    { grid-template-columns: 1fr 1fr; }
  .hero-title    { font-size: 42px; }
  .section-content { padding: 100px 16px 60px; }
}
</style>