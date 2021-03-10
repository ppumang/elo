const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/pingpong";
const DB = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const PlayerSchema = require("./PlayerSchema").PlayerSchema;
const Player_DB = DB.model("player", PlayerSchema);
const MatchHistorySchema = require("./MatchHistorySchema").MatchHistorySchema;
const MatchHistory = DB.model("match-history", MatchHistorySchema);

const files = fs.readdirSync(
  path.join(__dirname, "..", "scraping", "data", "league")
);

async function saveData() {
  for (let i = 0; i < files.length; i++) {
    let games = fs.readFileSync(
      path.join(__dirname, "..", "scraping", "data", "league", files[i]),
      "utf8"
    );
    games = JSON.parse(games);
    for (let i = 0; i < games.length; i++) {
      let game = games[i];
      try {
        let A = await Player_DB.findOne(
          { name: game.winner.name },
          { _id: 1 }
        ).lean();
        let B = await Player_DB.findOne(
          { name: game.loser.name },
          { _id: 1 }
        ).lean();
        if (!A || !B) {
          continue;
        }
        let AScore = game.winner.score;
        let BScore = game.loser.score;
        const historyA = new MatchHistory({
          userId: A._id,
          opponentId: B._id,
          score: AScore,
          opponentScore: BScore,
          win: true,
        });
        const historyB = new MatchHistory({
          userId: B._id,
          opponentId: A._id,
          score: BScore,
          opponentScore: AScore,
          win: false,
        });
        console.log(historyA);
        historyA.save().catch((e) => {
          console.log(e);
        });
        historyB.save().catch((e) => {
          console.log(e);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
}

saveData();
