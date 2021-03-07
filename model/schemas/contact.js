const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const { Subscription } = require('../../helpers/constants');

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
    subscription: {
      type: String,
      // enum: ['Subscription.FREE', Subscription.PRO, Subscription.PREMIUM],
      default: 'free',
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.plugin(mongoosePaginate);
const Contact = model('contact', contactSchema);

module.exports = Contact;
