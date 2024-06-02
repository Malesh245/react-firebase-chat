import React from "react";
import "./list.css";

import ChatList from "./chatList/ChatList";
import UserInfo from "./userinfo/UserInfo";
function List() {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
}

export default List;
