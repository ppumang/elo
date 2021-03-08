const fs = require("fs");
const path = require("path");

let men = [];
let women = [];
let players = fs.readFileSync(
  path.join(__dirname, "scraping", "data", "players", "total"),
  "utf8"
);
players = JSON.parse(players);

for (let i = 0; i < players.length; i++) {
  if (players[i].level.length === 0) {
    console.log(players[i]);
  }
  if (players[i].gender === "m") {
    men.push(players[i]);
  } else {
    women.push(players[i]);
  }
}

fs.writeFileSync(
  path.join(__dirname, "scraping", "data", "players", "men"),
  JSON.stringify(men)
);

fs.writeFileSync(
  path.join(__dirname, "scraping", "data", "players", "women"),
  JSON.stringify(women)
);
