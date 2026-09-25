const http = require("http");
const fs = require("fs");

const PORT = 3000;
const FILE = "students.json";

// Create HTTP server
const server = http.createServer((req, res) => {

    // Home page
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Record System</title>

                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        padding: 40px;
                    }

                    .container {
                        width: 400px;
                        margin: auto;
                        background: white;
                        padding: 25px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px gray;
                    }

                    h1 {
                        text-align: center;
                    }

                    label {
                        display: block;
                        margin-top: 12px;
                        font-weight: bold;
                    }

                    input {
                        width: 100%;
                        padding: 10px;
                        margin-top: 5px;
                        box-sizing: border-box;
                    }

                    button {
                        width: 100%;
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: #0056b3;
                    }

                    .link {
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>

            <body>

                <div class="container">

                    <h1>Student Record Form</h1>

                    <form method="POST" action="/add">

                        <label>Student Name</label>
                        <input type="text" name="name" required>

                        <label>Roll Number</label>
                        <input type="text" name="roll" required>

                        <label>Course</label>
                        <input type="text" name="course" required>

                        <label>Email</label>
                        <input type="email" name="email" required>

                        <button type="submit">
                            Add Student
                        </button>

                    </form>

                    <div class="link">
                        <a href="/students">View Student Records</a>
                    </div>

                </div>

            </body>
            </html>
        `);
    }

    // Add student
    else if (req.url === "/add" && req.method === "POST") {

        let body = "";

        // Receive form data
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            // Convert form data into object
            const params = new URLSearchParams(body);

            const student = {
                name: params.get("name"),
                roll: params.get("roll"),
                course: params.get("course"),
                email: params.get("email")
            };

            // Read existing students
            fs.readFile(FILE, "utf8", (err, data) => {

                let students = [];

                if (!err && data) {
                    try {
                        students = JSON.parse(data);
                    } catch (error) {
                        students = [];
                    }
                }

                // Add new student
                students.push(student);

                // Save student data
                fs.writeFile(
                    FILE,
                    JSON.stringify(students, null, 2),
                    err => {

                        if (err) {
                            res.writeHead(500, {
                                "Content-Type": "text/html"
                            });

                            res.end("<h1>Error saving student record</h1>");
                            return;
                        }

                        // Redirect to students page
                        res.writeHead(302, {
                            Location: "/students"
                        });

                        res.end();
                    }
                );
            });
        });
    }

    // Display students
    else if (req.url === "/students" && req.method === "GET") {

        fs.readFile(FILE, "utf8", (err, data) => {

            let students = [];

            if (!err && data) {
                try {
                    students = JSON.parse(data);
                } catch (error) {
                    students = [];
                }
            }

            let rows = "";

            students.forEach((student, index) => {

                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.course}</td>
                        <td>${student.email}</td>
                    </tr>
                `;
            });

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(`
                <!DOCTYPE html>
                <html>

                <head>
                    <title>Student Records</title>

                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            padding: 30px;
                        }

                        h1 {
                            text-align: center;
                        }

                        table {
                            width: 90%;
                            margin: auto;
                            border-collapse: collapse;
                            background-color: white;
                        }

                        th, td {
                            border: 1px solid #ccc;
                            padding: 12px;
                            text-align: center;
                        }

                        th {
                            background-color: #007bff;
                            color: white;
                        }

                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }

                        .back {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>

                <body>

                    <h1>Student Records</h1>

                    <table>

                        <tr>
                            <th>S.No.</th>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Course</th>
                            <th>Email</th>
                        </tr>

                        ${rows}

                    </table>

                    <div class="back">
                        <a href="/">Add Another Student</a>
                    </div>

                </body>

                </html>
            `);
        });
    }

    // Page not found
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>404 - Page Not Found</h1>
            <a href="/">Go Home</a>
        `);
    }

});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});