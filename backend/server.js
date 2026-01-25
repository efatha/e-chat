const express = require("express");
const cors = require("cors");
const { PRIVATE_KNOWLEDGE } = require("./privateData");

const app = express();
const PORT = 3000;

app.use(cors()); // allow frontend fetch

// Endpoint to serve private knowledge
app.get("/getPrivateKnowledge", (req, res) => {
  res.json({ PRIVATE_KNOWLEDGE });
});

// Serve frontend files for testing
app.use("/", express.static("../Chat"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
