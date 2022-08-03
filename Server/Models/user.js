const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema(
{
    id: {
        type: String,
    },
    roomPassword: {
        type: String,
    }
}
);
module.exports = mongoose.model("Users", userSchema);