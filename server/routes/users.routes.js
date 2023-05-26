var express = require("express");
var router = express.Router();
var db = require("../dbMySQL");

router.get("/", (req, res, next) => {
  db.query("SELECT * FROM datausers.notekeeper", function (err, rows, fields) {
    if (err) {
      res.status(500).json({
        "status code": 500,
        "status messenger": err.message,
      });
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.post("/", async (req, res) => {
  const { content } = req.body;
  try {
    await db.query("INSERT INTO notekeeper (content) VALUES (?)", [content]);
    res.status(201).send("Đã thêm note");
  } catch (error) {
    console.log(error);
    res.status(500).send("Database insertion error");
  }
});

router.delete("/:id", async (req, res) => {
  console.log("id trả về", req.params.id);
  await db.query("DELETE FROM notekeeper WHERE postID = ?", [req.params.id]);
  res.status(204).end();
});
module.exports = router;
