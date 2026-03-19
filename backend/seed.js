const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/ordersDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => { console.log(err); process.exit(1) })

const OrderSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: String, phone: String,
  address: String, city: String, state: String, postalCode: String, country: String,
  product: String, quantity: Number, price: Number, total: Number,
  status: { type: String, enum: ["Pending","In progress","Completed"], default: "Pending" },
  createdBy: String
}, { timestamps: true })

const Order = mongoose.model("Order", OrderSchema)

const sampleOrders = [
  { firstName:"James",   lastName:"Wilson",   email:"james.wilson@email.com",   phone:"555-0101", address:"12 Oak Street",      city:"New York",     state:"NY", postalCode:"10001", country:"United States", product:"Fiber Internet 1 Gbps",        quantity:1, price:89.99,  total:89.99,  status:"Completed",  createdBy:"Mr. Michael Harris" },
  { firstName:"Sarah",   lastName:"Johnson",  email:"sarah.j@email.com",        phone:"555-0102", address:"45 Maple Ave",        city:"Los Angeles",  state:"CA", postalCode:"90001", country:"United States", product:"5G Unlimited Mobile Plan",     quantity:2, price:49.99,  total:99.98,  status:"Pending",    createdBy:"Ms. Olivia Carter"  },
  { firstName:"Raj",     lastName:"Patel",    email:"raj.patel@email.com",      phone:"555-0103", address:"78 Pine Road",        city:"Chicago",      state:"IL", postalCode:"60601", country:"United States", product:"Business Internet 500 Mbps",   quantity:1, price:149.99, total:149.99, status:"In progress", createdBy:"Mr. Ryan Cooper"    },
  { firstName:"Emily",   lastName:"Chen",     email:"emily.chen@email.com",     phone:"555-0104", address:"23 Elm Boulevard",    city:"Houston",      state:"TX", postalCode:"77001", country:"United States", product:"VoIP Corporate Package",       quantity:3, price:199.99, total:599.97, status:"Completed",  createdBy:"Mr. Lucas Martin"   },
  { firstName:"Michael", lastName:"Brown",    email:"m.brown@email.com",        phone:"555-0105", address:"56 Cedar Lane",       city:"Phoenix",      state:"AZ", postalCode:"85001", country:"United States", product:"Fiber Internet 300 Mbps",      quantity:1, price:59.99,  total:59.99,  status:"Pending",    createdBy:"Mr. Michael Harris" },
  { firstName:"Linda",   lastName:"Martinez", email:"linda.m@email.com",        phone:"555-0106", address:"90 Birch Court",      city:"Toronto",      state:"ON", postalCode:"M5A1A1",country:"Canada",        product:"5G Unlimited Mobile Plan",     quantity:4, price:49.99,  total:199.96, status:"Completed",  createdBy:"Ms. Olivia Carter"  },
  { firstName:"David",   lastName:"Lee",      email:"david.lee@email.com",      phone:"555-0107", address:"34 Walnut Street",    city:"Sydney",       state:"NSW",postalCode:"2000",  country:"Australia",     product:"Fiber Internet 1 Gbps",        quantity:1, price:89.99,  total:89.99,  status:"In progress", createdBy:"Mr. Ryan Cooper"    },
  { firstName:"Priya",   lastName:"Sharma",   email:"priya.s@email.com",        phone:"555-0108", address:"67 Mango Road",       city:"Singapore",    state:"SG", postalCode:"018956",country:"Singapore",     product:"Business Internet 500 Mbps",   quantity:2, price:149.99, total:299.98, status:"Pending",    createdBy:"Mr. Lucas Martin"   },
  { firstName:"Tom",     lastName:"Anderson", email:"tom.a@email.com",          phone:"555-0109", address:"11 Spruce Avenue",    city:"Philadelphia", state:"PA", postalCode:"19101", country:"United States", product:"VoIP Corporate Package",       quantity:1, price:199.99, total:199.99, status:"Completed",  createdBy:"Mr. Michael Harris" },
  { firstName:"Jessica", lastName:"Taylor",   email:"jess.t@email.com",         phone:"555-0110", address:"88 Ash Street",       city:"San Antonio",  state:"TX", postalCode:"78201", country:"United States", product:"Fiber Internet 300 Mbps",      quantity:2, price:59.99,  total:119.98, status:"Pending",    createdBy:"Ms. Olivia Carter"  },
  { firstName:"Kevin",   lastName:"White",    email:"kevin.w@email.com",        phone:"555-0111", address:"22 Bamboo Lane",      city:"Hong Kong",    state:"HK", postalCode:"999077",country:"Hong Kong",     product:"5G Unlimited Mobile Plan",     quantity:3, price:49.99,  total:149.97, status:"In progress", createdBy:"Mr. Ryan Cooper"    },
  { firstName:"Angela",  lastName:"Davis",    email:"angela.d@email.com",       phone:"555-0112", address:"55 Redwood Drive",    city:"San Diego",    state:"CA", postalCode:"92101", country:"United States", product:"Fiber Internet 1 Gbps",        quantity:1, price:89.99,  total:89.99,  status:"Completed",  createdBy:"Mr. Lucas Martin"   },
  { firstName:"Carlos",  lastName:"Garcia",   email:"carlos.g@email.com",       phone:"555-0113", address:"77 Cypress Blvd",     city:"Dallas",       state:"TX", postalCode:"75201", country:"United States", product:"Business Internet 500 Mbps",   quantity:1, price:149.99, total:149.99, status:"Pending",    createdBy:"Mr. Michael Harris" },
  { firstName:"Mei",     lastName:"Wong",     email:"mei.wong@email.com",       phone:"555-0114", address:"39 Lotus Street",     city:"Vancouver",    state:"BC", postalCode:"V5K0A1",country:"Canada",        product:"VoIP Corporate Package",       quantity:2, price:199.99, total:399.98, status:"Completed",  createdBy:"Ms. Olivia Carter"  },
  { firstName:"Nathan",  lastName:"Scott",    email:"nathan.s@email.com",       phone:"555-0115", address:"14 Willow Way",       city:"Melbourne",    state:"VIC",postalCode:"3000",  country:"Australia",     product:"Fiber Internet 300 Mbps",      quantity:3, price:59.99,  total:179.97, status:"In progress", createdBy:"Mr. Ryan Cooper"    },
  { firstName:"Aisha",   lastName:"Khan",     email:"aisha.k@email.com",        phone:"555-0116", address:"61 Orchid Road",      city:"Singapore",    state:"SG", postalCode:"238840",country:"Singapore",     product:"5G Unlimited Mobile Plan",     quantity:1, price:49.99,  total:49.99,  status:"Pending",    createdBy:"Mr. Lucas Martin"   },
  { firstName:"Brian",   lastName:"Clark",    email:"brian.c@email.com",        phone:"555-0117", address:"29 Hickory Lane",     city:"Jacksonville", state:"FL", postalCode:"32099", country:"United States", product:"Fiber Internet 1 Gbps",        quantity:2, price:89.99,  total:179.98, status:"Completed",  createdBy:"Mr. Michael Harris" },
  { firstName:"Sophie",  lastName:"Turner",   email:"sophie.t@email.com",       phone:"555-0118", address:"83 Chestnut Ave",     city:"Columbus",     state:"OH", postalCode:"43085", country:"United States", product:"Business Internet 500 Mbps",   quantity:1, price:149.99, total:149.99, status:"Pending",    createdBy:"Ms. Olivia Carter"  },
  { firstName:"Omar",    lastName:"Hassan",   email:"omar.h@email.com",         phone:"555-0119", address:"47 Fig Tree Road",    city:"Hong Kong",    state:"HK", postalCode:"999077",country:"Hong Kong",     product:"VoIP Corporate Package",       quantity:4, price:199.99, total:799.96, status:"In progress", createdBy:"Mr. Ryan Cooper"    },
  { firstName:"Grace",   lastName:"Kim",      email:"grace.k@email.com",        phone:"555-0120", address:"16 Sakura Street",    city:"Toronto",      state:"ON", postalCode:"M4B1B3",country:"Canada",        product:"Fiber Internet 300 Mbps",      quantity:1, price:59.99,  total:59.99,  status:"Completed",  createdBy:"Mr. Lucas Martin"   },
]

async function seed() {
  try {
    const existing = await Order.countDocuments()
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} orders.`)
      console.log("Deleting existing orders and inserting fresh sample data...")
      await Order.deleteMany({})
    }
    await Order.insertMany(sampleOrders)
    console.log(`✅  Successfully inserted ${sampleOrders.length} sample orders!`)
    console.log("\n📊 Summary:")
    console.log("   Products covered : Fiber 300Mbps, Fiber 1Gbps, 5G Mobile, Business 500Mbps, VoIP")
    console.log("   Statuses         : Pending(7), In progress(5), Completed(8)")
    console.log("   Countries        : United States, Canada, Australia, Singapore, Hong Kong")
    console.log("   Created by       : All 4 team members")
    console.log("\n🚀 Start your server and open the dashboard to see the data!")
  } catch (err) {
    console.error("❌ Seed failed:", err)
  } finally {
    mongoose.disconnect()
  }
}

seed()