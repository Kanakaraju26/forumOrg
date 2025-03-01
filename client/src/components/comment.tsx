import { useState } from "react";
import "../css/components/comment.css";

interface Comment {
    _id: string;
    user: { _id: string; username: string };
    text: string;
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
    userId: string | null;
    comments: Comment[];
    addComment: (postId: string, text: string) => void;
    deleteComment: (postId: string, commentId: string) => void;
}

const CommentSection = ({ postId, userId, comments, addComment, deleteComment }: CommentSectionProps) => {
    const [newComment, setNewComment] = useState("");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return "Just now";
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        } else if (diffInSeconds < 2592000) {
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        } else if (diffInSeconds < 31536000) {
            return `${Math.floor(diffInSeconds / 2592000)} months ago`;
        } else {
            return `${Math.floor(diffInSeconds / 31536000)} years ago`;
        }
    };

    const handleAddComment = () => {
        if (newComment.trim() === "") return;
        addComment(postId, newComment);
        setNewComment("");
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            <div className="comment-list">
                {comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                            <span className="comment-user">
                                {comment.user ? comment.user.username : "Unknown User"}
                            </span>
                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            {userId === comment.user?._id && (
                                <button className="delete-btn" onClick={() => deleteComment(postId, comment._id)}>
                                    🗑 Delete
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {userId && (
                <div className="comment-input">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Post</button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
