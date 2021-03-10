const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "player" },
  opponentId: { type: Schema.Types.ObjectId, ref: "player" },
  score: { type: Number },
  opponentScore: { type: Number },
  win: { type: Boolean },
  created: { type: Date, default: Date.now() },
});

exports.MatchHistorySchema = MatchHistorySchema;
