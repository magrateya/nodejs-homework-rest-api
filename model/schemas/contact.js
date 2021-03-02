const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name'],
    },
    email: {
      type: String,
      required: [true, 'Set name'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone'],
      unique: true,
    },
    subscription: {
      type: String,
      default: 'free',
      enum: ['free', 'pro', 'premium'],
    },
    password: {
      type: String,
      default: 'password',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
