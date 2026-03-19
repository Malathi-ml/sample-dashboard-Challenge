<template>
  <Layout>
    <div class="about-page">

      <!-- ══════════════════════════════════
           BLOCK 1 — HERO
           Image: Dark office / workspace
      ══════════════════════════════════ -->
      <div class="about-block block-hero">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-hero"></div>
        <div class="block-content text-center">
          <div class="about-badge">About This Project</div>
          <h1>HalleyX Dashboard</h1>
          <p class="hero-sub">A full-stack customer order management and analytics platform built with Vue 3, Node.js, Express and MongoDB.</p>
          <div class="hero-stat-row">
            <div class="hs" v-for="s in heroStats" :key="s.label">
              <span class="hs-val" :style="{ color: s.color }">{{ s.val }}</span>
              <span class="hs-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           BLOCK 2 — WHAT IS IT
           Image: Analytics / data on screen
      ══════════════════════════════════ -->
      <div class="about-block block-what">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-blue"></div>
        <div class="block-content">
          <div class="block-label">🎯 Overview</div>
          <h2>What is HalleyX Dashboard?</h2>
          <div class="what-body">
            <div class="what-text">
              <p>HalleyX Dashboard is a custom analytics and order management platform designed to help businesses track, manage, and visualize their customer orders in real time.</p>
              <p>Users can create personalized dashboards by dragging and dropping widgets — including charts, KPI cards, and data tables — all powered by live order data from the backend API.</p>
              <p>The platform features a fully configurable dashboard builder, complete CRUD order management, date range filtering, and responsive design across all screen sizes.</p>
            </div>
            <div class="what-highlights">
              <div class="highlight-item" v-for="h in highlights" :key="h.text">
                <span class="hi-dot" :style="{ background: h.color }"></span>
                <span>{{ h.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           BLOCK 3 — KEY FEATURES
           Image: Purple tech / neon
      ══════════════════════════════════ -->
      <div class="about-block block-features">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-purple"></div>
        <div class="block-content">
          <div class="block-label">⚡ Features</div>
          <h2>Key Features</h2>
          <div class="features-list">
            <div class="feat-item" v-for="f in keyFeatures" :key="f.title">
              <div class="feat-left">
                <div class="feat-num" :style="{ background: f.color + '22', color: f.color, borderColor: f.color + '44' }">{{ f.num }}</div>
              </div>
              <div class="feat-icon-box" :style="{ background: f.color + '18' }">{{ f.icon }}</div>
              <div class="feat-right">
                <strong>{{ f.title }}</strong>
                <p>{{ f.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           BLOCK 4 — TECH STACK
           Image: Code editor green
      ══════════════════════════════════ -->
      <div class="about-block block-tech">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-dark"></div>
        <div class="block-content">
          <div class="block-label">🛠 Technology</div>
          <h2>Tech Stack</h2>
          <div class="tech-layers">
            <div class="tech-layer-group" v-for="layer in techLayers" :key="layer.name">
              <div class="layer-title">
                <span class="layer-dot" :style="{ background: layer.color }"></span>
                {{ layer.name }}
              </div>
              <div class="layer-cards">
                <div class="tech-card" v-for="t in layer.items" :key="t.name">
                  <div class="tech-glyph">{{ t.icon }}</div>
                  <div class="tech-name">{{ t.name }}</div>
                  <div class="tech-desc">{{ t.desc }}</div>
                  <div class="tech-bar" :style="{ background: layer.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           BLOCK 5 — TEAM
           Image: Team / people working
      ══════════════════════════════════ -->
      <div class="about-block block-team">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-team"></div>
        <div class="block-content">
          <div class="block-label">👥 Team</div>
          <h2>Meet the Team</h2>
          <div class="team-grid">
            <div class="team-card" v-for="m in team" :key="m.name">
              <div class="team-avatar" :style="{ background: m.color }">{{ m.initials }}</div>
              <div class="team-info">
                <div class="team-name">{{ m.name }}</div>
                <div class="team-role">{{ m.role }}</div>
                <div class="team-dept">
                  <span class="dept-badge" :style="{ background: m.deptColor + '22', color: m.deptColor, borderColor: m.deptColor + '44' }">{{ m.dept }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           BLOCK 6 — PROJECT JOURNEY (Timeline)
           Image: Night sky / journey
      ══════════════════════════════════ -->
      <div class="about-block block-timeline">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-night"></div>
        <div class="block-content">
          <div class="block-label">🗓 Journey</div>
          <h2>Project Timeline</h2>
          <div class="timeline">
            <div class="timeline-item" v-for="(t, i) in timeline" :key="i" :class="{ right: i % 2 !== 0 }">
              <div class="tl-dot" :style="{ background: t.color }"></div>
              <div class="tl-card">
                <div class="tl-phase" :style="{ color: t.color }">{{ t.phase }}</div>
                <h3>{{ t.title }}</h3>
                <p>{{ t.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════
           BLOCK 7 — STATS + CTA
           Image: City skyline / achievement
      ══════════════════════════════════ -->
      <div class="about-block block-stats">
        <div class="img-bg" style="background-image: url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&auto=format&fit=crop')"></div>
        <div class="img-overlay overlay-cta"></div>
        <div class="block-content text-center">
          <div class="block-label">📊 Numbers</div>
          <h2>Project at a Glance</h2>
          <div class="pstats-grid">
            <div class="pstat-card" v-for="s in projectStats" :key="s.label">
              <div class="pstat-val" :style="{ color: s.color }">{{ s.value }}</div>
              <div class="pstat-label">{{ s.label }}</div>
            </div>
          </div>
          <router-link to="/dashboard" class="btn-cta">Explore Dashboard →</router-link>
        </div>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import Layout from "../components/Layout.vue"

const heroStats = [
  { val: "6",    label: "Pages",         color: "#3b82f6" },
  { val: "5",    label: "Chart Types",   color: "#10b981" },
  { val: "7",    label: "Widget Types",  color: "#f59e0b" },
  { val: "100%", label: "Responsive",    color: "#8b5cf6" },
]

const highlights = [
  { text: "Drag-and-drop dashboard builder with 12-column grid",    color: "#3b82f6" },
  { text: "5 chart types powered by Chart.js",                      color: "#10b981" },
  { text: "Real-time order CRUD with per-field validation",         color: "#6366f1" },
  { text: "Date range filtering across all widgets instantly",      color: "#f59e0b" },
  { text: "Responsive across Desktop, Tablet and Mobile",           color: "#ec4899" },
  { text: "Export all orders to CSV with one click",                color: "#8b5cf6" },
]

const keyFeatures = [
  { num:"01", icon:"📊", title:"Custom Dashboard Builder",      desc:"Drag and drop widgets onto a 12-column canvas. Configure each with its own metrics, axes, colors and filters.",    color:"#3b82f6" },
  { num:"02", icon:"📋", title:"Customer Order Management",     desc:"Full CRUD with per-field validation, search, status filtering, delete confirmation and CSV export.",              color:"#6366f1" },
  { num:"03", icon:"📈", title:"Real-time Data Visualization",  desc:"Bar, Line, Area, Scatter and Pie charts via Chart.js — all connected to live MongoDB order data.",               color:"#10b981" },
  { num:"04", icon:"🔢", title:"KPI Cards",                     desc:"Configurable KPI widgets with Sum, Average and Count aggregation. Number and Currency display formats.",          color:"#f59e0b" },
  { num:"05", icon:"🔍", title:"Date Range Filtering",          desc:"Filter all dashboard data by All time, Today, Last 7, 30 or 90 days. Applies instantly across all widgets.",     color:"#ec4899" },
  { num:"06", icon:"📱", title:"Responsive Design",             desc:"12-column desktop, 8-column tablet, 4-column mobile. Widgets reflow and stack automatically.",                   color:"#8b5cf6" },
]

const techLayers = [
  {
    name: "Frontend", color: "#3b82f6",
    items: [
      { icon:"💚", name:"Vue 3",    desc:"Composition API + Vue Router" },
      { icon:"⚡", name:"Vite",     desc:"Fast build tool & dev server"  },
      { icon:"📊", name:"Chart.js", desc:"5 chart types visualization"   },
      { icon:"🔗", name:"Axios",    desc:"HTTP client for API calls"      },
    ]
  },
  {
    name: "Backend", color: "#10b981",
    items: [
      { icon:"🟢", name:"Node.js",  desc:"JavaScript runtime"            },
      { icon:"🚂", name:"Express",  desc:"REST API — CRUD endpoints"      },
    ]
  },
  {
    name: "Database", color: "#f59e0b",
    items: [
      { icon:"🍃", name:"MongoDB",  desc:"NoSQL document database"        },
      { icon:"🗄️", name:"Mongoose", desc:"Schema modeling & validation"   },
    ]
  },
]

const team = [
  { name:"Mr. Michael Harris", role:"Senior Account Manager",    dept:"Sales",      deptColor:"#3b82f6", initials:"MH", color:"linear-gradient(135deg,#3b82f6,#6366f1)" },
  { name:"Mr. Ryan Cooper",    role:"Business Development Lead", dept:"BD",         deptColor:"#10b981", initials:"RC", color:"linear-gradient(135deg,#10b981,#059669)" },
  { name:"Ms. Olivia Carter",  role:"Customer Success Manager",  dept:"CS",         deptColor:"#f59e0b", initials:"OC", color:"linear-gradient(135deg,#f59e0b,#d97706)" },
  { name:"Mr. Lucas Martin",   role:"Operations Specialist",     dept:"Operations", deptColor:"#8b5cf6", initials:"LM", color:"linear-gradient(135deg,#8b5cf6,#6366f1)" },
]

const timeline = [
  { phase:"Phase 1", title:"Project Setup",        desc:"Initialized Vue 3 frontend with Vite, Node.js backend with Express, and MongoDB database connection.",        color:"#3b82f6" },
  { phase:"Phase 2", title:"Customer Orders",      desc:"Built complete CRUD for customer orders — form popup, validation, search, filter, edit and delete with confirmation.", color:"#6366f1" },
  { phase:"Phase 3", title:"Dashboard Builder",    desc:"Created drag-and-drop dashboard config with 12-column canvas, widget palette, settings panel and save.",      color:"#10b981" },
  { phase:"Phase 4", title:"Charts & KPIs",        desc:"Integrated Chart.js for Bar, Line, Area, Scatter and Pie charts. Built KPI cards with aggregation support.",  color:"#f59e0b" },
  { phase:"Phase 5", title:"UI Polish & Pages",    desc:"Added Login page, Home landing page, About page, 404 page, toast notifications, CSV export and sidebar.",     color:"#ec4899" },
  { phase:"Phase 6", title:"Deploy & Launch",      desc:"Deployed frontend on Vercel, backend on Render, database on MongoDB Atlas. Project live and accessible.",     color:"#8b5cf6" },
]

const projectStats = [
  { value:"6",    label:"Core Pages",         color:"#3b82f6" },
  { value:"7",    label:"Widget Types",        color:"#6366f1" },
  { value:"5",    label:"Chart Types",         color:"#10b981" },
  { value:"4",    label:"API Endpoints",       color:"#f59e0b" },
  { value:"13",   label:"Order Fields",        color:"#ec4899" },
  { value:"3",    label:"Responsive Layouts",  color:"#8b5cf6" },
]
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.about-page { color: #e2e8f0; }

/* ── SHARED BLOCK ── */
.about-block {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; overflow: hidden;
}
.img-bg {
  position: absolute; inset: -60px;
  background-size: cover; background-position: center;
  background-attachment: fixed; z-index: 0;
}
.img-overlay { position: absolute; inset: 0; z-index: 1; }
.overlay-hero   { background: linear-gradient(135deg, rgba(8,13,26,0.88), rgba(15,20,50,0.82)); }
.overlay-blue   { background: linear-gradient(135deg, rgba(5,15,40,0.9), rgba(10,25,60,0.88)); }
.overlay-purple { background: linear-gradient(135deg, rgba(15,5,35,0.92), rgba(25,10,55,0.88)); }
.overlay-dark   { background: linear-gradient(135deg, rgba(5,15,10,0.93), rgba(8,20,15,0.9)); }
.overlay-team   { background: linear-gradient(135deg, rgba(5,10,25,0.88), rgba(10,15,40,0.85)); }
.overlay-night  { background: linear-gradient(135deg, rgba(5,5,20,0.9), rgba(10,8,30,0.88)); }
.overlay-cta    { background: linear-gradient(135deg, rgba(8,12,30,0.88), rgba(20,15,50,0.85)); }

.block-content {
  position: relative; z-index: 2;
  width: 100%; max-width: 1100px;
  margin: 0 auto; padding: 100px 32px 80px;
}
.text-center { text-align: center; }
.block-label {
  display: inline-block; padding: 5px 14px; border-radius: 20px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
  color: #60a5fa; background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25);
  margin-bottom: 16px;
}
.about-block h2 {
  font-size: clamp(28px,4vw,48px); font-weight: 800;
  color: #fff; margin: 0 0 36px; letter-spacing: -1px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
}

/* ════════════════
   BLOCK 1 HERO
════════════════ */
.block-hero { min-height: 70vh; }
.about-badge { display: inline-block; padding: 6px 18px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 20px; backdrop-filter: blur(10px); }
.block-hero h1 { font-size: clamp(40px,6vw,72px); font-weight: 900; color: #fff; margin: 0 0 20px; letter-spacing: -2px; text-shadow: 0 2px 40px rgba(0,0,0,0.5); }
.hero-sub { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 600px; margin: 0 auto 40px; }
.hero-stat-row { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
.hs { display: flex; flex-direction: column; align-items: center; gap: 4px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 20px 28px; backdrop-filter: blur(10px); }
.hs-val   { font-size: 38px; font-weight: 900; line-height: 1; }
.hs-label { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

/* ════════════════
   BLOCK 2 WHAT
════════════════ */
.what-body { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.what-text p { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.85; margin-bottom: 18px; }
.what-text p:last-child { margin-bottom: 0; }
.highlight-item { display: flex; align-items: flex-start; gap: 12px; padding: 13px 16px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); margin-bottom: 8px; font-size: 14px; color: rgba(255,255,255,0.7); transition: all 0.2s; backdrop-filter: blur(8px); }
.highlight-item:hover { background: rgba(255,255,255,0.1); transform: translateX(4px); }
.hi-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }

/* ════════════════
   BLOCK 3 FEATURES
════════════════ */
.features-list { display: flex; flex-direction: column; gap: 10px; }
.feat-item {
  display: flex; align-items: center; gap: 16px;
  padding: 18px 22px; border-radius: 14px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s; backdrop-filter: blur(10px);
}
.feat-item:hover { background: rgba(255,255,255,0.1); transform: translateX(6px); border-color: rgba(255,255,255,0.2); }
.feat-num { width: 36px; height: 36px; border-radius: 50%; border: 1px solid; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.feat-icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.feat-right strong { display: block; font-size: 15px; color: #fff; margin-bottom: 3px; font-weight: 700; }
.feat-right p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.55; margin: 0; }

/* ════════════════
   BLOCK 4 TECH
════════════════ */
.tech-layers { display: flex; flex-direction: column; gap: 28px; }
.tech-layer-group {}
.layer-title { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: rgba(255,255,255,0.5); margin-bottom: 14px; }
.layer-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.layer-cards { display: flex; gap: 12px; flex-wrap: wrap; }
.tech-card {
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 20px 18px; text-align: center;
  width: 160px; flex-shrink: 0;
  transition: all 0.25s; backdrop-filter: blur(10px);
}
.tech-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.12); }
.tech-glyph { font-size: 28px; margin-bottom: 8px; }
.tech-name  { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.tech-desc  { font-size: 11px; color: rgba(255,255,255,0.45); line-height: 1.5; margin-bottom: 12px; }
.tech-bar   { height: 2px; border-radius: 2px; width: 32px; margin: 0 auto; }

/* ════════════════
   BLOCK 5 TEAM
════════════════ */
.team-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
.team-card {
  display: flex; align-items: center; gap: 18px;
  padding: 24px 22px; background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 16px;
  transition: all 0.25s; backdrop-filter: blur(12px);
}
.team-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.22); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
.team-avatar { width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: white; flex-shrink: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
.team-name  { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.team-role  { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
.dept-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; border: 1px solid; font-size: 11px; font-weight: 700; letter-spacing: 0.3px; }

/* ════════════════
   BLOCK 6 TIMELINE
════════════════ */
.block-timeline {}
.timeline { position: relative; padding: 0 0 0 40px; }
.timeline::before { content: ""; position: absolute; left: 14px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.1); border-radius: 2px; }
.timeline-item { position: relative; margin-bottom: 28px; }
.timeline-item:last-child { margin-bottom: 0; }
.tl-dot { position: absolute; left: -33px; top: 20px; width: 16px; height: 16px; border-radius: 50%; border: 3px solid rgba(0,0,0,0.5); box-shadow: 0 0 12px currentColor; flex-shrink: 0; }
.tl-card {
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 22px 24px;
  backdrop-filter: blur(10px); transition: all 0.2s;
}
.tl-card:hover { background: rgba(255,255,255,0.11); transform: translateX(6px); }
.tl-phase { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
.tl-card h3 { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.tl-card p  { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; margin: 0; }

/* ════════════════
   BLOCK 7 STATS
════════════════ */
.block-stats { min-height: 70vh; }
.pstats-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 14px; margin-bottom: 40px; }
.pstat-card {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px; padding: 28px 12px; transition: transform 0.2s;
  backdrop-filter: blur(12px);
}
.pstat-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.13); }
.pstat-val   { font-size: 38px; font-weight: 900; line-height: 1; margin-bottom: 8px; }
.pstat-label { font-size: 12px; color: rgba(255,255,255,0.5); }

.btn-cta {
  display: inline-block; background: linear-gradient(135deg,#3b82f6,#6366f1);
  color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px;
  font-size: 16px; font-weight: 700; transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 8px 32px rgba(59,130,246,0.35);
}
.btn-cta:hover { opacity: 0.9; transform: translateY(-2px); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .pstats-grid { grid-template-columns: repeat(3,1fr); }
}
@media (max-width: 768px) {
  .what-body  { grid-template-columns: 1fr; gap: 28px; }
  .team-grid  { grid-template-columns: 1fr; }
  .pstats-grid { grid-template-columns: repeat(2,1fr); }
  .layer-cards { gap: 10px; }
  .tech-card  { width: 140px; }
  .block-content { padding: 70px 20px 60px; }
  .hero-stat-row { gap: 12px; }
  .img-bg { background-attachment: scroll; }
}
@media (max-width: 480px) {
  .pstats-grid { grid-template-columns: repeat(2,1fr); }
  .tech-card   { width: 100%; }
}
</style>