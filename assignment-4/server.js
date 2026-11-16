const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "requests.json");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read data from requests.json
function readRequests() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]");
    }

    const data = fs.readFileSync(DATA_FILE, "utf8");

    return data.trim() ? JSON.parse(data) : [];
}

// Write data to requests.json
function writeRequests(requests) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(requests, null, 2)
    );
}

// =====================================
// GET ALL REQUESTS
// GET /api/requests
// =====================================
app.get("/api/requests", (req, res) => {
    const requests = readRequests();

    res.json(requests);
});

// =====================================
// GET REQUEST BY ID
// GET /api/requests/:id
// =====================================
app.get("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const id = Number(req.params.id);

    const request = requests.find(item => item.id === id);

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    res.json(request);
});

// =====================================
// ADD NEW REQUEST
// POST /api/requests
// =====================================
app.post("/api/requests", (req, res) => {

    const {
        studentName,
        email,
        category,
        description,
        priority
    } = req.body;

    if (
        !studentName ||
        !email ||
        !category ||
        !description ||
        !priority
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const requests = readRequests();

    const newRequest = {
        id: requests.length > 0
            ? Math.max(...requests.map(item => item.id)) + 1
            : 1,

        studentName: studentName,
        email: email,
        category: category,
        description: description,
        priority: priority
    };

    requests.push(newRequest);

    writeRequests(requests);

    res.status(201).json(newRequest);
});

// =====================================
// UPDATE REQUEST
// PUT /api/requests/:id
// =====================================
app.put("/api/requests/:id", (req, res) => {

    const requests = readRequests();

    const id = Number(req.params.id);

    const index = requests.findIndex(
        item => item.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    const {
        studentName,
        email,
        category,
        description,
        priority
    } = req.body;

    if (
        !studentName ||
        !email ||
        !category ||
        !description ||
        !priority
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    requests[index] = {
        id: id,
        studentName: studentName,
        email: email,
        category: category,
        description: description,
        priority: priority
    };

    writeRequests(requests);

    res.json(requests[index]);
});

// =====================================
// DELETE REQUEST
// DELETE /api/requests/:id
// =====================================
app.delete("/api/requests/:id", (req, res) => {

    const requests = readRequests();

    const id = Number(req.params.id);

    const index = requests.findIndex(
        item => item.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    const deletedRequest = requests.splice(index, 1)[0];

    writeRequests(requests);

    res.json({
        message: "Request deleted successfully",
        request: deletedRequest
    });
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Campus Help Desk running at http://localhost:${PORT}`
    );
});