<template>
  <Layout>
    <div class="dashboard-page">

      <!-- PAGE HEADER -->
      <div class="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p class="dash-sub">Your personalized analytics overview</p>
        </div>
        <div class="dash-header-right">
          <div class="date-filter">
            <span class="date-filter-label">Show data for</span>
            <select v-model="dateRange" class="date-select">
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          <button class="btn-configure" @click="goToConfig">⚙️ Configure Dashboard</button>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-if="widgets.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h2>No widgets configured</h2>
        <p>Click "Configure Dashboard" to start building your dashboard.</p>
        <button class="btn-configure" @click="goToConfig">⚙️ Configure Dashboard</button>
      </div>

      <!-- DASHBOARD GRID -->
      <div v-else class="dash-grid">
        <div
          v-for="widget in widgets"
          :key="widget.id"
          class="dash-widget"
          :style="{ gridColumn: `span ${clampCol(widget.width || 3)}`, gridRow: `span ${widget.height || 2}` }"
        >
          <div class="widget-header">
            <span class="widget-title">{{ widget.title || 'Untitled' }}</span>
            <span class="widget-desc" v-if="widget.description">{{ widget.description }}</span>
          </div>

          <!-- KPI -->
          <div v-if="widget.type === 'KPI'" class="widget-body kpi-body">
            <div class="kpi-label">{{ widget.metric || 'No metric selected' }}</div>
            <div class="kpi-number" :class="{ currency: widget.dataFormat === 'Currency' }">
              {{ computeKPI(widget) }}
            </div>
            <div class="kpi-agg" v-if="widget.aggregation">{{ widget.aggregation }}</div>
          </div>

          <!-- Bar Chart -->
          <div v-else-if="widget.type === 'Bar Chart'" class="widget-body chart-body">
            <canvas :id="`chart-${widget.id}`" :ref="el => registerCanvas(el, widget.id, 'bar', widget)"></canvas>
          </div>

          <!-- Line Chart -->
          <div v-else-if="widget.type === 'Line Chart'" class="widget-body chart-body">
            <canvas :id="`chart-${widget.id}`" :ref="el => registerCanvas(el, widget.id, 'line', widget)"></canvas>
          </div>

          <!-- Area Chart -->
          <div v-else-if="widget.type === 'Area Chart'" class="widget-body chart-body">
            <canvas :id="`chart-${widget.id}`" :ref="el => registerCanvas(el, widget.id, 'area', widget)"></canvas>
          </div>

          <!-- Scatter Plot -->
          <div v-else-if="widget.type === 'Scatter Plot'" class="widget-body chart-body">
            <canvas :id="`chart-${widget.id}`" :ref="el => registerCanvas(el, widget.id, 'scatter', widget)"></canvas>
          </div>

          <!-- Pie Chart -->
          <div v-else-if="widget.type === 'Pie Chart'" class="widget-body chart-body pie-body">
            <canvas :id="`chart-${widget.id}`" :ref="el => registerCanvas(el, widget.id, 'pie', widget)"></canvas>
          </div>

          <!-- Table -->
          <div v-else-if="widget.type === 'Table'" class="widget-body table-body">
            <div class="table-scroll">
              <table class="data-table" :style="{ fontSize: (widget.fontSize || 14) + 'px' }">
                <thead>
                  <tr>
                    <th
                      v-for="col in resolvedCols(widget)"
                      :key="col"
                      :style="{ background: widget.headerBg || '#54bd95' }"
                    >{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="getTableRows(widget).length === 0">
                    <td :colspan="resolvedCols(widget).length" class="no-data">No data available</td>
                  </tr>
                  <tr v-for="(row, i) in getTableRows(widget)" :key="i">
                    <td v-for="col in resolvedCols(widget)" :key="col">{{ getCellValue(row, col) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import Layout from "../components/Layout.vue"
import {
  Chart,
  BarController, LineController, PieController, ScatterController,
  BarElement, LineElement, PointElement, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
} from "chart.js"

Chart.register(
  BarController, LineController, PieController, ScatterController,
  BarElement, LineElement, PointElement, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
)

const router    = useRouter()
const widgets   = ref([])
const allOrders = ref([])
const dateRange = ref("all")
const chartInstances = {}

/* ── Load ── */
onMounted(async () => {
  const saved = localStorage.getItem("dashboard")
  if (saved) { try { widgets.value = JSON.parse(saved) } catch { widgets.value = [] } }
  try {
    const res = await axios.get("https://sample-dashboard-challenge.onrender.com/orders")
    allOrders.value = res.data
  } catch (e) { console.error("Failed to fetch orders:", e) }
})

onBeforeUnmount(() => { destroyAllCharts() })
function goToConfig() { router.push("/dashboard-config") }

/* ── Reactive filtered orders ── */
const filteredOrders = computed(() => {
  if (dateRange.value === "all") return allOrders.value
  const now  = new Date()
  const days = dateRange.value === "today" ? 0 : parseInt(dateRange.value)
  return allOrders.value.filter(o => {
    const d = new Date(o.createdAt || o.updatedAt || Date.now())
    if (days === 0) return d.toDateString() === now.toDateString()
    const cutoff = new Date(now); cutoff.setDate(now.getDate() - days)
    return d >= cutoff
  })
})

/* ── Rebuild charts when data or filter changes ── */
watch(filteredOrders, () => { nextTick(() => rebuildAllCharts()) })
watch(widgets, () => { nextTick(() => rebuildAllCharts()) }, { deep: true })

function destroyAllCharts() {
  Object.values(chartInstances).forEach(c => { try { c.destroy() } catch {} })
  Object.keys(chartInstances).forEach(k => delete chartInstances[k])
}

function rebuildAllCharts() {
  widgets.value.forEach(w => {
    if (!isChartType(w.type)) return
    const canvas = document.getElementById(`chart-${w.id}`)
    if (!canvas) return
    if (chartInstances[w.id]) { try { chartInstances[w.id].destroy() } catch {} ; delete chartInstances[w.id] }
    buildChart(canvas, w.id, chartTypeKey(w.type), w)
  })
}

function registerCanvas(el, id, type, widget) {
  if (!el) return
  nextTick(() => {
    if (chartInstances[id]) { try { chartInstances[id].destroy() } catch {} ; delete chartInstances[id] }
    buildChart(el, id, type, widget)
  })
}

function isChartType(t) {
  return ["Bar Chart","Line Chart","Pie Chart","Area Chart","Scatter Plot"].includes(t)
}
function chartTypeKey(t) {
  return {"Bar Chart":"bar","Line Chart":"line","Pie Chart":"pie","Area Chart":"area","Scatter Plot":"scatter"}[t]||"bar"
}

const PALETTE = ["#3b82f6","#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#84cc16","#ec4899"]

function buildChart(canvas, id, chartType, widget) {
  const data  = filteredOrders.value
  const color = (widget.chartColor && /^#[0-9a-f]{3,6}$/i.test(widget.chartColor)) ? widget.chartColor : "#3b82f6"

  if (!data.length) {
    chartInstances[id] = new Chart(canvas, {
      type: "bar",
      data: { labels: ["No data"], datasets: [{ data: [0], backgroundColor: "rgba(255,255,255,0.05)" }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: axisStyle(), y: axisStyle() }
      }
    })
    return
  }

  if (chartType === "pie") {
    const key     = fieldKey(widget.chartData || "Status")
    const grouped = groupBy(data, key)
    chartInstances[id] = new Chart(canvas, {
      type: "pie",
      data: {
        labels: Object.keys(grouped),
        datasets: [{ data: Object.values(grouped).map(a => a.length), backgroundColor: PALETTE, borderWidth: 2, borderColor: "#0f172a" }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: widget.showLegend !== false, labels: { color: "#94a3b8", font: { size: 11 }, padding: 12 } }, tooltip: tooltipCfg() }
      }
    })
    return
  }

  if (chartType === "scatter") {
    const xKey = fieldKey(widget.xAxis || "Quantity")
    const yKey = fieldKey(widget.yAxis || "Total amount")
    chartInstances[id] = new Chart(canvas, {
      type: "scatter",
      data: { datasets: [{ label: widget.title||"Data", data: data.map(o=>({ x: parseFloat(o[xKey])||0, y: parseFloat(o[yKey])||0 })), backgroundColor: color+"bb", pointRadius: 5, pointHoverRadius: 7 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipCfg() }, scales: { x: { type:"linear", ...axisStyle() }, y: { ...axisStyle(), beginAtZero: true } } }
    })
    return
  }

  const xField  = widget.xAxis || "Product"
  const yField  = widget.yAxis || "Total amount"
  const xKey    = fieldKey(xField)
  const yKey    = fieldKey(yField)
  const grouped = groupBy(data, xKey)
  const labels  = Object.keys(grouped).slice(0, 20)
  const values  = labels.map(l => grouped[l].reduce((s,o) => s + (parseFloat(o[yKey])||0), 0))
  const isArea  = chartType === "area"

  chartInstances[id] = new Chart(canvas, {
    type: isArea ? "line" : chartType,
    data: {
      labels,
      datasets: [{
        label: yField, data: values,
        backgroundColor: isArea ? color + "30" : color + "cc",
        borderColor: color, borderWidth: 2, fill: isArea,
        tension: (chartType==="line"||isArea) ? 0.4 : 0,
        pointBackgroundColor: color, pointRadius: chartType==="bar" ? 0 : 3, pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltipCfg() },
      scales: { x: { type:"category", ...axisStyle() }, y: { ...axisStyle(), beginAtZero: true } }
    }
  })
}

function tooltipCfg() {
  return { backgroundColor:"#1e293b", titleColor:"#f1f5f9", bodyColor:"#94a3b8", borderColor:"rgba(255,255,255,0.1)", borderWidth:1, padding:10 }
}
function axisStyle() {
  return { ticks: { color:"#64748b", font:{ size:11 }, maxTicksLimit:8 }, grid: { color:"rgba(255,255,255,0.05)" } }
}

/* ── KPI ── */
function computeKPI(widget) {
  const data = filteredOrders.value
  if (!data.length) return widget.dataFormat==="Currency" ? "$0" : "0"
  const agg  = widget.aggregation || "Count"
  const prec = widget.decimalPrecision ?? 0
  const curr = widget.dataFormat === "Currency"
  const numFields = { "Total amount":"total","Unit price":"price","Quantity":"quantity" }
  const key = numFields[widget.metric]
  let result = 0
  if (agg==="Count") { result = data.length }
  else if (key) {
    const vals = data.map(o => parseFloat(o[key])||0)
    result = agg==="Sum" ? vals.reduce((a,b)=>a+b,0) : vals.reduce((a,b)=>a+b,0)/(vals.length||1)
  } else { result = data.length }
  const fmt = Number(result.toFixed(prec))
  return curr ? `$${fmt.toLocaleString()}` : fmt.toLocaleString()
}

/* ── Table ── */
const defaultTableCols = ["Customer name","Product","Status","Total amount"]
function resolvedCols(w) { return (w.columns&&w.columns.length) ? w.columns : defaultTableCols }

function getTableRows(widget) {
  let rows = [...filteredOrders.value]
  if (widget.sortBy==="Ascending")  rows.sort((a,b)=>(a.total||0)-(b.total||0))
  if (widget.sortBy==="Descending") rows.sort((a,b)=>(b.total||0)-(a.total||0))
  if (widget.sortBy==="Order date") rows.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))
  if (widget.applyFilter && widget.filters?.length) {
    widget.filters.forEach(f => {
      if (!f.field||!f.value) return
      const k=fieldKey(f.field)
      rows=rows.filter(row=>{
        const v=String(row[k]||"").toLowerCase(), q=f.value.toLowerCase()
        if (f.op==="equals")       return v===q
        if (f.op==="contains")     return v.includes(q)
        if (f.op==="greater than") return parseFloat(v)>parseFloat(q)
        if (f.op==="less than")    return parseFloat(v)<parseFloat(q)
        return true
      })
    })
  }
  if (widget.pagination) rows = rows.slice(0, parseInt(widget.pagination))
  return rows
}

function getCellValue(row, col) {
  if (col==="Customer name") return `${row.firstName||""} ${row.lastName||""}`.trim()
  if (col==="Customer ID"||col==="Order ID") return String(row._id||"").slice(-6).toUpperCase()
  if (col==="Order date") return row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"
  if (col==="Total amount") return `$${Number(row.total||0).toFixed(2)}`
  if (col==="Unit price")   return `$${Number(row.price||0).toFixed(2)}`
  if (col==="Address")      return [row.address,row.city,row.state].filter(Boolean).join(", ")
  if (col==="Email id")     return row.email||"—"
  if (col==="Phone number") return row.phone||"—"
  return row[fieldKey(col)] ?? "—"
}

function fieldKey(col) {
  return {"Product":"product","Quantity":"quantity","Unit price":"price","Total amount":"total",
    "Status":"status","Created by":"createdBy","Duration":"createdAt","Customer name":"firstName",
    "Email id":"email","Phone number":"phone","Address":"address","Order date":"createdAt",
    "Customer ID":"_id","Order ID":"_id"}[col] || col.toLowerCase().replace(/ /g,"")
}
function groupBy(arr, key) {
  return arr.reduce((acc,item)=>{ const k=String(item[key]||"Unknown"); if(!acc[k])acc[k]=[]; acc[k].push(item); return acc },{})
}
function clampCol(w) {
  if (window.innerWidth<=650)  return Math.min(w,4)
  if (window.innerWidth<=1100) return Math.min(w,8)
  return Math.min(w,12)
}
</script>

<style scoped>
.dashboard-page { padding: 24px 28px; color: #e2e8f0; min-height: 100%; }
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
.dash-header h1 { font-size: 24px; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; }
.dash-sub { font-size: 14px; color: #64748b; margin: 0; }
.dash-header-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.date-filter { display: flex; align-items: center; gap: 8px; }
.date-filter-label { font-size: 13px; color: #64748b; white-space: nowrap; }
.date-select { padding: 8px 12px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06); color: #e2e8f0; font-size: 13px; outline: none; cursor: pointer; }
.date-select option { background: #1e293b; }
.btn-configure { background: linear-gradient(135deg,#3b82f6,#6366f1); color: white; border: none; padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s, transform 0.2s; white-space: nowrap; }
.btn-configure:hover { opacity: 0.9; transform: translateY(-1px); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 420px; gap: 12px; color: #475569; text-align: center; }
.empty-icon { font-size: 56px; }
.empty-state h2 { font-size: 20px; font-weight: 700; color: #64748b; margin: 0; }
.empty-state p  { font-size: 14px; margin: 0 0 8px; }
.dash-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; align-items: start; }
.dash-widget { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; min-height: 160px; transition: border-color 0.2s, box-shadow 0.2s; }
.dash-widget:hover { border-color: rgba(255,255,255,0.16); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.widget-header { padding: 14px 16px 4px; display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
.widget-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; }
.widget-desc { font-size: 11px; color: #334155; }
.widget-body { flex: 1; padding: 8px 16px 16px; min-height: 0; }
.kpi-body { display: flex; flex-direction: column; justify-content: center; padding: 12px 16px 18px; gap: 4px; }
.kpi-label  { font-size: 13px; color: #475569; }
.kpi-number { font-size: 40px; font-weight: 700; color: #f1f5f9; line-height: 1.1; }
.kpi-number.currency { color: #10b981; }
.kpi-agg { font-size: 11px; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; }
.chart-body { position: relative; flex: 1; min-height: 160px; padding: 4px 12px 12px; display: flex; align-items: stretch; }
.chart-body canvas { width: 100% !important; height: 100% !important; min-height: 140px; }
.pie-body { justify-content: center; }
.table-body { padding: 0; flex: 1; overflow: hidden; }
.table-scroll { overflow: auto; max-height: 340px; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 9px 12px; text-align: left; font-size: 12px; font-weight: 700; color: #0f172a; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
.data-table td { padding: 9px 12px; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.04); white-space: nowrap; }
.data-table tbody tr:hover td { background: rgba(255,255,255,0.03); }
.data-table tbody tr:last-child td { border-bottom: none; }
.no-data { text-align: center; color: #475569; padding: 30px 20px; }
@media (max-width: 1100px) { .dash-grid { grid-template-columns: repeat(8, 1fr); } }
@media (max-width: 650px) { .dash-grid { grid-template-columns: repeat(4, 1fr); } .dash-widget { grid-column: span 4 !important; } .dashboard-page { padding: 14px; } .dash-header { flex-direction: column; } }
</style>