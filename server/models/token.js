const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let tokenSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"]
    },
    symbol: {
        type: String,
        unique: true,
        required: [true, "Symbol is mandatory"]
    },
    contract: {
        type: String,
        unique: true,
        required: [true, "Contract address is mandatory"]
    }
});

tokenSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
module.exports = mongoose.model("Token", tokenSchema);
