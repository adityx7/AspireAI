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
                        backgroundColor: "#0288d1",
                        color: "white",
                        width: 56,
                        height: 56,
                        "&:hover": { backgroundColor: "#0277bd" },
                    }}
                >
                    <ChatIcon />
                </IconButton>
            )}

            {/* Chat Window (Styled Similar to AnalysisModal) */}
            {open && (
                <Paper
                    elevation={3}
                    sx={{
                        width: 320,
                        height: 420,
                        position: "fixed",
                        bottom: 80,
                        right: 20,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#FBF5DD",
                        borderRadius: "8px",
                        boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 6px",
                    }}
                >
                    {/* Chat Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #ccc",
                            pb: 1,
                            mb: 1,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontFamily: "Courier", fontWeight: "bold", fontSize: '18px' }}>
                            Student
                        </Typography>
                        <IconButton onClick={() => setOpen(false)}>
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
                            gap: 1,
                            p: 1,
                            maxHeight: "270px",
                            bgcolor: "white",
                            borderRadius: "8px",
                            boxShadow: 2,
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    backgroundColor: msg.sender === "user" ? "#A3D8FF" : "#FFE6C9",
                                    color: "#333",
                                    p: 1.2,
                                    borderRadius: "8px",
                                    maxWidth: "75%",
                                    fontSize: "14px",
                                    boxShadow: 1,
                                }}
                            >
                                {msg.text}
                            </Box>
                        ))}
                    </Box>

                    {/* Chat Input */}
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress} // Send message on Enter
                            inputRef={inputRef} // Keep input focused
                            sx={{ bgcolor: "white", borderRadius: "8px" }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            sx={{ borderRadius: "8px" }}
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
