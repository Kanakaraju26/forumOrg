import "../css/pages/create_post.css";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { createPost, uploadImage } from "../services/postservice";

const CreatePost = () => {
  const navigate = useNavigate();
  const { userData, fetchUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, []);

  const [post, setPost] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      // Allowed image types
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
      if (!allowedTypes.includes(file.type)) {
        alert("Only image files (JPG, PNG, GIF, WEBP) are allowed.");
        e.target.value = ""; // Reset input field
        return;
      }
  
      setPost({ ...post, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if(!userData) {
      alert("You must be logged in to create a post.");
      setLoading(false);
      return;
    }
    try {
      let imageUrl: string | undefined = undefined;

      // Upload image if selected
      if (post.image) {
        imageUrl = await uploadImage(post.image);
      }

      // Create post with uploaded image URL
      await createPost(
        userData ? userData.username : "Anonymous",
        post.title,
        post.content|| "",
        imageUrl 
      );
      
      alert("Post created successfully! Redirecting to home page...");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
      setPost({ title: "", content: "", image: null });
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>
      <div className="post-user">Username: {userData ? ` ${userData.username}` : " Anonymous"}</div>
      
      <input
        type="text"
        name="title"
        value={post.title}
        onChange={handleChange}
        placeholder="Enter Post Title"
        required
      />
      
      <textarea
        name="content"
        value={post.content}
        onChange={handleChange}
        placeholder="Write your post here..."
      />

      <input type="file" onChange={handleImageChange} accept="image/*" />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default CreatePost;
