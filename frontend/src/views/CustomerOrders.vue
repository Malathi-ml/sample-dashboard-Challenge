<template>
  <Layout>
    <div class="orders-page">

      <!-- PAGE HEADER -->
      <div class="page-header">
        <div>
          <h1>Customer Orders</h1>
          <p class="subtitle">Manage and track all customer orders</p>
        </div>
        <div class="header-actions">
          <button class="btn-export" @click="exportCSV" title="Export to CSV">
            ⬇ Export CSV
          </button>
          <button class="btn-primary" @click="openCreateForm">+ Create Order</button>
        </div>
      </div>

      <!-- STATS CARDS -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Total Orders</span>
          <span class="stat-value">{{ orders.length }}</span>
        </div>
        <div class="stat-card pending">
          <span class="stat-label">Pending</span>
          <span class="stat-value">{{ orders.filter(o => o.status === 'Pending').length }}</span>
        </div>
        <div class="stat-card inprogress">
          <span class="stat-label">In Progress</span>
          <span class="stat-value">{{ orders.filter(o => o.status === 'In progress').length }}</span>
        </div>
        <div class="stat-card completed">
          <span class="stat-label">Completed</span>
          <span class="stat-value">{{ orders.filter(o => o.status === 'Completed').length }}</span>
        </div>
        <div class="stat-card revenue">
          <span class="stat-label">Total Revenue</span>
          <span class="stat-value">${{ totalRevenue }}</span>
        </div>
      </div>

      <!-- SEARCH + FILTER BAR -->
      <div class="toolbar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input v-model="searchQuery" placeholder="Search by name or email..." class="search-input"/>
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>In progress</option>
          <option>Completed</option>
        </select>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading orders...</p>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No orders yet</h3>
        <p>Click "Create Order" to add your first order.</p>
        <button class="btn-primary" @click="openCreateForm">+ Create Order</button>
      </div>

      <!-- NO RESULTS -->
      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>Try changing your search or filter.</p>
        <button class="btn-secondary" @click="searchQuery = ''; statusFilter = ''">Clear Filters</button>
      </div>

      <!-- ORDER TABLE -->
      <div v-else class="table-wrapper">
        <div class="table-info">
          Showing <strong>{{ filteredOrders.length }}</strong> of <strong>{{ orders.length }}</strong> orders
        </div>
        <table class="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in filteredOrders" :key="order._id" class="table-row">
              <td class="row-num">{{ index + 1 }}</td>
              <td class="customer-name">{{ order.firstName }} {{ order.lastName }}</td>
              <td>{{ order.email }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.city }}</td>
              <td class="product-cell">{{ order.product }}</td>
              <td>{{ order.quantity }}</td>
              <td>${{ Number(order.price).toFixed(2) }}</td>
              <td class="total-cell">${{ Number(order.total).toFixed(2) }}</td>
              <td>{{ order.createdBy }}</td>
              <td>
                <span class="status-badge" :class="statusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-edit"   @click="openEditForm(order)"     title="Edit">✏️</button>
                <button class="btn-delete" @click="confirmDelete(order)"    title="Delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ═══ CREATE / EDIT POPUP ═══ -->
      <transition name="fade">
        <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
          <div class="modal">
            <div class="modal-header">
              <h2>{{ editingOrderId ? 'Edit Order' : 'Create Order' }}</h2>
              <button class="modal-close" @click="closeForm">✕</button>
            </div>
            <div class="modal-body">

              <!-- Customer Information -->
              <div class="form-section">
                <h3 class="section-title">Customer Information</h3>
                <div class="form-grid">
                  <div class="form-field">
                    <label>First Name <span class="required">*</span></label>
                    <input v-model="form.firstName" :class="{ 'input-error': errors.firstName }" placeholder="First name"/>
                    <span v-if="errors.firstName" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Last Name <span class="required">*</span></label>
                    <input v-model="form.lastName" :class="{ 'input-error': errors.lastName }" placeholder="Last name"/>
                    <span v-if="errors.lastName" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Email ID <span class="required">*</span></label>
                    <input v-model="form.email" :class="{ 'input-error': errors.email }" placeholder="Email address"/>
                    <span v-if="errors.email" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Phone Number <span class="required">*</span></label>
                    <input v-model="form.phone" :class="{ 'input-error': errors.phone }" placeholder="Phone number"/>
                    <span v-if="errors.phone" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field full-width">
                    <label>Street Address <span class="required">*</span></label>
                    <input v-model="form.address" :class="{ 'input-error': errors.address }" placeholder="Street address"/>
                    <span v-if="errors.address" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>City <span class="required">*</span></label>
                    <input v-model="form.city" :class="{ 'input-error': errors.city }" placeholder="City"/>
                    <span v-if="errors.city" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>State / Province <span class="required">*</span></label>
                    <input v-model="form.state" :class="{ 'input-error': errors.state }" placeholder="State"/>
                    <span v-if="errors.state" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Postal Code <span class="required">*</span></label>
                    <input v-model="form.postalCode" :class="{ 'input-error': errors.postalCode }" placeholder="Postal code"/>
                    <span v-if="errors.postalCode" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Country <span class="required">*</span></label>
                    <select v-model="form.country" :class="{ 'input-error': errors.country }">
                      <option value="" disabled>Select Country</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Singapore</option>
                      <option>Hong Kong</option>
                    </select>
                    <span v-if="errors.country" class="error-msg">Please fill the field</span>
                  </div>
                </div>
              </div>

              <!-- Order Information -->
              <div class="form-section">
                <h3 class="section-title">Order Information</h3>
                <div class="form-grid">
                  <div class="form-field full-width">
                    <label>Choose Product <span class="required">*</span></label>
                    <select v-model="form.product" :class="{ 'input-error': errors.product }">
                      <option value="" disabled>Select Product</option>
                      <option>Fiber Internet 300 Mbps</option>
                      <option>5G Unlimited Mobile Plan</option>
                      <option>Fiber Internet 1 Gbps</option>
                      <option>Business Internet 500 Mbps</option>
                      <option>VoIP Corporate Package</option>
                    </select>
                    <span v-if="errors.product" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Quantity <span class="required">*</span></label>
                    <input v-model.number="form.quantity" type="number" min="1" @input="clampQuantity" :class="{ 'input-error': errors.quantity }"/>
                    <span v-if="errors.quantity" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Unit Price <span class="required">*</span></label>
                    <div class="input-prefix-wrap">
                      <span class="prefix">$</span>
                      <input v-model.number="form.price" type="number" min="0" class="has-prefix" :class="{ 'input-error': errors.price }" placeholder="0.00"/>
                    </div>
                    <span v-if="errors.price" class="error-msg">Please fill the field</span>
                  </div>
                  <div class="form-field">
                    <label>Total Amount</label>
                    <input :value="'$' + (form.quantity * form.price).toFixed(2)" readonly class="readonly-field"/>
                  </div>
                  <div class="form-field">
                    <label>Status <span class="required">*</span></label>
                    <select v-model="form.status">
                      <option>Pending</option>
                      <option>In progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label>Created By <span class="required">*</span></label>
                    <select v-model="form.createdBy" :class="{ 'input-error': errors.createdBy }">
                      <option value="" disabled>Select person</option>
                      <option>Mr. Michael Harris</option>
                      <option>Mr. Ryan Cooper</option>
                      <option>Ms. Olivia Carter</option>
                      <option>Mr. Lucas Martin</option>
                    </select>
                    <span v-if="errors.createdBy" class="error-msg">Please fill the field</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="closeForm">Cancel</button>
              <button class="btn-primary" @click="submitOrder" :disabled="submitting">
                <span v-if="submitting" class="btn-spinner"></span>
                <span v-else>{{ editingOrderId ? 'Update Order' : 'Submit' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- ═══ DELETE CONFIRMATION ═══ -->
      <transition name="fade">
        <div v-if="showDeleteConfirm" class="modal-backdrop" @click.self="cancelDelete">
          <div class="modal modal-sm">
            <div class="modal-header">
              <h2>Delete Order</h2>
              <button class="modal-close" @click="cancelDelete">✕</button>
            </div>
            <div class="modal-body">
              <p class="delete-message">
                Are you sure you want to delete the order for
                <strong>{{ orderToDelete?.firstName }} {{ orderToDelete?.lastName }}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="cancelDelete">Cancel</button>
              <button class="btn-danger" @click="executeDelete" :disabled="submitting">
                <span v-if="submitting" class="btn-spinner"></span>
                <span v-else>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue"
import axios from "axios"
import Layout from "../components/Layout.vue"

/* ── Toast & Refresh from Layout ── */
const toast          = inject("toast", () => {})
const refreshOrders  = inject("refreshOrders", () => {})

/* ── State ── */
const orders         = ref([])
const loading        = ref(true)
const submitting     = ref(false)
const showForm       = ref(false)
const editingOrderId = ref(null)
const searchQuery    = ref("")
const statusFilter   = ref("")
const showDeleteConfirm = ref(false)
const orderToDelete  = ref(null)

const emptyForm = () => ({
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", state: "", postalCode: "", country: "",
  product: "", quantity: 1, price: 0,
  status: "Pending", createdBy: ""
})
const form   = ref(emptyForm())
const errors = ref({})

/* ── Fetch ── */
async function fetchOrders() {
  loading.value = true
  try {
    const res = await axios.get("http://localhost:5000/orders")
    orders.value = res.data
  } catch {
    toast("Failed to load orders", "error")
  } finally {
    loading.value = false
  }
}
onMounted(fetchOrders)

/* ── Computed ── */
const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchSearch =
      (o.firstName + " " + o.lastName).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === "" || o.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

const totalRevenue = computed(() => {
  return orders.value.reduce((s, o) => s + (o.total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

/* ── Form ── */
function openCreateForm() {
  form.value = emptyForm()
  editingOrderId.value = null
  errors.value = {}
  showForm.value = true
}
function openEditForm(order) {
  form.value = { ...order }
  editingOrderId.value = order._id
  errors.value = {}
  showForm.value = true
}
function closeForm() {
  showForm.value = false
  editingOrderId.value = null
  errors.value = {}
}

/* ── Validation ── */
const mandatoryFields = ["firstName","lastName","email","phone","address","city","state","postalCode","country","product","createdBy"]
function validate() {
  const e = {}
  mandatoryFields.forEach(f => { if (!form.value[f] || !String(form.value[f]).trim()) e[f] = true })
  if (!form.value.quantity || form.value.quantity < 1) e.quantity = true
  if (form.value.price === null || form.value.price === "" || form.value.price < 0) e.price = true
  errors.value = e
  return Object.keys(e).length === 0
}
function clampQuantity() { if (form.value.quantity < 1) form.value.quantity = 1 }

/* ── Submit ── */
async function submitOrder() {
  if (!validate()) {
    toast("Please fill all required fields", "error")
    return
  }
  submitting.value = true
  try {
    const payload = { ...form.value, total: form.value.quantity * form.value.price }
    if (editingOrderId.value) {
      await axios.put(`http://localhost:5000/orders/${editingOrderId.value}`, payload)
      toast("Order updated successfully!", "success")
    } else {
      await axios.post("http://localhost:5000/orders", payload)
      toast("Order created successfully!", "success")
    }
    await fetchOrders()
    refreshOrders()
    closeForm()
  } catch {
    toast("Something went wrong. Please try again.", "error")
  } finally {
    submitting.value = false
  }
}

/* ── Delete ── */
function confirmDelete(order) { orderToDelete.value = order; showDeleteConfirm.value = true }
function cancelDelete()        { orderToDelete.value = null;  showDeleteConfirm.value = false }

async function executeDelete() {
  submitting.value = true
  try {
    await axios.delete(`http://localhost:5000/orders/${orderToDelete.value._id}`)
    toast(`Order for ${orderToDelete.value.firstName} deleted`, "success")
    await fetchOrders()
    refreshOrders()
    cancelDelete()
  } catch {
    toast("Failed to delete order", "error")
  } finally {
    submitting.value = false
  }
}

/* ── Export CSV ── */
function exportCSV() {
  if (!orders.value.length) { toast("No orders to export", "warning"); return }
  const headers = ["First Name","Last Name","Email","Phone","City","Country","Product","Quantity","Unit Price","Total","Status","Created By"]
  const rows = orders.value.map(o => [
    o.firstName, o.lastName, o.email, o.phone,
    o.city, o.country, o.product, o.quantity,
    o.price, o.total, o.status, o.createdBy
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = `halleyx-orders-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast(`Exported ${orders.value.length} orders to CSV!`, "success")
}

/* ── Helpers ── */
function statusClass(status) {
  return {
    "badge-pending":    status === "Pending",
    "badge-inprogress": status === "In progress",
    "badge-completed":  status === "Completed"
  }
}
</script>

<style scoped>
.orders-page { padding: 24px 28px; color: #e2e8f0; max-width: 1400px; }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h1 { font-size: 24px; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; }
.subtitle { font-size: 14px; color: #64748b; margin: 0; }
.header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 22px; }
.stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); }
.stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 26px; font-weight: 800; color: #f1f5f9; }
.stat-card.pending    { border-left: 3px solid #f59e0b; }
.stat-card.inprogress { border-left: 3px solid #3b82f6; }
.stat-card.completed  { border-left: 3px solid #10b981; }
.stat-card.revenue    { border-left: 3px solid #ec4899; }
.stat-card.revenue .stat-value { font-size: 20px; color: #ec4899; }

/* Toolbar */
.toolbar { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.search-wrap { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0 12px; transition: border-color 0.2s; }
.search-wrap:focus-within { border-color: #3b82f6; }
.search-icon { font-size: 14px; color: #475569; flex-shrink: 0; }
.search-input { flex: 1; background: none; border: none; outline: none; padding: 10px 8px; color: #e2e8f0; font-size: 14px; }
.clear-btn { background: none; border: none; color: #475569; cursor: pointer; font-size: 13px; padding: 4px; }
.clear-btn:hover { color: #94a3b8; transform: none; }
.filter-select { padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #e2e8f0; font-size: 14px; outline: none; }
.filter-select option { background: #1e293b; }

/* Loading */
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; color: #64748b; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.empty-state { text-align: center; padding: 60px 20px; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 48px; }
.empty-state h3 { font-size: 18px; color: #94a3b8; margin: 0; }
.empty-state p  { font-size: 14px; margin: 0; }

/* Table */
.table-info { font-size: 13px; color: #475569; margin-bottom: 10px; }
.table-info strong { color: #94a3b8; }
.table-wrapper { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); }
.orders-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.orders-table thead tr { background: rgba(255,255,255,0.04); }
.orders-table th { padding: 11px 13px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.08); white-space: nowrap; }
.orders-table td { padding: 11px 13px; border-bottom: 1px solid rgba(255,255,255,0.04); color: #cbd5e1; vertical-align: middle; }
.table-row:hover td { background: rgba(255,255,255,0.03); }
.orders-table tbody tr:last-child td { border-bottom: none; }
.row-num { color: #334155; font-size: 12px; }
.customer-name { font-weight: 600; color: #f1f5f9; white-space: nowrap; }
.product-cell { max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.total-cell { font-weight: 700; color: #10b981; }

/* Status badges */
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.badge-pending    { background: rgba(245,158,11,0.15); color: #f59e0b; }
.badge-inprogress { background: rgba(59,130,246,0.15); color: #60a5fa; }
.badge-completed  { background: rgba(16,185,129,0.15); color: #10b981; }

/* Action buttons */
.actions-cell { display: flex; gap: 6px; }
.btn-edit, .btn-delete { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.btn-edit:hover   { background: rgba(59,130,246,0.2);  border-color: #3b82f6; transform: none; }
.btn-delete:hover { background: rgba(239,68,68,0.2);   border-color: #ef4444; transform: none; }

/* Buttons */
.btn-primary { background: linear-gradient(135deg,#3b82f6,#6366f1); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s, transform 0.2s; display: flex; align-items: center; gap: 6px; }
.btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: rgba(255,255,255,0.07); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-secondary:hover { background: rgba(255,255,255,0.12); transform: none; }
.btn-danger { background: linear-gradient(135deg,#ef4444,#dc2626); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-danger:hover:not(:disabled) { opacity: 0.9; transform: none; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-export { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-export:hover { background: rgba(16,185,129,0.25); transform: translateY(-1px); }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 720px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
.modal-sm { max-width: 420px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
.modal-header h2 { margin: 0; font-size: 18px; font-weight: 700; color: #f1f5f9; }
.modal-close { background: none; border: none; color: #64748b; font-size: 18px; cursor: pointer; padding: 2px 6px; border-radius: 4px; line-height: 1; }
.modal-close:hover { color: #f1f5f9; background: rgba(255,255,255,0.08); transform: none; }
.modal-body { padding: 18px 22px; overflow-y: auto; flex: 1; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }

/* Form */
.form-section { margin-bottom: 22px; }
.section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #3b82f6; margin: 0 0 14px; padding-bottom: 8px; border-bottom: 1px solid rgba(59,130,246,0.2); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field.full-width { grid-column: 1 / -1; }
.form-field label { font-size: 12px; font-weight: 600; color: #94a3b8; }
.required { color: #ef4444; }
.form-field input, .form-field select { padding: 9px 11px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #e2e8f0; font-size: 13px; outline: none; transition: border-color 0.2s; }
.form-field input:focus, .form-field select:focus { border-color: #3b82f6; }
.form-field select option { background: #1e293b; }
.input-error { border-color: #ef4444 !important; }
.error-msg { font-size: 11px; color: #ef4444; }
.input-prefix-wrap { display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: rgba(255,255,255,0.05); overflow: hidden; transition: border-color 0.2s; }
.input-prefix-wrap:focus-within { border-color: #3b82f6; }
.prefix { padding: 9px 10px; font-size: 13px; color: #64748b; background: rgba(255,255,255,0.04); border-right: 1px solid rgba(255,255,255,0.08); }
.has-prefix { flex: 1; border: none !important; background: transparent !important; border-radius: 0 !important; }
.readonly-field { background: rgba(255,255,255,0.03) !important; color: #10b981 !important; font-weight: 600; cursor: not-allowed; }
.delete-message { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
.delete-message strong { color: #f1f5f9; }

/* Fade */
.fade-enter-active, .fade-leave-active { transition: all 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-from .modal, .fade-leave-to .modal { transform: scale(0.96); }

/* Responsive */
@media (max-width: 1024px) { .stats-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px)  { .stats-row { grid-template-columns: repeat(2, 1fr); } .form-grid { grid-template-columns: 1fr; } .orders-page { padding: 16px; } }
</style>