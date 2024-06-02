import React, { useState } from "react";
import "./addUser.css";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { useUserStore } from "../../../../lib/userStore";
import { db } from "../../../../lib/firebase";

function AddUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // State to manage errors

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setError(null); // Clear previous errors
      } else {
        setUser(null);
        setError("User not found");
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setError("An error occurred while searching for the user.");
    }
  };

  const handleAdd = async () => {
    if (!user || !currentUser) {
      setError("User or current user information is missing.");
      return;
    }

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Create a new chat document
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        messages: [],
      });
      console.log("New chat created with ID:", newChatRef.id);

      // Update the searched user's chat list
      const userChatDocRef = doc(userChatsRef, user.id);
      await updateDoc(userChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updateAt: Date.now(),
        }),
      });
      console.log("User chat updated for user ID:", user.id);

      // Update the current user's chat list
      const currentUserChatDocRef = doc(userChatsRef, currentUser.id);
      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updateAt: Date.now(),
        }),
      });
      console.log("Current user chat updated for user ID:", currentUser.id);

      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Error adding user to chat:", err);
      setError("An error occurred while adding the user.");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>
      {error && <div className="error">{error}</div>}
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
