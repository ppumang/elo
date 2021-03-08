const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/pingpong";
const DB = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const PlayerSchema = require("./PlayerSchema").PlayerSchema;

const Player_DB = DB.model("player", PlayerSchema);

async function rank() {
  const players = await Player_DB.find().sort({ rating: -1 });
  for (let i = 0; i < players.length; i++) {
    console.log("name:", players[i].name, ", ", "ranking:", i + 1);
    let winningRate =
      Number(players[i].win) + Number(players[i].lose) === 0
        ? 0
        : parseInt(players[i].win) /
          (parseInt(players[i].win) + parseInt(players[i].lose));
    winningRate *= 100;
    winningRate = winningRate.toFixed(2);
    console.log(players[i].win, players[i].lose, winningRate);
    await players[i].update({
      ranking: i + 1,
      winningRate: parseInt(winningRate),
    });
  }
}

rank();
