const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema(
{
    id: {
        type: String,
    },
    roomPassword: {
        type: String,
    },
    email: [{
            type: String,
            unique: true,
    }],

},
{
    timestamps: true,
    collection: "users",
}
);
module.exports = mongoose.model("Users", userSchema);