const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION_STRING;

//connect to db, notify in console of connection or error
mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((error) => {
    console.log(error.message);
  });

//customer/order schema
const customerSchema = new mongoose.Schema({
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  customerAddress: { type: String }, //Address,City, Postal Codem Province
  orderItems: { type: Array },
  orderSubtotal: { type: String },
  taxRate: { type: Number },
  associatedTaxes: { type: Number },
  orderTotal: { type: Number },
});

const CustomerOrders = mongoose.model('CustomerOrders', customerSchema);

module.exports = {
  CustomerOrders,
};
