import express from "express";
import upload from "../middleware/postMiddleware.js";
import {addComment, createPost, deleteComment, deletePost, editPost, fetchComments, fetchPosts, fetchSinglePost, fetchUserpost, likeAndUnlike, uploadImage} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Routes
router.post("/create", upload.single("image"), createPost);
router.post("/upload", upload.single("image"), uploadImage);
router.get("/", fetchPosts);
router.delete("/:id", deletePost);
router.get("/user", authMiddleware, fetchUserpost);
router.put("/:id", authMiddleware, upload.single("image"), editPost);
router.put("/:id/like",authMiddleware,likeAndUnlike);
router.post("/:id/comment",authMiddleware,addComment);
router.delete("/:postId/comment/:commentId",authMiddleware,deleteComment);
router.get("/:id/comments",fetchComments);
router.get("/only",authMiddleware,fetchSinglePost);

export default router;
