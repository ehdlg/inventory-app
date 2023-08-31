const mongoose = require('mongoose');
const { format } = require('date-fns');
const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, required: true },
  founded: { type: Date, required: true },
  num_employees: { type: Number, min: 1, required: true },
  img: { type: String },
});

PublisherSchema.virtual('foundedDateFormatted').get(function () {
  return format(this.founded, 'dd/MM/yyyy');
});

PublisherSchema.virtual('url').get(function () {
  return `/publishers/${this._id}`;
});

module.exports = mongoose.model('Publisher', PublisherSchema);
