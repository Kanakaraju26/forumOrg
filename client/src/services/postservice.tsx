const API_URL = "http://localhost:5000/api/post"; 

// Upload Image
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload image");

  const data = await response.json();
  return data.imageUrl;
};

// Create a Post
export const createPost = async (user: string, title: string, content: string, imageUrl?: string) => {
    const body = JSON.stringify({
        user,
        title,
        content,
        image: imageUrl || null, // Ensure image is handled correctly
      });
  
      console.log("Sending post data:", body); 

  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, title, content, image: imageUrl }),
  });

  if (!response.ok) throw new Error("Failed to create post");

  return await response.json();
};

// Get All Posts
export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) throw new Error("Failed to fetch posts");

  return await response.json();
};

// Delete a Post
export const deletePost = async (postId: string) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete post");

  return await response.json();
};
