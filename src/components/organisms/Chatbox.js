import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Modal, TextField, IconButton, List, ListItem, Avatar, Paper } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import SendIcon from '@mui/icons-material/NearMeTwoTone';
import RefreshIcon from '@mui/icons-material/RotateLeftTwoTone';
import Bot from "../../assets/bot.png";
import user from '../../assets/User.png';

const MAX_MESSAGE_LENGTH = 250;

const Chatbox = ({ open, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null); // Create a ref for the input field

    useEffect(() => {
        const storedSessionId = localStorage.getItem("sessionId");
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newSessionId = uuidv4();
            setSessionId(newSessionId);
            localStorage.setItem("sessionId", newSessionId);
        }
    }, []);

    // Focus input after every render, not just the initial load
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); // Ensure input field is focused
        }
    }, [messages]); // This will run after every new message

    const formatResponse = (response) => {
        return response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    };

    const sendMessage = async (message) => {
        try {
            setIsLoading(true);
            const thinkingMessage = { role: "assistant", content: "Thinking..." };
            setMessages(prev => [...prev, thinkingMessage]);

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: sessionId
                }),
            });

            const data = await response.json();
            if (data.response && data.response.trim()) {
                const formattedResponse = formatResponse(data.response);
                setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: formattedResponse }]);
            } else {
                setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "Sorry, I encountered an issue. Please try again." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { role: "user", content: input.slice(0, MAX_MESSAGE_LENGTH) };
            setMessages(prev => [...prev, userMessage]);
            setInput("");
            await sendMessage(input);
        }
    };

    const handleRefresh = async () => {
        setMessages([]);
        setInput("");
        localStorage.removeItem("sessionId");
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        localStorage.setItem("sessionId", newSessionId);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: 800 },
                    background: "linear-gradient(120deg, #1e3a8a 0%, #0f172a 100%)",
                    boxShadow: "0 8px 32px 0 rgba(255,215,0,0.2)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    p: 2,
                    borderRadius: 4,
                    maxHeight: '90vh',
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                }}
            >
                {/* Header */}
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif", 
                        textAlign: "center",
                        color: "#ffd700",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                    }}
                >
                    AspireAI Assistant
                </Typography>

                {/* Chat Messages Area */}
                <Paper
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        padding: "12px",
                        mb: "70px",
                        borderRadius: 3,
                        background: "linear-gradient(120deg, rgba(15,23,42,0.5) 0%, rgba(30,58,138,0.3) 100%)",
                        border: "1px solid rgba(255,215,0,0.2)",
                        boxShadow: "inset 0px 2px 8px rgba(0, 0, 0, 0.3)",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#ffd700 rgba(255,215,0,0.1)",
                        "&::-webkit-scrollbar": { 
                            width: "6px"
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(255,215,0,0.1)",
                            borderRadius: "3px"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "rgba(255,215,0,0.5)",
                            borderRadius: "3px",
                            "&:hover": {
                                background: "#ffd700"
                            }
                        }
                    }}
                >
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    mb: 1,
                                }}
                            >
                                {msg.role === "assistant" && (
                                    <Avatar
                                        src={Bot}
                                        sx={{ 
                                            marginRight: '12px', 
                                            width: 40, 
                                            height: 40,
                                            border: "2px solid #ffd700",
                                            boxShadow: "0 2px 8px rgba(255,215,0,0.3)"
                                        }}
                                    />
                                )}
                                <Box
                                    sx={{
                                        bgcolor: msg.role === "user" 
                                            ? 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)' 
                                            : 'linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)',
                                        color: msg.role === "user" ? '#1e3a8a' : '#e2e8f0',
                                        borderRadius: msg.role === "user"
                                            ? "18px 18px 0px 18px"
                                            : "0px 18px 18px 18px",
                                        padding: "12px 16px",
                                        maxWidth: '70%',
                                        minWidth: "auto",
                                        fontSize: "14px",
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                        boxShadow: msg.role === "user" 
                                            ? "0px 4px 12px rgba(255,215,0,0.3)" 
                                            : "0px 4px 12px rgba(0,0,0,0.3)",
                                        border: msg.role === "user" 
                                            ? "none" 
                                            : "1px solid rgba(255,215,0,0.2)",
                                        wordWrap: "break-word",
                                        display: "inline-block",
                                        fontWeight: msg.role === "user" ? 600 : 400,
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.role === "assistant"
                                            ? msg.content.replace(/\n/g, "<br/>")
                                            : msg.content.replace(/\n/g, "<br/>")
                                    }}
                                />
                                {msg.role === "user" && (
                                    <Avatar
                                        src={user}
                                        sx={{ 
                                            marginLeft: '12px', 
                                            width: 40, 
                                            height: 40,
                                            border: "2px solid #ffd700",
                                            boxShadow: "0 2px 8px rgba(255,215,0,0.3)"
                                        }}
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Input Area */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        right: 8,
                        background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: "12px",
                        borderRadius: 3,
                        boxShadow: "0px 4px 16px rgba(255,215,0,0.2)",
                        border: "1px solid rgba(255,215,0,0.3)",
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        disabled={isLoading}
                        inputRef={inputRef} // Set the ref to the TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: "rgba(15,23,42,0.5)",
                                color: "#e2e8f0",
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                "& fieldset": {
                                    borderColor: "rgba(255,215,0,0.3)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "rgba(255,215,0,0.5)",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#ffd700",
                                },
                            },
                            '& .MuiOutlinedInput-input': {
                                padding: "12px 16px",
                                "&::placeholder": {
                                    color: "#cbd5e1",
                                    opacity: 0.7,
                                }
                            }
                        }}
                    />
                    <IconButton 
                        onClick={handleSend} 
                        disabled={isLoading}
                        sx={{
                            background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                            color: "#1e3a8a",
                            "&:hover": {
                                background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                transform: "scale(1.05)",
                            },
                            "&:disabled": {
                                background: "rgba(255,215,0,0.3)",
                                color: "#1e3a8a",
                            },
                            boxShadow: "0 2px 8px rgba(255,215,0,0.3)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                    <IconButton 
                        onClick={handleRefresh} 
                        disabled={isLoading}
                        sx={{
                            background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                            color: "#ffd700",
                            border: "1px solid rgba(255,215,0,0.3)",
                            "&:hover": {
                                background: "linear-gradient(120deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.2) 100%)",
                                transform: "scale(1.05)",
                            },
                            "&:disabled": {
                                background: "rgba(30,58,138,0.3)",
                                color: "rgba(255,215,0,0.5)",
                            },
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default Chatbox;
