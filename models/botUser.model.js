const mongoose = require('mongoose');

const BotUserSchema = new mongoose.Schema({
  userId: Number,
  username: String,
});

const UserModel = mongoose.model('BotUserSchema', BotUserSchema);

module.exports = UserModel;
