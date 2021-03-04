const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name'],
      min: 2,
      max: 20,
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
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
