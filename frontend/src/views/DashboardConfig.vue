<template>
  <Layout>
    <div class="config-page">

      <!-- TOP BAR -->
      <div class="topbar">
        <div class="topbar-left">
          <button class="btn-back" @click="goBack">← Back</button>
          <div>
            <h1>Configure Dashboard</h1>
            <p class="topbar-sub">Drag widgets from the panel onto the canvas</p>
          </div>
        </div>
        <button class="btn-save" @click="saveConfig">💾 Save Configuration</button>
      </div>

      <div class="builder-layout">

        <!-- ═══════════════ LEFT PANEL: Widget Palette ═══════════════ -->
        <div class="palette-panel">
          <div class="palette-header">Widgets</div>

          <!-- Charts Group -->
          <div class="palette-group">
            <div class="group-label" @click="toggleGroup('charts')">
              <span>📊 Charts</span>
              <span class="chevron" :class="{ open: openGroups.charts }">›</span>
            </div>
            <div class="group-items" v-show="openGroups.charts">
              <div
                v-for="w in chartWidgets"
                :key="w.type"
                class="palette-item"
                draggable="true"
                @dragstart="onPaletteDragStart($event, w)"
              >
                <span class="item-icon">{{ w.icon }}</span>
                <span class="item-label">{{ w.label }}</span>
              </div>
            </div>
          </div>

          <!-- Tables Group -->
          <div class="palette-group">
            <div class="group-label" @click="toggleGroup('tables')">
              <span>📋 Tables</span>
              <span class="chevron" :class="{ open: openGroups.tables }">›</span>
            </div>
            <div class="group-items" v-show="openGroups.tables">
              <div
                v-for="w in tableWidgets"
                :key="w.type"
                class="palette-item"
                draggable="true"
                @dragstart="onPaletteDragStart($event, w)"
              >
                <span class="item-icon">{{ w.icon }}</span>
                <span class="item-label">{{ w.label }}</span>
              </div>
            </div>
          </div>

          <!-- KPIs Group -->
          <div class="palette-group">
            <div class="group-label" @click="toggleGroup('kpis')">
              <span>🔢 KPIs</span>
              <span class="chevron" :class="{ open: openGroups.kpis }">›</span>
            </div>
            <div class="group-items" v-show="openGroups.kpis">
              <div
                v-for="w in kpiWidgets"
                :key="w.type"
                class="palette-item"
                draggable="true"
                @dragstart="onPaletteDragStart($event, w)"
              >
                <span class="item-icon">{{ w.icon }}</span>
                <span class="item-label">{{ w.label }}</span>
              </div>
            </div>
          </div>

          <div class="palette-tip">
            💡 Drag any widget onto the canvas to add it
          </div>
        </div>

        <!-- ═══════════════ CENTER: Canvas Grid ═══════════════ -->
        <div class="canvas-area">

          <!-- Drop zone -->
          <div
            class="canvas-grid"
            @dragover.prevent="onCanvasDragOver"
            @dragleave="onCanvasDragLeave"
            @drop="onCanvasDrop"
            :class="{ 'drag-over': isDragOverCanvas }"
          >
            <!-- Empty canvas hint -->
            <div v-if="canvasWidgets.length === 0" class="canvas-empty">
              <div class="canvas-empty-icon">🎯</div>
              <p>Drop widgets here to build your dashboard</p>
            </div>

            <!-- Drop placeholder -->
            <div
              v-if="isDragOverCanvas && canvasWidgets.length > 0"
              class="drop-placeholder"
              :style="{ gridColumn: `span ${draggedWidget?.defaultWidth || 4}` }"
            >
              Drop here
            </div>

            <!-- Placed widgets -->
            <div
              v-for="widget in canvasWidgets"
              :key="widget.id"
              class="canvas-widget"
              :style="{ gridColumn: `span ${widget.width}`, gridRow: `span ${widget.height}` }"
              draggable="true"
              @dragstart="onWidgetDragStart($event, widget)"
              @dragend="onWidgetDragEnd"
            >
              <!-- Widget hover overlay -->
              <div class="widget-actions">
                <button class="action-btn settings-btn" @click.stop="openSettings(widget)" title="Settings">⚙️</button>
                <button class="action-btn delete-btn"   @click.stop="deleteWidget(widget.id)" title="Delete">🗑️</button>
              </div>

              <!-- Widget Content Preview -->
              <div class="widget-inner">
                <div class="widget-title-row">
                  <span class="widget-icon">{{ getWidgetMeta(widget.type).icon }}</span>
                  <span class="widget-title">{{ widget.title || 'Untitled' }}</span>
                  <span class="widget-type-badge">{{ widget.type }}</span>
                </div>

                <!-- KPI preview -->
                <div v-if="widget.type === 'KPI'" class="widget-preview kpi-preview">
                  <div class="kpi-metric">{{ widget.metric || 'No metric selected' }}</div>
                  <div class="kpi-value">—</div>
                </div>

                <!-- Chart preview -->
                <div v-else-if="isChartType(widget.type)" class="widget-preview chart-preview">
                  <div class="chart-mock">
                    <div v-if="widget.type === 'Bar Chart'" class="mock-bars">
                      <div v-for="h in [60,85,45,70,95,55]" :key="h" class="mock-bar" :style="{ height: h + '%', background: widget.chartColor || '#3b82f6' }"></div>
                    </div>
                    <div v-else-if="widget.type === 'Line Chart'" class="mock-line">
                      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                        <polyline points="0,35 20,20 40,28 60,10 80,18 100,5" fill="none" :stroke="widget.chartColor || '#3b82f6'" stroke-width="2"/>
                      </svg>
                    </div>
                    <div v-else-if="widget.type === 'Pie Chart'" class="mock-pie">
                      <svg viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="none" :stroke="widget.chartColor || '#3b82f6'" stroke-width="8" stroke-dasharray="60 40"/>
                        <circle cx="20" cy="20" r="16" fill="none" stroke="#6366f1" stroke-width="8" stroke-dasharray="25 75" stroke-dashoffset="-60"/>
                        <circle cx="20" cy="20" r="16" fill="none" stroke="#10b981" stroke-width="8" stroke-dasharray="15 85" stroke-dashoffset="-85"/>
                      </svg>
                    </div>
                    <div v-else-if="widget.type === 'Area Chart'" class="mock-area">
                      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                        <polygon points="0,40 0,30 20,18 40,25 60,8 80,15 100,3 100,40" :fill="widget.chartColor || '#3b82f6'" opacity="0.3"/>
                        <polyline points="0,30 20,18 40,25 60,8 80,15 100,3" fill="none" :stroke="widget.chartColor || '#3b82f6'" stroke-width="2"/>
                      </svg>
                    </div>
                    <div v-else-if="widget.type === 'Scatter Plot'" class="mock-scatter">
                      <svg viewBox="0 0 100 50">
                        <circle v-for="(p,i) in scatterPoints" :key="i" :cx="p.x" :cy="p.y" r="3" :fill="widget.chartColor || '#3b82f6'" opacity="0.8"/>
                      </svg>
                    </div>
                  </div>
                  <div class="chart-axis-hint">
                    <span>X: {{ widget.xAxis || '—' }}</span>
                    <span>Y: {{ widget.yAxis || '—' }}</span>
                  </div>
                </div>

                <!-- Table preview -->
                <div v-else-if="widget.type === 'Table'" class="widget-preview table-preview">
                  <div class="mock-table">
                    <div class="mock-th-row">
                      <span v-for="col in (widget.columns || ['Col 1','Col 2','Col 3']).slice(0,4)" :key="col" class="mock-th">{{ col }}</span>
                    </div>
                    <div v-for="r in 3" :key="r" class="mock-tr">
                      <span v-for="c in (widget.columns || ['Col 1','Col 2','Col 3']).slice(0,4)" :key="c" class="mock-td">—</span>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Resize handle hint -->
              <div class="resize-hint">{{ widget.width }}×{{ widget.height }}</div>
            </div>

          </div><!-- end canvas-grid -->
        </div><!-- end canvas-area -->

      </div><!-- end builder-layout -->


      <!-- ═══════════════ SETTINGS SIDE PANEL ═══════════════ -->
      <transition name="slide-panel">
        <div v-if="showSettings" class="settings-overlay" @click.self="closeSettings">
          <div class="settings-panel">

            <div class="panel-header">
              <h2>Widget Settings</h2>
              <button class="modal-close" @click="closeSettings">✕</button>
            </div>

            <div class="panel-body" v-if="editingWidget">

              <!-- Common fields -->
              <div class="settings-section">
                <div class="setting-field">
                  <label>Widget Title <span class="req">*</span></label>
                  <input v-model="editingWidget.title" placeholder="Untitled" />
                </div>
                <div class="setting-field">
                  <label>Widget Type</label>
                  <input :value="editingWidget.type" readonly class="readonly-input"/>
                </div>
                <div class="setting-field">
                  <label>Description</label>
                  <textarea v-model="editingWidget.description" rows="2" placeholder="Optional description..."></textarea>
                </div>
              </div>

              <!-- Widget Size -->
              <div class="settings-section">
                <div class="section-label">Widget Size</div>
                <div class="two-col">
                  <div class="setting-field">
                    <label>Width (Columns) <span class="req">*</span></label>
                    <input type="number" v-model.number="editingWidget.width" min="1" max="12" @input="clampSize('width', 1, 12)" />
                  </div>
                  <div class="setting-field">
                    <label>Height (Rows) <span class="req">*</span></label>
                    <input type="number" v-model.number="editingWidget.height" min="1" @input="clampSize('height', 1, 99)" />
                  </div>
                </div>
              </div>

              <!-- ── KPI Settings ── -->
              <template v-if="editingWidget.type === 'KPI'">
                <div class="settings-section">
                  <div class="section-label">Data Settings</div>
                  <div class="setting-field">
                    <label>Select Metric <span class="req">*</span></label>
                    <select v-model="editingWidget.metric">
                      <option value="" disabled>Select metric</option>
                      <option v-for="m in kpiMetrics" :key="m.value" :value="m.value">{{ m.label }}</option>
                    </select>
                  </div>
                  <div class="setting-field">
                    <label>Aggregation <span class="req">*</span></label>
                    <select v-model="editingWidget.aggregation" :disabled="!isNumericMetric(editingWidget.metric)">
                      <option>Sum</option>
                      <option>Average</option>
                      <option>Count</option>
                    </select>
                    <span class="field-hint" v-if="!isNumericMetric(editingWidget.metric)">Only available for numeric fields</span>
                  </div>
                  <div class="setting-field">
                    <label>Data Format <span class="req">*</span></label>
                    <select v-model="editingWidget.dataFormat">
                      <option>Number</option>
                      <option>Currency</option>
                    </select>
                  </div>
                  <div class="setting-field">
                    <label>Decimal Precision <span class="req">*</span></label>
                    <input type="number" v-model.number="editingWidget.decimalPrecision" min="0" />
                  </div>
                </div>
              </template>

              <!-- ── Chart Settings (Bar/Line/Area/Scatter) ── -->
              <template v-if="isChartType(editingWidget.type) && editingWidget.type !== 'Pie Chart'">
                <div class="settings-section">
                  <div class="section-label">Data Settings</div>
                  <div class="setting-field">
                    <label>X-Axis Data <span class="req">*</span></label>
                    <select v-model="editingWidget.xAxis">
                      <option value="" disabled>Select X axis</option>
                      <option v-for="f in axisFields" :key="f" :value="f">{{ f }}</option>
                    </select>
                  </div>
                  <div class="setting-field">
                    <label>Y-Axis Data <span class="req">*</span></label>
                    <select v-model="editingWidget.yAxis">
                      <option value="" disabled>Select Y axis</option>
                      <option v-for="f in axisFields" :key="f" :value="f">{{ f }}</option>
                    </select>
                  </div>
                </div>
                <div class="settings-section">
                  <div class="section-label">Styling</div>
                  <div class="setting-field">
                    <label>Chart Color</label>
                    <div class="color-row">
                      <input type="color" v-model="editingWidget.chartColor" class="color-swatch"/>
                      <input type="text" v-model="editingWidget.chartColor" class="hex-input" placeholder="#3b82f6" maxlength="7"/>
                    </div>
                  </div>
                  <div class="setting-field">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="editingWidget.showDataLabel"/>
                      Show Data Labels
                    </label>
                  </div>
                </div>
              </template>

              <!-- ── Pie Chart Settings ── -->
              <template v-if="editingWidget.type === 'Pie Chart'">
                <div class="settings-section">
                  <div class="section-label">Data Settings</div>
                  <div class="setting-field">
                    <label>Chart Data <span class="req">*</span></label>
                    <select v-model="editingWidget.chartData">
                      <option value="" disabled>Select data</option>
                      <option v-for="f in pieFields" :key="f" :value="f">{{ f }}</option>
                    </select>
                  </div>
                  <div class="setting-field">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="editingWidget.showLegend"/>
                      Show Legend
                    </label>
                  </div>
                </div>
                <div class="settings-section">
                  <div class="section-label">Styling</div>
                  <div class="setting-field">
                    <label>Chart Color</label>
                    <div class="color-row">
                      <input type="color" v-model="editingWidget.chartColor" class="color-swatch"/>
                      <input type="text" v-model="editingWidget.chartColor" class="hex-input" placeholder="#3b82f6" maxlength="7"/>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ── Table Settings ── -->
              <template v-if="editingWidget.type === 'Table'">
                <div class="settings-section">
                  <div class="section-label">Data Settings</div>
                  <div class="setting-field">
                    <label>Choose Columns <span class="req">*</span></label>
                    <div class="multiselect-list">
                      <label class="checkbox-label" v-for="col in tableColumns" :key="col">
                        <input
                          type="checkbox"
                          :value="col"
                          :checked="(editingWidget.columns || []).includes(col)"
                          @change="toggleColumn(col)"
                        />
                        {{ col }}
                      </label>
                    </div>
                  </div>
                  <div class="setting-field">
                    <label>Sort By</label>
                    <select v-model="editingWidget.sortBy">
                      <option value="">None</option>
                      <option>Ascending</option>
                      <option>Descending</option>
                      <option>Order date</option>
                    </select>
                  </div>
                  <div class="setting-field">
                    <label>Pagination</label>
                    <select v-model="editingWidget.pagination">
                      <option value="">None</option>
                      <option>5</option>
                      <option>10</option>
                      <option>15</option>
                    </select>
                  </div>
                  <div class="setting-field">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="editingWidget.applyFilter"/>
                      Apply Filter
                    </label>
                    <div v-if="editingWidget.applyFilter" class="filter-block">
                      <div class="filter-row" v-for="(filter, idx) in (editingWidget.filters || [])" :key="idx">
                        <select v-model="filter.field" class="filter-select-sm">
                          <option value="" disabled>Field</option>
                          <option v-for="col in tableColumns" :key="col" :value="col">{{ col }}</option>
                        </select>
                        <select v-model="filter.op" class="filter-select-sm">
                          <option>equals</option>
                          <option>contains</option>
                          <option>greater than</option>
                          <option>less than</option>
                        </select>
                        <input v-model="filter.value" placeholder="Value" class="filter-value-input"/>
                        <button class="remove-filter" @click="removeFilter(idx)">✕</button>
                      </div>
                      <button class="btn-add-filter" @click="addFilter">+ Add Filter</button>
                    </div>
                  </div>
                </div>
                <div class="settings-section">
                  <div class="section-label">Styling</div>
                  <div class="setting-field">
                    <label>Font Size</label>
                    <input type="number" v-model.number="editingWidget.fontSize" min="12" max="18" placeholder="14"/>
                    <span class="field-hint">Allowed: 12–18</span>
                  </div>
                  <div class="setting-field">
                    <label>Header Background</label>
                    <div class="color-row">
                      <input type="color" v-model="editingWidget.headerBg" class="color-swatch"/>
                      <input type="text" v-model="editingWidget.headerBg" class="hex-input" placeholder="#54bd95" maxlength="7"/>
                    </div>
                  </div>
                </div>
              </template>

            </div><!-- end panel-body -->

            <div class="panel-footer">
              <button class="btn-secondary" @click="closeSettings">Cancel</button>
              <button class="btn-primary" @click="applySettings">Apply</button>
            </div>

          </div>
        </div>
      </transition>

      <!-- Delete Confirmation -->
      <transition name="fade">
        <div v-if="showDeleteConfirm" class="modal-backdrop" @click.self="cancelDelete">
          <div class="modal modal-sm">
            <div class="modal-header">
              <h2>Remove Widget</h2>
              <button class="modal-close" @click="cancelDelete">✕</button>
            </div>
            <div class="modal-body-sm">
              <p>Are you sure you want to remove <strong>{{ widgetToDelete?.title || widgetToDelete?.type }}</strong> from the dashboard?</p>
            </div>
            <div class="modal-footer-sm">
              <button class="btn-secondary" @click="cancelDelete">Cancel</button>
              <button class="btn-danger" @click="executeDelete">Yes, Remove</button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import Layout from "../components/Layout.vue"

const router = useRouter()

/* ── Navigation ── */
function goBack() { router.push("/dashboard") }

/* ── Palette Widget Definitions ── */
const chartWidgets = [
  { type: "Bar Chart",    icon: "📊", label: "Bar Chart",    defaultWidth: 5, defaultHeight: 5 },
  { type: "Line Chart",   icon: "📈", label: "Line Chart",   defaultWidth: 5, defaultHeight: 5 },
  { type: "Pie Chart",    icon: "🥧", label: "Pie Chart",    defaultWidth: 4, defaultHeight: 4 },
  { type: "Area Chart",   icon: "📉", label: "Area Chart",   defaultWidth: 5, defaultHeight: 5 },
  { type: "Scatter Plot", icon: "🔵", label: "Scatter Plot", defaultWidth: 5, defaultHeight: 5 },
]
const tableWidgets = [
  { type: "Table", icon: "📋", label: "Table", defaultWidth: 4, defaultHeight: 4 },
]
const kpiWidgets = [
  { type: "KPI", icon: "🔢", label: "KPI Value", defaultWidth: 2, defaultHeight: 2 },
]

const allWidgetMeta = [...chartWidgets, ...tableWidgets, ...kpiWidgets]
function getWidgetMeta(type) {
  return allWidgetMeta.find(w => w.type === type) || { icon: "📦", label: type }
}

/* ── Collapsible Groups ── */
const openGroups = reactive({ charts: true, tables: true, kpis: true })
function toggleGroup(g) { openGroups[g] = !openGroups[g] }

/* ── Canvas State ── */
const canvasWidgets = ref(
  (() => {
    try { return JSON.parse(localStorage.getItem("dashboard") || "[]") } catch { return [] }
  })()
)

/* ── Drag from Palette ── */
const draggedWidget    = ref(null)
const isDragOverCanvas = ref(false)
const draggingExisting = ref(null)
let   dragIdCounter    = Date.now()

function onPaletteDragStart(e, widgetDef) {
  draggedWidget.value = widgetDef
  draggingExisting.value = null
  e.dataTransfer.effectAllowed = "copy"
}

function onWidgetDragStart(e, widget) {
  draggingExisting.value = widget
  draggedWidget.value = getWidgetMeta(widget.type)
  e.dataTransfer.effectAllowed = "move"
}

function onWidgetDragEnd() {
  draggingExisting.value = null
}

function onCanvasDragOver(e) {
  e.preventDefault()
  isDragOverCanvas.value = true
}

function onCanvasDragLeave() {
  isDragOverCanvas.value = false
}

function onCanvasDrop(e) {
  e.preventDefault()
  isDragOverCanvas.value = false

  // If reordering existing widget — move to end for now
  if (draggingExisting.value) {
    const idx = canvasWidgets.value.findIndex(w => w.id === draggingExisting.value.id)
    if (idx !== -1) {
      const [moved] = canvasWidgets.value.splice(idx, 1)
      canvasWidgets.value.push(moved)
    }
    draggingExisting.value = null
    return
  }

  if (!draggedWidget.value) return

  const def = draggedWidget.value
  const newWidget = {
    id:          ++dragIdCounter,
    type:        def.type,
    title:       "Untitled",
    description: "",
    width:       def.defaultWidth,
    height:      def.defaultHeight,
    metric:      "",
    aggregation: "Count",
    dataFormat:  "Number",
    decimalPrecision: 0,
    xAxis:       "",
    yAxis:       "",
    chartData:   "",
    chartColor:  "#3b82f6",
    showDataLabel: false,
    showLegend:  false,
    columns:     [],
    sortBy:      "",
    pagination:  "",
    applyFilter: false,
    filters:     [],
    fontSize:    14,
    headerBg:    "#54bd95",
  }
  canvasWidgets.value.push(newWidget)
  draggedWidget.value = null
}

/* ── Delete Widget ── */
const showDeleteConfirm = ref(false)
const widgetToDelete    = ref(null)

function deleteWidget(id) {
  widgetToDelete.value = canvasWidgets.value.find(w => w.id === id)
  showDeleteConfirm.value = true
}
function cancelDelete() {
  widgetToDelete.value = null
  showDeleteConfirm.value = false
}
function executeDelete() {
  canvasWidgets.value = canvasWidgets.value.filter(w => w.id !== widgetToDelete.value.id)
  cancelDelete()
}

/* ── Settings Panel ── */
const showSettings  = ref(false)
const editingWidget = ref(null)

function openSettings(widget) {
  editingWidget.value = JSON.parse(JSON.stringify(widget)) // deep copy
  showSettings.value = true
}
function closeSettings() {
  showSettings.value = false
  editingWidget.value = null
}
function applySettings() {
  const idx = canvasWidgets.value.findIndex(w => w.id === editingWidget.value.id)
  if (idx !== -1) canvasWidgets.value[idx] = { ...editingWidget.value }
  closeSettings()
}

/* ── Size Clamp ── */
function clampSize(field, min, max) {
  const v = editingWidget.value[field]
  if (v < min) editingWidget.value[field] = min
  if (max && v > max) editingWidget.value[field] = max
}

/* ── Table Columns ── */
const tableColumns = [
  "Customer ID","Customer name","Email id","Phone number","Address",
  "Order ID","Order date","Product","Quantity","Unit price",
  "Total amount","Status","Created by"
]
function toggleColumn(col) {
  if (!editingWidget.value.columns) editingWidget.value.columns = []
  const idx = editingWidget.value.columns.indexOf(col)
  if (idx === -1) editingWidget.value.columns.push(col)
  else editingWidget.value.columns.splice(idx, 1)
}

/* ── Table Filters ── */
function addFilter() {
  if (!editingWidget.value.filters) editingWidget.value.filters = []
  editingWidget.value.filters.push({ field: "", op: "equals", value: "" })
}
function removeFilter(idx) {
  editingWidget.value.filters.splice(idx, 1)
}

/* ── KPI Metrics ── */
const kpiMetrics = [
  { value: "Customer ID",   label: "Customer ID" },
  { value: "Customer name", label: "Customer Name" },
  { value: "Email id",      label: "Email ID" },
  { value: "Address",       label: "Address" },
  { value: "Order date",    label: "Order Date" },
  { value: "Product",       label: "Product" },
  { value: "Created by",    label: "Created By" },
  { value: "Status",        label: "Status" },
  { value: "Total amount",  label: "Total Amount" },
  { value: "Unit price",    label: "Unit Price" },
  { value: "Quantity",      label: "Quantity" },
]
const numericMetrics = ["Total amount","Unit price","Quantity"]
function isNumericMetric(m) { return numericMetrics.includes(m) }

/* ── Chart/Pie Fields ── */
const axisFields = ["Product","Quantity","Unit price","Total amount","Status","Created by","Duration"]
const pieFields  = ["Product","Quantity","Unit price","Total amount","Status","Created by"]

/* ── Helpers ── */
function isChartType(type) {
  return ["Bar Chart","Line Chart","Pie Chart","Area Chart","Scatter Plot"].includes(type)
}

const scatterPoints = [
  {x:10,y:40},{x:25,y:15},{x:40,y:35},{x:55,y:10},{x:70,y:28},{x:85,y:8},{x:15,y:30},{x:50,y:20},{x:75,y:40}
]

/* ── Save ── */
function saveConfig() {
  localStorage.setItem("dashboard", JSON.stringify(canvasWidgets.value))
  router.push("/dashboard")
}
</script>

<style scoped>
/* ── Page Shell ── */
.config-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 0px);
  color: #e2e8f0;
  overflow: hidden;
}

/* ── Topbar ── */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.2);
  flex-shrink: 0;
  gap: 12px;
}
.topbar-left { display: flex; align-items: center; gap: 14px; }
.topbar h1 { font-size: 20px; font-weight: 700; color: #f1f5f9; margin: 0 0 2px; }
.topbar-sub { font-size: 12px; color: #64748b; margin: 0; }
.btn-back {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  color: #94a3b8;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-back:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; transform: none; }
.btn-save {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  white-space: nowrap;
}
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── Builder Layout ── */
.builder-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Palette Panel ── */
.palette-panel {
  width: 220px;
  min-width: 220px;
  background: rgba(0,0,0,0.2);
  border-right: 1px solid rgba(255,255,255,0.08);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
}
.palette-header {
  padding: 14px 16px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.palette-group { border-bottom: 1px solid rgba(255,255,255,0.06); }
.group-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.group-label:hover { background: rgba(255,255,255,0.04); }
.chevron { font-size: 18px; transition: transform 0.2s; display: inline-block; }
.chevron.open { transform: rotate(90deg); }
.group-items { padding: 4px 8px 8px; }
.palette-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.04);
  cursor: grab;
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 5px;
  transition: all 0.15s;
  user-select: none;
}
.palette-item:hover { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.4); color: #93c5fd; }
.palette-item:active { cursor: grabbing; }
.item-icon { font-size: 15px; }
.item-label { font-size: 13px; }
.palette-tip {
  margin: 12px 12px 0;
  padding: 10px 12px;
  background: rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.15);
  border-radius: 8px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

/* ── Canvas Area ── */
.canvas-area {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: rgba(0,0,0,0.1);
}
.canvas-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  min-height: 400px;
  padding: 16px;
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 14px;
  transition: border-color 0.2s, background 0.2s;
  align-items: start;
}
.canvas-grid.drag-over {
  border-color: rgba(59,130,246,0.5);
  background: rgba(59,130,246,0.04);
}
.canvas-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #475569;
  gap: 10px;
  pointer-events: none;
}
.canvas-empty-icon { font-size: 40px; }
.canvas-empty p { font-size: 14px; }

/* ── Drop Placeholder ── */
.drop-placeholder {
  background: rgba(59,130,246,0.1);
  border: 2px dashed rgba(59,130,246,0.5);
  border-radius: 12px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #3b82f6;
  animation: pulse 1s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

/* ── Canvas Widget Card ── */
.canvas-widget {
  position: relative;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  min-height: 120px;
  cursor: grab;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.canvas-widget:active { cursor: grabbing; }
.canvas-widget:hover {
  border-color: rgba(59,130,246,0.4);
  box-shadow: 0 0 0 1px rgba(59,130,246,0.2);
}
.canvas-widget:hover .widget-actions { opacity: 1; }

/* ── Widget Hover Actions ── */
.widget-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}
.action-btn {
  background: rgba(15,23,42,0.85);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  padding: 4px 7px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(4px);
}
.action-btn:hover { transform: scale(1.1) !important; }
.settings-btn:hover { background: rgba(59,130,246,0.3); border-color: #3b82f6; }
.delete-btn:hover   { background: rgba(239,68,68,0.3);  border-color: #ef4444; }

/* ── Widget Inner Content ── */
.widget-inner {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.widget-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 60px;
}
.widget-icon { font-size: 14px; }
.widget-title {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.widget-type-badge {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 10px;
  background: rgba(99,102,241,0.2);
  color: #818cf8;
  white-space: nowrap;
}

/* ── Widget Previews ── */
.widget-preview { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.kpi-preview { align-items: flex-start; gap: 4px; }
.kpi-metric { font-size: 11px; color: #64748b; }
.kpi-value { font-size: 28px; font-weight: 700; color: #3b82f6; }

.chart-preview { gap: 6px; }
.chart-mock { flex: 1; display: flex; align-items: flex-end; justify-content: center; min-height: 60px; }
.mock-bars { display: flex; align-items: flex-end; gap: 4px; height: 60px; width: 100%; }
.mock-bar { flex: 1; border-radius: 3px 3px 0 0; transition: height 0.3s; min-height: 4px; }
.mock-line svg, .mock-area svg { width: 100%; height: 60px; }
.mock-pie { display: flex; justify-content: center; }
.mock-pie svg { width: 60px; height: 60px; }
.mock-scatter svg { width: 100%; height: 60px; }
.chart-axis-hint { display: flex; justify-content: space-between; font-size: 10px; color: #475569; }

.table-preview { overflow: hidden; }
.mock-table { font-size: 10px; width: 100%; }
.mock-th-row { display: flex; gap: 4px; margin-bottom: 3px; }
.mock-tr { display: flex; gap: 4px; margin-bottom: 2px; }
.mock-th { flex: 1; background: rgba(84,189,149,0.25); color: #54bd95; padding: 2px 4px; border-radius: 2px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mock-td { flex: 1; background: rgba(255,255,255,0.04); color: #475569; padding: 2px 4px; border-radius: 2px; }

.resize-hint {
  position: absolute;
  bottom: 5px;
  right: 8px;
  font-size: 10px;
  color: #334155;
}

/* ── Settings Panel ── */
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 500;
  display: flex;
  justify-content: flex-end;
}
.settings-panel {
  width: 360px;
  background: #1e293b;
  border-left: 1px solid rgba(255,255,255,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.panel-header h2 { margin: 0; font-size: 16px; font-weight: 700; color: #f1f5f9; }
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}
.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}

/* ── Settings Fields ── */
.settings-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.settings-section:last-child { border-bottom: none; }
.section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #3b82f6;
  margin-bottom: 12px;
}
.setting-field { margin-bottom: 12px; display: flex; flex-direction: column; gap: 5px; }
.setting-field:last-child { margin-bottom: 0; }
.setting-field label {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
}
.setting-field input,
.setting-field select,
.setting-field textarea {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  resize: none;
}
.setting-field input:focus,
.setting-field select:focus,
.setting-field textarea:focus { border-color: #3b82f6; }
.setting-field select option { background: #1e293b; }
.readonly-input { opacity: 0.5; cursor: not-allowed; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.req { color: #ef4444; }
.field-hint { font-size: 11px; color: #475569; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #94a3b8; cursor: pointer; }
.checkbox-label input[type="checkbox"] { accent-color: #3b82f6; width: 14px; height: 14px; }

/* ── Color Picker ── */
.color-row { display: flex; align-items: center; gap: 8px; }
.color-swatch { width: 36px; height: 34px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; padding: 2px; background: none; }
.hex-input { flex: 1; font-family: monospace; }

/* ── Multiselect ── */
.multiselect-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
  padding: 8px 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
}

/* ── Filter Block ── */
.filter-block { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
.filter-row { display: flex; gap: 6px; align-items: center; }
.filter-select-sm {
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  font-size: 12px;
  outline: none;
}
.filter-select-sm option { background: #1e293b; }
.filter-value-input {
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  font-size: 12px;
  outline: none;
}
.remove-filter {
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
}
.remove-filter:hover { background: rgba(239,68,68,0.3); transform: none; }
.btn-add-filter {
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.3);
  color: #60a5fa;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}
.btn-add-filter:hover { background: rgba(59,130,246,0.2); transform: none; }

/* ── Shared Buttons ── */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; transform: none; }
.btn-secondary {
  background: rgba(255,255,255,0.07);
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary:hover { background: rgba(255,255,255,0.12); transform: none; }
.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 9px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-danger:hover { opacity: 0.9; transform: none; }
.modal-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
}
.modal-close:hover { color: #f1f5f9; background: rgba(255,255,255,0.08); transform: none; }

/* ── Delete Confirm Modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-sm {
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  width: 380px;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.modal-header h2 { margin: 0; font-size: 16px; font-weight: 700; color: #f1f5f9; }
.modal-body-sm { padding: 16px 20px; font-size: 14px; color: #94a3b8; line-height: 1.6; }
.modal-body-sm strong { color: #f1f5f9; }
.modal-footer-sm {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-panel-enter-active, .slide-panel-leave-active { transition: all 0.3s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; }
.slide-panel-enter-from .settings-panel, .slide-panel-leave-to .settings-panel { transform: translateX(100%); }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .canvas-grid { grid-template-columns: repeat(8, 1fr); }
}
@media (max-width: 650px) {
  .canvas-grid { grid-template-columns: repeat(4, 1fr); }
  .palette-panel { width: 180px; min-width: 180px; }
  .settings-panel { width: 100vw; }
}
</style>