const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./data/pa_family_law.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS motions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    title TEXT,
    rule_statute TEXT,
    purpose TEXT
  )`);

  db.get("SELECT COUNT(*) AS count FROM motions", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO motions (category, title, rule_statute, purpose) VALUES (?, ?, ?, ?)");
      
      // I. COMPLAINTS & INITIAL PLEADING FILINGS
      stmt.run("Initial Pleading", "Complaint in Divorce", "23 Pa.C.S. § 3301", "Initiates dissolution of marriage; includes equitable distribution, APL, and costs.");
      stmt.run("Initial Pleading", "Complaint for Custody", "23 Pa.C.S. § 5321", "Establishes initial legal and physical custody rights for minor children.");
      stmt.run("Initial Pleading", "Complaint for Support", "DRS Rules", "Initiates a DRS action for child support, spousal support, or alimony pendente lite.");
      stmt.run("Initial Pleading", "Petition for Protection From Abuse (PFA)", "23 Pa.C.S. § 6106", "Commences an action alleging abuse between family or household members.");
      stmt.run("Initial Pleading", "Petition for PSVI", "42 Pa.C.S. § 6204", "Commences safety action against non-family or non-household members.");
      stmt.run("Initial Pleading", "Petition for Adjudication of Paternity", "General", "Filed to legally establish a biological father's status.");
      stmt.run("Initial Pleading", "Complaint for Grandparent or Third-Party Custody", "23 Pa.C.S. § 5324 / 5325", "Initiates an action for partial or full custody based on standing rules.");
      stmt.run("Initial Pleading", "Petition for Voluntary Relinquishment of Parental Rights", "General", "Filed by a birth parent seeking to give up rights permanently.");
      stmt.run("Initial Pleading", "Petition for Involuntary Termination of Parental Rights", "General", "Filed to legally sever parental rights based on statutory grounds.");
      stmt.run("Initial Pleading", "Petition for Adoption", "General", "Initiates a request to establish a permanent, legal parent-child relationship.");
      stmt.run("Initial Pleading", "Petition for Change of Name (Adult or Minor)", "General", "Commences formal request to legally change a name.");

      // II. MOTIONS FOR INTERIM AND PRE-TRIAL FINANCIAL RELIEF
      stmt.run("Interim Financial", "Motion for Alimony Pendente Lite (APL)", "General", "Requests temporary financial support during litigation.");
      stmt.run("Interim Financial", "Motion for Interim Counsel Fees, Costs, and Expenses", "General", "Seeks funding from higher-earning spouse for legal costs.");
      stmt.run("Interim Financial", "Motion for Special Relief / Freeze Assets", "Pa.R.C.P. 1920.43", "Preserves marital property and prevents dissipation of assets.");
      stmt.run("Interim Financial", "Motion to Compel Discovery", "General", "Forces compliance with Interrogatories or Document Requests (tax returns, etc.).");
      stmt.run("Interim Financial", "Motion for Sanctions for Failure to Comply with Discovery", "General", "Requests penalties or default judgments for persistent discovery refusal.");
      stmt.run("Interim Financial", "Motion for Appointment of a Divorce Master", "Pa.R.C.P. 1920.51", "Refers complex economic claims to a hearing officer.");

      // III. CUSTODY-SPECIFIC PROCEDURAL AND SUBSTANTIVE MOTIONS
      stmt.run("Custody Substantive", "Petition for Modification of a Custody Order", "23 Pa.C.S. § 5338", "Permanently alters physical or legal schedules due to substantial change in circumstances.");
      stmt.run("Custody Substantive", "Petition for Special Relief in Custody", "Pa.R.C.P. 1915.13", "Requests immediate, temporary changes or clarifies ambiguous orders.");
      stmt.run("Custody Substantive", "Emergency Petition for Custody", "Local Rules", "Filed when child faces imminent, severe physical danger or abduction.");
      stmt.run("Custody Substantive", "Notice of Proposed Relocation", "23 Pa.C.S. § 5337", "Mandatory formal notice when moving significantly alters parent access.");
      stmt.run("Custody Substantive", "Counter-Affidavit Regarding Relocation", "General", "Mandatory responsive filing opposing proposed relocation.");
      stmt.run("Custody Substantive", "Motion for Psychological Evaluation / Custody Evaluation", "General", "Requests comprehensive psychological profile of parents and children.");
      stmt.run("Custody Substantive", "Motion for Home Study Evaluation", "General", "Requests formal, objective safety check of residential premises.");
      stmt.run("Custody Substantive", "Motion for Appointment of Guardian Ad Litem (GAL)", "General", "Requests dedicated attorney for child's best interests.");
      stmt.run("Custody Substantive", "Motion for Appointment of legal Counsel for a Minor Child", "General", "Requests legal counsel to argue child's stated preferences.");
      stmt.run("Custody Substantive", "Motion to Intervene in Custody Action", "General", "Filed by individuals seeking standing to be added as formal parties.");

      // IV. SUPPORT AND DOMESTIC RELATIONS EXTRAORDINARY MOTIONS
      stmt.run("Support Actions", "Petition for Modification of a Support Order", "Pa.R.C.P. 1910.19", "Adjusts monthly obligations due to material change in income.");
      stmt.run("Support Actions", "Demand for a Hearing De Novo", "General", "Appeal motion demanding a full hearing before a Judge post-conference.");
      stmt.run("Support Actions", "Motion to Dismiss Support Complaint", "General", "Procedural challenge arguing lack of legal basis or improper deviations.");
      stmt.run("Support Actions", "Motion for Special Relief in Support Matters", "General", "Immediate adjustment for extraordinary medical bills or tuition spikes.");

      // V. ENFORCEMENT, COMPLIANCE, AND SANCTIONS MOTIONS
      stmt.run("Enforcement", "Petition for Civil Contempt (Custody)", "Pa.R.C.P. 1915.12", "Alleges willful violation of custody schedule, seeking fines or jail.");
      stmt.run("Enforcement", "Petition for Civil Contempt (Support)", "Pa.R.C.P. 1910.21", "Alleges willful non-payment of court-ordered financial obligations.");
      stmt.run("Enforcement", "Motion to Enforce Marriage Settlement Agreement (MSA)", "General", "Compels execution of contractual obligations signed in divorce.");
      stmt.run("Enforcement", "Motion for Wage Attachment / Income Withholding Order", "General", "Direct garnishment of earnings from an employer.");
      stmt.run("Enforcement", "Motion to Reduce Arrears to Judgment", "General", "Converts unpaid support into civil judgment attaching to property.");

      // VI. PROCEDURAL PRE-TRIAL, MOTION COURT, AND TRIAL ACTIONS
      stmt.run("Procedural/Pre-Trial", "Preliminary Objections", "Pa.R.C.P. 1028", "Dismissal request based on procedural, jurisdiction, or legal defects.");
      stmt.run("Procedural/Pre-Trial", "Motion for Continuance", "General", "Written request to postpone a scheduled trial or master's hearing.");
      stmt.run("Procedural/Pre-Trial", "Motion to Withdraw Appearance of Counsel", "General", "Attorney seeks permission to cease representation of a party.");
      stmt.run("Procedural/Pre-Trial", "Motion for Leave to Amend Pleading", "General", "Requests authorization to adjust factual assertions in a complaint.");
      stmt.run("Procedural/Pre-Trial", "Motion for Pre-Trial Conference", "General", "Judge assembles parties to organize settlement parameters and trial exhibits.");
      stmt.run("Procedural/Pre-Trial", "Motion in Limine", "General", "Pre-trial motion asking court to exclude irrelevant or prejudicial evidence.");
      stmt.run("Procedural/Pre-Trial", "Motion to Consolidate Actions", "General", "Requests separate related cases be joined under a single master docket.");
      stmt.run("Procedural/Pre-Trial", "Motion for Bifurcation of Divorce", "General", "Severs the divorce decree from unresolved property division matters.");
      stmt.run("Procedural/Pre-Trial", "Praecipe to Transmit the Record", "General", "Administrative cover prompting court to sign the final Divorce Decree.");

      // VII. APPELLATE AND POST-TRIAL MOTIONS
      stmt.run("Appellate/Post-Trial", "Motion for Reconsideration", "Pa.R.C.P. 1930.2", "Filed within 30 days asking trial judge to fix a clear factual/legal error.");
      stmt.run("Appellate/Post-Trial", "Notice of Appeal to the Superior Court of Pennsylvania", "General", "Commences formal appellate review by a higher state court.");
      stmt.run("Appellate/Post-Trial", "Rule 1925(b) Statement", "General", "Itemized outline specifying exactly what errors the trial judge committed.");
      stmt.run("Appellate/Post-Trial", "Motion to Stay Pending Appeal", "General", "Pauses enforcement of a trial order while higher court reviews challenges.");

      // VIII. MANDATORY UNIVERSAL ADMINISTRATIVE FILINGS
      stmt.run("Universal Admin", "Proposed Order of Court", "General", "Mandatory layout accompanying every petition outlining requested relief.");
      stmt.run("Universal Admin", "Certificate of Service", "General", "Confirms date, location, and precise mechanism opposing party was served.");
      stmt.run("Universal Admin", "Confidential Information Form (CIF)", "Public Access Policy", "Isolates sensitive details from public inspection.");
      stmt.run("Universal Admin", "Criminal Record/Abuse History Verification", "General", "Mandatory disclosure detailing background of household members.");

      stmt.finalize();
    }
  });
});

app.get('/api/table-of-contents', (req, res) => {
  db.all("SELECT * FROM motions ORDER BY category, title", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ motions: rows });
  });
});

function analyzeFatherDocument(textContent) {
  const lowerText = textContent.toLowerCase();
  let analysis = {
    detectedDocument: "General PA Family Court Order/Notice",
    applicableStatute: "23 Pa.C.S. Domestic Relations",
    fatherProtections: "",
    recommendedActions: []
  };

  if (lowerText.includes("custody") || lowerText.includes("visitation") || lowerText.includes("1915.")) {
    analysis.detectedDocument = "Custody Order / Notice of Conference";
    analysis.applicableStatute = "23 Pa.C.S. § 5328(b) (Mandatory Gender Neutrality)";
    analysis.fatherProtections = "PA Law Explicitly Prohibits Gender Preference: 23 Pa.C.S. § 5328(b) dictates courts CANNOT favor mothers over fathers based on gender.";
    analysis.recommendedActions = [
      "Document all daily parenting tasks (school drops, meals, medical visits) to satisfy § 5328 Custody Factors.",
      "Keep a precise calendar log of every instance custody or visitation was offered, granted, or denied.",
      "If the other party is withholding visitation, file a Petition for Civil Contempt (Pa.R.C.P. 1915.12) immediately.",
      "File Criminal Record / Abuse History Verification (Pa.R.C.P. 1915.3-2) along with your custody response."
    ];
  } else if (lowerText.includes("support") || lowerText.includes("dr-") || lowerText.includes("1910.")) {
    analysis.detectedDocument = "Domestic Relations Support Notice / Conference";
    analysis.applicableStatute = "Pa.R.C.P. No. 1910.16-4 (Substantial Shared Physical Custody Offset)";
    analysis.fatherProtections = "Shared Custody Support Discount: Fathers with 40% or more overnights (146+ nights/year) qualify for an automatic reduction in basic support obligations.";
    analysis.recommendedActions = [
      "Bring exact proof of overnight custody days (school calendars, message logs, co-parenting app exports).",
      "Bring 6 months of pay stubs, most recent tax return, and proof of health insurance costs paid for children.",
      "If income dropped significantly, file a Petition for Modification of Support (Pa.R.C.P. 1910.26(b))."
    ];
  } else if (lowerText.includes("protection") || lowerText.includes("abuse") || lowerText.includes("pfa")) {
    analysis.detectedDocument = "Temporary Protection From Abuse (PFA) Order";
    analysis.applicableStatute = "23 Pa.C.S. § 6107 (10-Day Final Hearing Mandate)";
    analysis.fatherProtections = "Strict Due Process Rights: Temporary PFAs issued ex-parte must proceed to a full evidentiary hearing within 10 business days.";
    analysis.recommendedActions = [
      "Do NOT violate the temporary order under any circumstances (doing so triggers indirect criminal contempt).",
      "Subpoena text messages, call logs, location records, and witness testimony showing false claims.",
      "Request temporary custody or contact provisions for the children during the final hearing."
    ];
  } else {
    analysis.recommendedActions = [
      "Check docket header for county court name, docket number, and filing deadlines.",
      "Always attach Proposed Order, Certificate of Service, and Confidential Information Form (CIF).",
      "Consult local court self-help center or county bar association Pro Se clinic."
    ];
  }

  return analysis;
}

app.post('/api/scan-image', upload.single('documentImage'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file uploaded." });

  try {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(req.file.path);
    await worker.terminate();

    const extractedText = ret.data.text;
    const analysis = analyzeFatherDocument(extractedText);

    res.json({ success: true, extractedText, analysis });
  } catch (err) {
    res.status(500).json({ error: "OCR processing failed: " + err.message });
  }
});

app.listen(PORT, () => console.log(`Pro Se Father PA Law Portal running at http://localhost:${PORT}`));
