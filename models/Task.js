const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    type: {
        type: String
    },
    district: {
        type: String
    },
    propertyType: {
        type: String
    },
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    createdAt: {
        type: String
    }
});

module.exports = Property = mongoose.model('tasks', PropertySchema);