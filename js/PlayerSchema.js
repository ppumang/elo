const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  name: String,
  level: Number,
  rating: { type: Number, default: 1500 },
  played: { type: Number, default: 0 },
  gender: { type: String, default: "m" },
  ranking: Number,
  win: { type: Number, default: 0 },
  lose: { type: Number, default: 0 },
  winningRate: { type: Number, default: 0 },
});

exports.PlayerSchema = PlayerSchema;
