const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(
  path.join(__dirname, "scraping", "data", "players")
);
const women_name = [
  "숙",
  "순",
  "희",
  "미",
  "자",
  "리",
  "경",
  "하",
  "애",
  "영",
  "례",
  "알",
  "혜",
  "옥",
  "린",
  "임",
  "이",
  "윤",
  "은",
  "연",
  "아",
  "유",
  "서",
  "율",
  "주",
  "나",
  "민",
  "온",
  "율",
  "랑",
  "정",
  "인",
  "별",
  "연",
  "화",
  "채",
  "란",
  "림",
  "심",
];
let total_player = {};

for (let i = 0; i < files.length; i++) {
  const data = fs.readFileSync(
    path.join(__dirname, "scraping", "data", "players", files[i]),
    "utf8"
  );
  const players = JSON.parse(data);
  for (let i = 0; i < players.length; i++) {
    if (players[i].level.length === 0) {
      continue;
    }
    if (
      women_name.includes(players[i].name.substr(players[i].name.length - 1, 1))
    ) {
      players[i].gender = "w";
    } else {
      players[i].gender = "m";
    }
    total_player[players[i].name] = {
      level: players[i].level,
      gender: players[i].gender,
    };
  }
}

let player_array = [];
let men = [];
let women = [];
for (key in total_player) {
  if (total_player[key].gender === "w") {
    women.push({
      name: key,
      level: total_player[key].level,
      gender: total_player[key].gender,
    });
  } else {
    men.push({
      name: key,
      level: total_player[key].level,
      gender: total_player[key].gender,
    });
  }
}

player_array = men.concat(women);
console.log(player_array);

fs.writeFileSync(
  path.join(__dirname, "scraping", "data", "players", "total"),
  JSON.stringify(player_array)
);
