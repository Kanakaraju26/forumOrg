import { useEffect, useState } from "react";
import "../css/components/chatlist.css";
import { API_BASE_URL } from "../config";


interface ChatListProps {
  userId: string;
  selectChat: (chatUserId: string) => void; // Function to select chat in parent
}

const ChatList: React.FC<ChatListProps> = ({ userId, selectChat }) => {
  const [recentChats, setRecentChats] = useState<{ sender: string; receiver: string }[]>([]);
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // Fixed
  
  // Fetch users
  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/users`)
      .then((res) => res.json())
      .then((data) => {
        const usersMap: { [key: string]: string } = {};
        data.forEach((user: { _id: string; username: string }) => {
          usersMap[user._id] = user.username;
        });
        setUsers(usersMap);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Fetch recent chats
  useEffect(() => {
    fetch(`${API_BASE_URL}/chat/recent-chats/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const uniqueUsers = new Set<string>();
        const filteredChats = data.filter((chat: { sender: string; receiver: string }) => {
          const chatUser = chat.sender === userId ? chat.receiver : chat.sender;
          if (!uniqueUsers.has(chatUser)) {
            uniqueUsers.add(chatUser);
            return true;
          }
          return false;
        });
        setRecentChats(filteredChats);
      })
      .catch((error) => console.error("Error fetching recent chats:", error));
  }, [userId]);

  // Handle chat selection
  const handleSelectChat = (chatUserId: string) => {
    setSelectedChatId(chatUserId);
    selectChat(chatUserId); // Notify parent about selection
  };

  return (
    <div className="chat-list-container">
      <h2 className="chat-list-title">Recent Chats</h2>
      {recentChats.length === 0 ? (
        <p>No recent chats</p>
      ) : (
        <ul className="chat-list">
          {recentChats.map((chat) => {
            const chatUserId = chat.sender === userId ? chat.receiver : chat.sender;
            const chatUsername = users[chatUserId] || "Unknown User";

            return (
              <li
                key={chatUserId}
                onClick={() => handleSelectChat(chatUserId)}
                className={`chat-list-item ${selectedChatId === chatUserId ? "selected" : ""}`}
              >
                <strong className={`chat-username ${selectedChatId === chatUserId ? "selected" : ""}`}>{chatUsername}</strong>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
