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

const files = fs.readdirSync(
  path.join(__dirname, "..", "scraping", "data", "league")
);

async function simulation() {
  for (let i = 0; i < files.length; i++) {
    let games = fs.readFileSync(
      path.join(__dirname, "..", "scraping", "data", "league", files[i]),
      "utf8"
    );
    games = JSON.parse(games);
    for (let i = 0; i < games.length; i++) {
      let game = games[i];
      try {
        let A = await Player_DB.findOne({ name: game.winner.name });
        let B = await Player_DB.findOne({ name: game.loser.name });
        let AScore = game.winner.score;
        let BScore = game.loser.score;
        match(A, B, AScore, BScore);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function match(A, B, AScore, BScore) {
  console.log("match!", A.name, "vs", B.name);
  const ALevel = A.gender === "m" ? A.level : A.level + 2;
  const BLevel = B.gender === "m" ? B.level : B.level + 2;

  console.log(A.name, ALevel, A.rating, AScore);
  console.log(B.name, BLevel, B.rating, BScore);

  const QA = Math.pow(100, (A.rating + (ALevel - BLevel) * 50) / 400);
  console.log("QA:", QA);
  const QB = Math.pow(100, (B.rating + (BLevel - ALevel) * 50) / 400);
  console.log("QB:", QB);

  const EA = QA / (QA + QB);
  const EB = QB / (QA + QB);
  const AK = A.rating > 2400 ? 12 : A.rating > 2100 ? 24 : 32;
  const BK = B.rating > 2400 ? 12 : B.rating > 2100 ? 24 : 32;

  const norm_AScore = normalize(AScore, BScore);
  const norm_BScore = normalize(BScore, AScore);

  console.log("norm_AScore:", norm_AScore);
  console.log("norm_BScore:", norm_BScore);

  A.rating += AK * (norm_AScore - EA);
  B.rating += BK * (norm_BScore - EB);
  A.played++;
  B.played++;

  if (AScore === 3) {
    A.win++;
    B.lose++;
  } else {
    A.lose++;
    B.win++;
  }

  A.save().catch((e) => {
    console.log(e);
  });
  B.save().catch((e) => {
    console.log(e);
  });
}

function normalize(AScore, BScore) {
  const Smaller = AScore > BScore ? BScore : AScore;
  let p;
  if (Smaller === 0) {
    p = 1 / 16;
  } else if (Smaller === 1) {
    p = 7 / 32;
  } else if (Smaller === 2) {
    p = 13 / 32;
  } else {
    throw "err";
  }

  if (AScore > BScore) {
    return 1 - p;
  } else {
    return p;
  }
}

simulation();
