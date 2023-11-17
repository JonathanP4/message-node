const path = require("path");
const { v4: uuid } = require("uuid");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

const dotenv = require("dotenv");

dotenv.config();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const PORT = process.env.PORT;
const URI = process.env.URI;

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

app.use(bodyParser.json());
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({ message, data });
});

(async function main() {
    try {
        await mongoose.connect(URI);
        const httpServer = app.listen(PORT, () =>
            console.log("Listening on port " + PORT)
        );
        const io = require("./socket").init(httpServer);
        io.on("connection", (socket) => {
            console.log("Client connected");
        });
    } catch (error) {
        console.log(error);
    }
})();
