import { useState, useEffect } from "react";
import "../css/components/post.css";
import { useUser } from "../context/userContext";
import CommentSection from "./comment";
import { API_BASE_URL } from "../config";

interface Comment {
  _id: string;
  user: { _id: string; username: string };
  text: string;
  createdAt: string;
}

interface PostProps {
  id: string;
  user: string;
  title: string;
  date: string;
  content: string;
  image?: string;
  likes: string[];
}

const Post = ({ id, user, content, image, likes, title, date }: PostProps) => {
  const { userData, fetchUser } = useUser();
  const userId = userData ? userData._id : "";
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(likes.includes(userId));
  const [postComments, setPostComments] = useState<Comment[]>([]); // ✅ Fetch comments explicitly
  const [showComments, setShowComments] = useState(false); // ✅ Show comments state
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    setIsLiked(likes.includes(userId));
  }, [likes, userId]);

  // ✅ Fetch Comments on Mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/post/${id}/comments`);
        const data = await response.json();
        setPostComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked;

      // ✅ Optimistic UI Update
      setIsLiked(newLikedState);
      setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

      const response = await fetch(`${API_BASE_URL}/post/${id}/like`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error liking post:", await response.json());
        setIsLiked(isLiked);
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  // ✅ Add Comment Handler
  const handleAddComment = async (postId: string, text: string) => {
    if (text.trim() === "") return;

    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json(); // ✅ Get full comment from API

      // ✅ Ensure the added comment has a proper date
      const updatedComment = {
        ...newComment.comment,
        createdAt: new Date(newComment.comment.createdAt), // Ensure valid date
      };

      setPostComments((prevComments) => [...prevComments, updatedComment]); // ✅ Update UI immediately
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  // ✅ Delete Comment Handler
  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}/comment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setPostComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  return (
    <div className="post-container">
      <div className="post-header">
        <span className="post-user">{user}</span>
        <span className="post-date">{date}</span>
      </div>

      <div className="post-body">
        <p>{title}</p>
        {image && <img src={image} alt="Post" className="post-image" />}
        <p>{content}</p>
      </div>

      <div className="post-footer">
        <button onClick={handleLike} className={`post-like-button ${isLiked ? "active" : ""}`}>
          👍 {likeCount}
        </button>
        <span className="post-comments-count" onClick={() => setShowComments((prev) => !prev)}>
          {postComments.length} Comments
        </span>
      </div>
      <div className="comment-section-all" style={{ display: showComments ? "block" : "none" }}>
        <CommentSection
          postId={id}
          userId={userId}
          comments={postComments}
          addComment={handleAddComment}
          deleteComment={handleDeleteComment}
        />
      </div>
    </div >
  );
};

export default Post;
