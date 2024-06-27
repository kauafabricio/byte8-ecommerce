import mongoose from "mongoose"

// User Model
const productSchema = mongoose.Schema({
  prodName: { type: String, required: true },
  prodPrice: { type: String, required: true },
  prodCategory: { type: String, required: true },
  prodImg: { type: String, required: true },
  prodUnits: { type: Number, required: true },
  prodDetail: { type: String, required: true },
  details: { type: Object, required: true }
})

const Product = mongoose.model('Product', productSchema)

const bagSchema = mongoose.Schema({
  productId: String,
  productName: String,
  productImg: String,
  productPrice: Number,
  productQuantity: Number
})

const cupomSchema = mongoose.Schema({
  code: { type: String, required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, required: true },
  expire: { type: Date, required: false }
})

const addressSchema = mongoose.Schema({
  streetAddress: { type: String, required: true },
  complement: { type: String, required: false },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: Number, required: true },
  country: { type: String, required: true }
})

const orderItemSchema = mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  individualPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  productImg: { type: String, required: true }
})

const orderSchema = mongoose.Schema({
  userId: { type: String, required: true },
  orderNumber: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  shippingAddress: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  shippingCost: { type: Number, required: true },
  discountAmount: { type: Number, required: false },
  items: [orderItemSchema],
  trackingNumber: { type: Number, required: true }
})

const userSchema = mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPass: { type: String, required: true },
  userAddress: [addressSchema],
  userBag: [bagSchema],
  userOrders: [orderSchema],
  userCupons: [cupomSchema]
})

const User = mongoose.model('User', userSchema)
const Order = mongoose.model('Order', orderSchema)

export { Product, User, Order }