const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const feedsController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

router.get("/posts", isAuth, feedsController.getPosts);

router.post(
    "/post",
    isAuth,
    [
        body("title", "Title should be at least 5 characters long")
            .trim()
            .isLength({ min: 5 }),
        body("content", "Description should be at least 5 characters long")
            .trim()
            .isLength({ min: 5 }),
    ],
    feedsController.createPost
);

router.get("/post/:postId", isAuth, feedsController.getPost);

router.put(
    "/post/:postId",
    isAuth,
    [
        body("title", "Title should be at least 5 characters long")
            .trim()
            .isLength({ min: 5 }),
        body("content", "Description should be at least 5 characters long")
            .trim()
            .isLength({ min: 5 }),
    ],
    feedsController.updatePost
);

router.delete("/post/:postId", isAuth, feedsController.deletePost);

router.get("/status", isAuth, feedsController.getStatus);

router.put(
    "/status",
    isAuth,
    body("status").trim().notEmpty(),
    feedsController.updateStatus
);

module.exports = router;
