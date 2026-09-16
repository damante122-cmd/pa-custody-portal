const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS motions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      statute TEXT,
      description TEXT
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM motions", (err, row) => {
    if (err) {
      console.error("Database query error:", err);
      return;
    }
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO motions (title, statute, description) VALUES (?, ?, ?)");

      const sampleMotions = [
        ["Petition for Modification of Custody Order", "23 Pa.C.S. § 5338", "Filed when a substantial change in circumstances occurs requiring a modification of an existing custody decree."],
        ["Motion for Special Relief in Custody", "Pa.R.C.P. 1915.13", "Emergency or interim relief requested to preserve the safety or well-being of a child pending full hearing."],
        ["Petition for Civil Contempt for Disobedience of Custody Order", "23 Pa.C.S. § 5323(g)", "Filed when one party willfully fails to comply with an existing court-ordered custody schedule."],
        ["Petition for Relocation", "23 Pa.C.S. § 5337", "Formal notice and legal request to relocate a child's residence that significantly impairs non-relocating parent's custody rights."],
        ["Complaint for Child Support", "23 Pa.C.S. § 4321", "Initial filing requesting support determination governed by PA Child Support Guidelines."]
      ];

      sampleMotions.forEach(motion => stmt.run(motion));
      stmt.finalize();
      console.log("Database initialized with default PA Family Law motions.");
    }
  });
});

module.exports = db;
