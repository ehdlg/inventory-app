const mongoose = require('mongoose');
const { format } = require('date-fns');
const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  name: { type: String, required: true, maxLenght: 100 },
  founded: { type: Date, required: true },
  num_employees: { type: Number, min: 1, required: true },
  img: { type: String },
});

DeveloperSchema.virtual('foundedDateFormatted').get(function () {
  return format(this.founded, 'dd/MM/yyyy');
});

DeveloperSchema.virtual('url').get(function () {
  return `/developers/${this._id}`;
});

module.exports = mongoose.model('Developer', DeveloperSchema);
