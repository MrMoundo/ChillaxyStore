const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Read Codes.json
const codesPath = path.join(__dirname, "Files", "Codes.json");
let codes = [];

fs.readFile(codesPath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading Codes.json:", err);
        return;
    }
    codes = JSON.parse(data);
    console.log("Codes loaded successfully:", codes); // إضافة هذا السطر للتحقق
});

// API to fetch all codes
app.get("/get-codes", (req, res) => {
    res.json(codes);
});

// API to fetch code details
app.get("/get-code/:code", (req, res) => {
    const code = req.params.code;
    const foundCode = codes.find(c => c.code === code);
    if (!foundCode) {
        return res.status(404).json({ message: "Code not found!" });
    }
    res.json(foundCode);
});

// Serve index.html as default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));