import { createContext, useContext, useState, ReactNode } from "react";

interface Post {
  [x: string]: string | undefined;
  id: string;
  user: string;
  title: string;
  content: string;
  image?: string;
}

interface PostContextType {
  posts: Post[];
  addPost: (newPost: Post) => void;
  //fetchPosts: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // const fetchPosts = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/post");
  //     if (!response.ok) throw new Error("Failed to fetch posts");
  //     const data = await response.json();
  //     setPosts(data.posts);
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   }
  // }

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
