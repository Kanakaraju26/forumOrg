import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import "../css/pages/profile.css";
import Post from "../components/post";

interface PostType {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  username: string;
  likes?: string[];
  comments?: string[];
}

const Profile = () => {
  const { userData, fetchUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState(userData?.username || "");
  const [password, setPassword] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isEditingPost, setIsEditingPost] = useState<string | null>(null);
  const [editedPost, setEditedPost] = useState<PostType | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser(); 
      setLoading(false); 
    };
  
    fetchData();
  }, []);

  const fetchUserPosts = useCallback(async () => {
    try {
      if (!userData) return;

      const response = await fetch("http://localhost:5000/api/post/user", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch user posts", error);
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && !userData) {
      navigate("/");
    } else {
      setUsername(userData?.username || "");
      fetchUserPosts();
    }
  }, [userData, navigate, loading, fetchUserPosts]);
  
  const handleUpdateUsername = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-username", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      
      if (response.ok) {
        await fetchUser();  
        await fetchUserPosts(); 
        setIsEditingUsername(false);
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message);  
      } else {
        alert("Something went wrong. Please try again."); 
      }
      
    } catch (error) {
      console.error("Error updating username", error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/update-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setPassword("");
        setIsEditingPassword(false);
      }
    } catch (error) {
      console.error("Error updating password", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  // Enable editing mode for a post
  const startEditingPost = (post: PostType) => {
    setIsEditingPost(post._id);
    setEditedPost({ ...post });
  };

  // Update edited post state
  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedPost) {
      setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
    }
  };

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Save edited post with optional new image
  const handleSavePost = async () => {
    if (!editedPost) return;

    const formData = new FormData();
    formData.append("title", editedPost.title);
    formData.append("content", editedPost.content);

    if (selectedImage) {
      formData.append("image", selectedImage);
    } else if (editedPost.image) {
      formData.append("imageUrl", editedPost.image);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/post/${editedPost._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedPosts = posts.map((post) =>
          post._id === editedPost._id
            ? {
                ...editedPost,
                image: selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : editedPost.image,
              }
            : post
        );

        setPosts(updatedPosts);
        setIsEditingPost(null);
        setSelectedImage(null);
      } else {
        console.error("Error updating post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <div className="profile-container">
      <div className="profile-section">
        <h2>Profile Settings</h2>
        <div className="profile-field">
          <label>Username:</label>
          {isEditingUsername ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
            <span>{username}</span>
          )}
          <button
            onClick={() =>
              isEditingUsername ? handleUpdateUsername() : setIsEditingUsername(true)
            }
          >
            {isEditingUsername ? "Save" : "Edit"}
          </button>
        </div>

        <div className="profile-field">
          <label>Change Password:</label>
          {isEditingPassword ? (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : (
            <span>********</span>
          )}
          <button
            onClick={() =>
              isEditingPassword ? handleUpdatePassword() : setIsEditingPassword(true)
            }
          >
            {isEditingPassword ? "Save" : "Change"}
          </button>
        </div>
      </div>

      <div className="post-section">
        <h2>Your Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="post-container">
            {posts.map((post) => (
              <div key={post._id} className="post-item">
                {isEditingPost === post._id ? (
                  <div className="edit-post-form">
                    <input
                      type="text"
                      name="title"
                      value={editedPost?.title || ""}
                      onChange={handlePostChange}
                      placeholder="Edit title"
                    />
                    <textarea
                      name="content"
                      value={editedPost?.content || ""}
                      onChange={handlePostChange}
                      placeholder="Edit description"
                    />

                    {editedPost?.image && !selectedImage && (
                      <img src={editedPost.image} alt="Current Post" width="100" />
                    )}

                    <input type="file" accept="image/*" onChange={handleImageChange} />

                    {selectedImage && (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="New Post"
                        width="100"
                      />
                    )}

                    <button className="save-btn" onClick={handleSavePost}>
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setIsEditingPost(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <Post
                      title={post.title}
                      id={post._id}
                      date={new Date(post.createdAt).toDateString() || "Unknown Date"}
                      user={post.username || "Anonymous"}
                      content={post.content}
                      image={post.image}
                      likes={post.likes || []}
                    />
                    <div className="post-actions">
                      <button onClick={() => startEditingPost(post)}>Edit</button>
                      <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;