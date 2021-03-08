const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const baseUrl = "http://www.koreatakgu.com/seoul/2017/";
const listPath = "Do.jsp?urlSeq=1104&ldf=D&raceSeq=";
let raceSeq = 474;

const url =
  "http://www.koreatakgu.com/seoul/2017/Do.jsp?urlSeq=1104&ldf=D&raceSeq=403";

function scrape(raceSeq) {
  if (raceSeq > 1185) {
    return;
  }
  const url = baseUrl + listPath + raceSeq;
  axios
    .get(url)
    .then((html) => {
      const $ = cheerio.load(html.data);
      const title = $(".wbox > div:nth-child(3)").html();
      if (title.match(/코리아탁구/g)) {
        console.log(title);
        const detailPath = $(
          "tbody > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)"
        ).attr("href");
        const detailUrl = baseUrl + detailPath;
        axios
          .get(detailUrl)
          .then((html) => {
            const $ = cheerio.load(html.data);
            const tbody = $("tbody");
            const numTables = tbody.length;
            let results = [];
            let total_participants = [];

            for (let i = 0; i < numTables; i++) {
              const table = tbody[i];
              const tr = $(table).children("tr");
              const firstRow = $(tr[0]).children("td");
              let participants = [];
              for (let j = 1; j < firstRow.length - 2; j++) {
                const name = $(firstRow[j]).html().split("<br>")[0].trim();
                const level = $(firstRow[j]).html().split("<br>")[1].trim();
                participants.push({ name: name, level: level });
                total_participants.push({ name: name, level: level });
              }
              for (let j = 1; j < tr.length; j++) {
                const td = $(tr[j]).children();
                const name = participants[j - 1].name;
                for (let k = j + 1; k < td.length - 2; k++) {
                  const score = parseInt($(td[k]).html().trim());
                  const opponent = participants[k - 1].name;
                  if (score == 3) {
                    let result = {
                      winner: {
                        name: name,
                        score: 3,
                        level: participants[j - 1].level,
                      },
                      loser: {
                        name: opponent,
                        score: parseInt(
                          $($(tr[k]).children()[j]).html().trim()
                        ),
                        level: participants[k - 1].level,
                      },
                    };
                    results.push(result);
                  } else {
                    let result = {
                      winner: {
                        name: opponent,
                        score: 3,
                        level: participants[k - 1].level,
                      },
                      loser: {
                        name: name,
                        score: score,
                        level: participants[j - 1].level,
                      },
                    };
                    results.push(result);
                  }
                }
              }
            }
            fs.writeFileSync(
              __dirname +
                "/data/league/" +
                title.replace(/[^\d]/gi, "") +
                "_raceSeq=" +
                raceSeq +
                ".json",
              JSON.stringify(results)
            );
            fs.writeFileSync(
              __dirname +
                "/data/participants/" +
                title.replace(/[^\d]/gi, "") +
                "_raceSeq=" +
                raceSeq,
              JSON.stringify(total_participants)
            );
            raceSeq++;
            scrape(raceSeq);
          })
          .catch((err) => {
            console.log(err);
            raceSeq++;
            scrape(raceSeq);
          });
      } else {
        raceSeq++;
        scrape(raceSeq);
      }
    })
    .catch((err) => {
      console.log(err);
      raceSeq++;
      scrape(raceSeq);
    });
}

scrape(raceSeq);
