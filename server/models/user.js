const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let validRoles = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is mandatory"]
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: validRoles
    }, // default: "USER_ROLE"
    status: {
        type: Boolean,
        default: true
    }, // Boolean
    google: {
        type: Boolean,
        default: false
    }, // Boolean
    binance: {
        type: Boolean,
        default: false
    } // Boolean
});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
    
}

userSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser único' });
module.exports = mongoose.model("User", userSchema);
