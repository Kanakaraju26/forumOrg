import { useEffect, useState } from "react";
import Chat from "../components/chat"; 
import { useUser } from "../context/userContext";
import ChatList from "../components/chatlist";
import "../css/pages/chat_page.css"; 
import { API_BASE_URL } from "../config";

const Messages = () => {
  const { userData, fetchUser } = useUser();
  const [users, setUsers] = useState<{ _id: string; username: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [visible,setvisible] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const currentUserId = userData?._id || "";

  useEffect(() => {
    if (!currentUserId) return; 

    fetch(`${API_BASE_URL}/auth/users`)     
     .then((res) => res.json())
      .then((data) => {
        const filteredData = data.filter((user: { _id: string }) => user._id !== currentUserId);
        setUsers(filteredData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [currentUserId]);

  const filteredUsers = users.filter((user) => user.username === searchTerm);

  if (!userData) {
    return <p>You need to be logged in before using message system</p>;
  }


  return (
    <div className="messages-container">
        <div className="message-icon" onClick={()=> setvisible(!visible) }>☰</div>
        <div className={` ${visible? "showMenu" : ""} sidebar`}>
        <h2 className="messages-title">Messages</h2>
        
        <input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <ul className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={user._id}
                className="user-item"
                onClick={() => setReceiverId(user._id)}
              >
                {user.username}
              </li>
            ))
          ) : (
            searchTerm && <p>No user found</p>
          )}
        </ul>

        <ChatList userId={currentUserId} selectChat={setReceiverId} />
      </div>

      <div className="chat-area">
        {receiverId ? (
          <Chat userId={currentUserId} receiverId={receiverId} />
        ) : (
          <p className="no-chat-message">Search and select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Messages;