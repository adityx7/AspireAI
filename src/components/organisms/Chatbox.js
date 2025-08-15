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
                    bgcolor: "#E9E6DE",
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Russo One', sans-serif", textAlign: "center" }}>
                    Vishwakarm.ai
                </Typography>

                <Paper
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        padding: "12px",
                        mb: "70px",
                        borderRadius: 2,
                        backgroundColor: "#F7F6F2",
                        boxShadow: "inset 0px 2px 8px rgba(0, 0, 0, 0.1)",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
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
                                }}
                            >
                                {msg.role === "assistant" && (
                                    <Avatar
                                        src={Bot}
                                        sx={{ marginRight: '8px', width: 40, height: 40 }}
                                    />
                                )}
                                <Box
                                    sx={{
                                        bgcolor: msg.role === "user" ? '#85A947' : '#E4F1AC',
                                        color: msg.role === "user" ? 'white' : 'black',
                                        borderRadius: msg.role === "user"
                                            ? "18px 18px 0px 18px"
                                            : "0px 18px 18px 18px",
                                        padding: "10px 16px",
                                        maxWidth: '60%',
                                        minWidth: "auto",
                                        fontSize: "14px",
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                        wordWrap: "break-word",
                                        display: "inline-block",
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
                                        sx={{ marginLeft: '8px', width: 40, height: 40 }}
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 8,
                        left: 8,
                        right: 8,
                        backgroundColor: "#EFF3EA",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: "8px",
                        borderRadius: 2,
                        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
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
                                borderRadius: 2,
                                bgcolor: "white"
                            }
                        }}
                    />
                    <IconButton onClick={handleSend} disabled={isLoading} color="primary">
                        <SendIcon />
                    </IconButton>
                    <IconButton onClick={handleRefresh} disabled={isLoading} color="secondary">
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default Chatbox;
