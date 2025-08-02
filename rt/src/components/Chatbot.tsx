import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! How can I assist you today?" },
  ]);

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [...prev, { from: "user", text: option }]);

    let botResponse = "";
    if (option === "Purchase Support") {
      botResponse = "Sure! I can help you with our product catalog and payment methods.";
      // TODO: Add your support logic here
    } else if (option === "Your Orders") {
      botResponse = "To view your orders, please log in to your account.";
      // TODO: Hook into order tracking system
    } else if (option === "Product Suggestions") {
      botResponse = "Let me suggest you our most popular products!";
      // TODO: Call product recommendation API
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
    }, 500);
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        <MessageCircle size={24} />
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chatbot Support</span>
            <button onClick={() => setOpen(false)}><X size={20} /></button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-msg ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-options">
            <button onClick={() => handleOptionClick("Purchase Support")}>
              🛍️ Purchase Support
            </button>
            <button onClick={() => handleOptionClick("Your Orders")}>
              📦 Your Orders
            </button>
            <button onClick={() => handleOptionClick("Product Suggestions")}>
              💡 Product Suggestions
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
