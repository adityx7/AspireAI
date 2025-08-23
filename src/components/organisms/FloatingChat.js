import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Paper, Typography, TextField, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const FloatingChat = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null); // Reference for input field

    // Auto-focus on input when chat opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 200);
        }
    }, [open]);

    const handleSendMessage = () => {
        if (!input.trim()) return;

        setMessages([...messages, { text: input, sender: "user" }]);
        setInput(""); // Clear input after sending
        inputRef.current?.focus(); // Keep input focused

        // Simulating a bot response
        setTimeout(() => {
            setMessages((prev) => [...prev, { text: "Thank you for your query! We'll assist you shortly.", sender: "bot" }]);
        }, 1000);
    };

    // Handle "Enter" key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
            {/* Floating Chat Icon */}
            {!open && (
                <IconButton
                    onClick={() => setOpen(true)}
                    sx={{
                        background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                        color: "#1e3a8a",
                        width: 64,
                        height: 64,
                        boxShadow: "0 4px 16px rgba(255,215,0,0.4)",
                        border: "2px solid rgba(255,215,0,0.6)",
                        transition: "all 0.3s ease",
                        "&:hover": { 
                            background: "linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)",
                            transform: "scale(1.1)",
                            boxShadow: "0 6px 24px rgba(255,215,0,0.6)",
                        },
                    }}
                >
                    <ChatIcon sx={{ fontSize: 28 }} />
                </IconButton>
            )}

            {/* Chat Window */}
            {open && (
                <Paper
                    elevation={8}
                    sx={{
                        width: 350,
                        height: 450,
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(255,215,0,0.3)",
                        color: "#e2e8f0",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    }}
                >
                    {/* Chat Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "2px solid rgba(255,215,0,0.3)",
                            pb: 2,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", 
                            fontWeight: 700, 
                            fontSize: '20px',
                            color: "#ffd700",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}>
                            💬 Mentor Chat
                        </Typography>
                        <IconButton 
                            onClick={() => setOpen(false)}
                            sx={{
                                color: "#ffd700",
                                "&:hover": {
                                    backgroundColor: "rgba(255,215,0,0.1)",
                                    transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Chat Messages */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            p: 1,
                            maxHeight: "300px",
                            background: "rgba(15,23,42,0.5)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,215,0,0.2)",
                            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    background: msg.sender === "user" 
                                        ? "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)" 
                                        : "linear-gradient(135deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                                    color: msg.sender === "user" ? "#1e3a8a" : "#e2e8f0",
                                    p: 1.5,
                                    borderRadius: "12px",
                                    maxWidth: "80%",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    fontWeight: 500,
                                    boxShadow: msg.sender === "user" 
                                        ? "0 2px 8px rgba(255,215,0,0.3)" 
                                        : "0 2px 8px rgba(0,0,0,0.2)",
                                    border: msg.sender === "user" 
                                        ? "1px solid rgba(255,215,0,0.5)" 
                                        : "1px solid rgba(255,215,0,0.2)",
                                }}
                            >
                                {msg.text}
                            </Box>
                        ))}
                    </Box>

                    {/* Chat Input */}
                    <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            inputRef={inputRef}
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    background: "rgba(15,23,42,0.5)",
                                    borderRadius: "12px",
                                    '& fieldset': {
                                        borderColor: "rgba(255,215,0,0.3)",
                                    },
                                    '&:hover fieldset': {
                                        borderColor: "rgba(255,215,0,0.5)",
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: "#ffd700",
                                    },
                                    '& input': {
                                        color: "#e2e8f0",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                    },
                                    '& input::placeholder': {
                                        color: "#cbd5e1",
                                        opacity: 0.7,
                                    },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            sx={{
                                background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                                color: "#1e3a8a",
                                fontWeight: 600,
                                borderRadius: "12px",
                                minWidth: "48px",
                                height: "40px",
                                boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 24px rgba(255,215,0,0.4)",
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            <SendIcon />
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default FloatingChat;
