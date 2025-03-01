import { useUser } from "../context/userContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/pages/home.css";
import logo from "../assets/images/logo.jpg";
import Post from "../components/post";
import { fetchPosts } from "../services/postservice";

const Home = () => {
  const { userData, logoutUser, fetchUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserAndPosts = async () => {
      try {
        fetchUser();
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError("Failed to load posts. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    getUserAndPosts();
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="homeComponent">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="logo" height={"35px"} />
        </div>

        {/* Desktop Navigation */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/profile" className="nav-item">Profile</Link>
          <Link to="/about" className="nav-item">About</Link>
          <Link to="/messages" className="nav-item">Message</Link>
          <input type="text" placeholder="Search (Coming Soon)" disabled className="nav-search" />
          <button className="nav-button" onClick={() => (window.location.href = "/create-post")}>Post</button>

          {userData ? (
            <button className="nav-button" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="nav-button" onClick={() => (window.location.href = "/login")}>Login</button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
      </nav>

      {/* Main Content */}
      <div className="home-content">
        {loading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Create a new post!</p>
        ) : (
          <div className="home-posts post-container">
            {posts.map((post, index) => (
              <Post
                key={index}
                id={post._id}
                title={post.title}
                date={new Date(post.createdAt).toDateString() || "Unknown Date"}
                user={post.username || "Anonymous"}
                content={post.content}
                image={post.image}
                likes={post.likes || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
