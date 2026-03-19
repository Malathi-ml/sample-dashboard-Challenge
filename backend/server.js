const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

/* ✅ CONNECT MONGODB */
mongoose.connect("mongodb+srv://malathimadhu643_db_user:g8oYaFg9akjttYIn@cluster0.9h51dm1.mongodb.net/ordersDB?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

/* ✅ SCHEMA (FULLY UPDATED) */
const OrderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },

  product: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },

  status: {
    type: String,
    enum: ["Pending", "In progress", "Completed"],
    default: "Pending"
  },

  createdBy: { type: String, required: true }

}, { timestamps: true })

const Order = mongoose.model("Order", OrderSchema)

/* ✅ HOME */
app.get("/", (req, res) => {
  res.send("API is running")
})

/* ✅ GET ALL ORDERS */
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
    res.json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

/* ✅ CREATE ORDER */
app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body)
    await newOrder.save()
    res.json(newOrder)
  } catch (err) {
    res.status(500).json(err)
  }
})

/* ✅ UPDATE ORDER */
app.put("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: "Updated" })
  } catch (err) {
    res.status(500).json(err)
  }
})

/* ✅ DELETE ORDER */
app.delete("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch (err) {
    res.status(500).json(err)
  }
})

/* ✅ START SERVER */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})