const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/pingpong";
const DB = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const Schema = mongoose.Schema;
const PlayerSchema = require("./PlayerSchema").PlayerSchema;

const Player_DB = DB.model("player", PlayerSchema);

const players = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "total"), "utf8")
);

for (let i = 0; i < players.length; i++) {
  const name = players[i].name;
  let level = parseInt(players[i].level);
  const gender = players[i].gender;
  const filter = {
    name,
  };
  const update = {
    gender: gender,
    rating: 1500,
    played: 0,
    win: 0,
    lose: 0,
  };

  if (![1, 2, 3, 4, 5, 6, 7, 8].includes(level)) {
    level = 0;
  }

  const player = new Player_DB({
    name: name,
    level: level,
    rating: 1500,
    played: 0,
    gender: gender || "m",
    ranking: 0,
    win: 0,
    lose: 0,
    winningRate: 0,
  });
  // Player_DB.findOneAndUpdate(filter, update, { new: true, upsert: true }).catch(
  //   (e) => {
  //     console.log(e);
  //   }
  // );
  player.save().catch((e) => {
    console.log(e);
  });
}
