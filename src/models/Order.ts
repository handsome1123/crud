// models/Order.js or models/Order.ts
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Change from 'user' to 'userId' OR update your API to use 'user'
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Alternative: if your schema uses 'user', keep this instead:
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);