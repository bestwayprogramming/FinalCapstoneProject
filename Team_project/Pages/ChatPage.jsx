import React from "react";
import Navbar from "../component/Navbar";
import ChatApp from "../component/ChatApp";

const ChatPage = () => {
  return (
    <>
      <Navbar></Navbar>
      <main>
        <div className="mx-auto ">
          <ChatApp />
        </div>
      </main>
    </>
  );
};

export default ChatPage;
