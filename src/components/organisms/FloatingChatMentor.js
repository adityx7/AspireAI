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
    const inputRef = useRef(null);

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
        setInput("");
        inputRef.current?.focus();

        setTimeout(() => {
            setMessages((prev) => [...prev, { text: "Thank you for your query! We'll assist you shortly.", sender: "bot" }]);
        }, 1000);
    };

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
                        background: "linear-gradient(135deg, #D4AF37 0%, #5B4FCF 100%)",
                        color: "white",
                        width: 64,
                        height: 64,
                        boxShadow: "0 6px 20px rgba(91, 79, 207, 0.4)",
                        transition: "all 0.3s ease",
                        animation: "pulse 2s infinite",
                        "&:hover": { 
                            background: "linear-gradient(135deg, #F4D03F 0%, #7B6FE8 100%)",
                            transform: "scale(1.1) rotate(5deg)",
                            boxShadow: "0 8px 30px rgba(212, 175, 55, 0.6)",
                        },
                    }}
                >
                    <ChatIcon sx={{ fontSize: 32 }} />
                </IconButton>
            )}

            {/* Chat Window */}
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
                        background: "linear-gradient(135deg, #FFF9E6 0%, #E8E4F3 100%)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(91, 79, 207, 0.3), 0 0 20px rgba(212, 175, 55, 0.2)",
                        border: "2px solid rgba(212, 175, 55, 0.3)",
                        animation: "slideInUp 0.4s ease-out",
                    }}
                >
                    {/* Chat Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                            pb: 1,
                            mb: 1,
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontFamily: "'Russo One', sans-serif", 
                                fontWeight: "bold", 
                                fontSize: '18px',
                                background: "linear-gradient(135deg, #D4AF37 0%, #5B4FCF 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Student Chat
                        </Typography>
                        <IconButton 
                            onClick={() => setOpen(false)}
                            sx={{
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(91, 79, 207, 0.1)",
                                    transform: "rotate(90deg)",
                                }
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
                            gap: 1,
                            p: 1,
                            maxHeight: "270px",
                            background: "linear-gradient(to bottom, #FFFBF5, #F5F3FF)",
                            borderRadius: "8px",
                            boxShadow: "inset 0px 2px 8px rgba(91, 79, 207, 0.15)",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    background: msg.sender === "user" 
                                        ? "linear-gradient(135deg, #5B4FCF 0%, #7B6FE8 100%)"
                                        : "linear-gradient(135deg, #FFE8A3 0%, #F4E5FF 100%)",
                                    color: msg.sender === "user" ? "white" : "#2D2D2D",
                                    p: 1.2,
                                    borderRadius: "12px",
                                    maxWidth: "75%",
                                    fontSize: "14px",
                                    boxShadow: msg.sender === "user" 
                                        ? "0px 3px 10px rgba(91, 79, 207, 0.4)" 
                                        : "0px 3px 10px rgba(212, 175, 55, 0.3)",
                                    border: msg.sender === "user" 
                                        ? "none" 
                                        : "1px solid rgba(212, 175, 55, 0.3)",
                                    animation: "slideIn 0.3s ease-out",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: msg.sender === "user" 
                                            ? "0px 5px 15px rgba(91, 79, 207, 0.5)" 
                                            : "0px 5px 15px rgba(212, 175, 55, 0.4)",
                                    }
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
                            onKeyPress={handleKeyPress}
                            inputRef={inputRef}
                            sx={{ 
                                bgcolor: "white", 
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": {
                                        borderColor: "#D4AF37",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#5B4FCF",
                                        borderWidth: "2px",
                                    }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            sx={{ 
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)",
                                    transform: "scale(1.05)",
                                    boxShadow: "0 4px 12px rgba(212, 175, 55, 0.5)",
                                }
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
