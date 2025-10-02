import React, { useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Button,
    TextField,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
const steps = ["User Details", "Academics", "Profile Details"];

const SettingsPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        usn: "",
        mobileNumber: "",
        alternateMobileNumber: "",
        email: "",
        collegeEmail: "",
        gender: "",
        dob: "",
        selectedMajors: [],
        employeeIn: "",
        shortBio: "",
    });

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setFormErrors({ ...formErrors, [field]: "" }); // Clear errors as user types
    };
    const majorsOptions = [
        { value: "Computer Science & Engineering", label: "Computer Science & Engineering" },
        { value: "Information Science", label: "Information Science" },
        { value: "Artificial Intelligence & Machine Learning", label: "Artificial Intelligence & Machine Learning" },
        { value: "Electrical & Electronics Engineering", label: "Electrical & Electronics Engineering" },
        { value: "Electronics & Communication Engineering", label: "Electronics & Communication Engineering" },
        { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    ];

    const validateStep = () => {
        const errors = {};
        if (!formData.name) errors.name = "Name is required.";
        if (!formData.usn) {
            errors.usn = "USN is required.";
        } else if (!/^1BG\d{2}(CS|AI|EE|EC|ME|IS)\d{3}$/.test(formData.usn)) {
            errors.usn = "Enter a valid USN (e.g., 1BG21CS001).";
        }
        if (!formData.mobileNumber) {
            errors.mobileNumber = "Mobile Number is required.";
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
            errors.mobileNumber = "Enter a valid 10-digit Mobile Number.";
        }
        if (!formData.email) {
            errors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Enter a valid email address.";
        }
        if (!formData.collegeEmail) errors.collegeEmail = "College Email is required.";
        if (!formData.gender) errors.gender = "Gender is required.";
        if (!formData.dob) errors.dob = "Date of Birth is required.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1);
        } else {
            toast.warn("Please correct the errors before proceeding.");
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setFormData({
            name: "",
            usn: "",
            mobileNumber: "",
            alternateMobileNumber: "",
            email: "",
            collegeEmail: "",
            gender: "",
            dob: "",
        });
        setFormErrors({});
    };
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5002/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Form submitted successfully!");
            } else {
                toast.error("Failed to submit form. Try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Error submitting form.");
        }
    };
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px",
            }}
        >
            <ToastContainer 
                position="top-right" 
                autoClose={3000}
                toastStyle={{
                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                }}
            />
            {/* Stepper */}
            <Stepper 
                activeStep={activeStep} 
                sx={{ 
                    width: "60%", 
                    mb: 4,
                    '& .MuiStepLabel-root .Mui-completed': {
                        color: '#B8860B',
                    },
                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                        color: '#B8860B',
                    },
                    '& .MuiStepLabel-root .Mui-active': {
                        color: '#B8860B',
                    },
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                        color: '#B8860B',
                        fontWeight: 600
                    },
                    '& .MuiStepLabel-label': {
                        color: '#ffffff',
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                    },
                    '& .MuiStepConnector-line': {
                        borderColor: 'rgba(184, 134, 11, 0.3)'
                    },
                    '& .MuiStepIcon-root': {
                        color: 'rgba(184, 134, 11, 0.3)',
                        '&.Mui-active': {
                            color: '#B8860B',
                        },
                        '&.Mui-completed': {
                            color: '#B8860B',
                        }
                    }
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.85) 0%, rgba(10, 25, 47, 0.9) 100%)",
                    backdropFilter: "blur(25px)",
                    border: "1px solid rgba(184, 134, 11, 0.15)",
                    width: "60%",
                    borderRadius: "20px",
                    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(184, 134, 11, 0.08)",
                    padding: "32px",
                    position: "relative",
                    overflow: "hidden",
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.5), transparent)'
                    }
                }}
            >
                {activeStep === 0 && (
                    <>
                        <Typography variant="h6" sx={{ 
                            fontWeight: "700", 
                            mb: 3, 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            color: "#B8860B"
                        }}>
                            User Details
                        </Typography>
                        <Divider sx={{ 
                            mb: 4,
                            borderColor: "rgba(184, 134, 11, 0.3)",
                            '&::before, &::after': {
                                borderColor: 'rgba(184, 134, 11, 0.3)'
                            }
                        }} />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box sx={{ display: "flex", gap: 3 }}>
                                <TextField
                                    placeholder="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(26, 43, 76, 0.3)",
                                            backdropFilter: "blur(10px)",
                                            '& fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#B8860B',
                                            },
                                            '& input': {
                                                color: '#ffffff',
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                            }
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#ff6b6b',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }
                                    }}
                                />
                                <TextField
                                    placeholder="USN"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.usn.toUpperCase()} // Ensure input is displayed in uppercase
                                    onChange={(e) => {
                                        const uppercasedValue = e.target.value.toUpperCase();
                                        handleInputChange("usn", uppercasedValue);
                                    }}
                                    error={!!formErrors.usn}
                                    helperText={formErrors.usn}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(26, 43, 76, 0.3)",
                                            backdropFilter: "blur(10px)",
                                            '& fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#B8860B',
                                            },
                                            '& input': {
                                                color: '#ffffff',
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                            }
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#ff6b6b',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: "flex", gap: 3 }}>
                                <TextField
                                    placeholder="Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.mobileNumber}
                                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                                    error={!!formErrors.mobileNumber}
                                    helperText={formErrors.mobileNumber}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(26, 43, 76, 0.3)",
                                            backdropFilter: "blur(10px)",
                                            '& fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#B8860B',
                                            },
                                            '& input': {
                                                color: '#ffffff',
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                            }
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#ff6b6b',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }
                                    }}
                                />
                                <TextField
                                    placeholder="Alternate Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.alternateMobileNumber}
                                    onChange={(e) =>
                                        handleInputChange("alternateMobileNumber", e.target.value)
                                    }
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(26, 43, 76, 0.3)",
                                            backdropFilter: "blur(10px)",
                                            '& fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#B8860B',
                                            },
                                            '& input': {
                                                color: '#ffffff',
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                            }
                                        }
                                    }}
                                />
                            </Box>
                            <TextField
                                placeholder="Email ID"
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: "rgba(26, 43, 76, 0.3)",
                                        backdropFilter: "blur(10px)",
                                        '& fieldset': {
                                            borderColor: 'rgba(184, 134, 11, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(184, 134, 11, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#B8860B',
                                        },
                                        '& input': {
                                            color: '#ffffff',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff6b6b',
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                    }
                                }}
                            />
                            <TextField
                                placeholder="College Email ID"
                                variant="outlined"
                                fullWidth
                                value={formData.collegeEmail}
                                onChange={(e) => handleInputChange("collegeEmail", e.target.value)}
                                error={!!formErrors.collegeEmail}
                                helperText={formErrors.collegeEmail}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: "rgba(26, 43, 76, 0.3)",
                                        backdropFilter: "blur(10px)",
                                        '& fieldset': {
                                            borderColor: 'rgba(184, 134, 11, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(184, 134, 11, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#B8860B',
                                        },
                                        '& input': {
                                            color: '#ffffff',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff6b6b',
                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                    }
                                }}
                            />
                            <Box sx={{ display: "flex", gap: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel 
                                        id="gender-label"
                                        sx={{
                                            color: '#B8860B',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                            '&.Mui-focused': {
                                                color: '#B8860B',
                                            },
                                        }}
                                    >
                                        Gender
                                    </InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        id="gender-select"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange("gender", e.target.value)}
                                        error={!!formErrors.gender}
                                        label="Gender"
                                        sx={{
                                            background: "rgba(26, 43, 76, 0.3)",
                                            backdropFilter: "blur(10px)",
                                            color: '#ffffff',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(184, 134, 11, 0.5)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#B8860B',
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: '#B8860B'
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    background: "linear-gradient(135deg, rgba(26, 43, 76, 0.95) 0%, rgba(10, 25, 47, 0.98) 100%)",
                                                    backdropFilter: "blur(15px)",
                                                    border: "1px solid rgba(184, 134, 11, 0.2)",
                                                    '& .MuiMenuItem-root': {
                                                        color: '#ffffff',
                                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(184, 134, 11, 0.1)'
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: 'rgba(184, 134, 11, 0.2)'
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="">Select Gender</MenuItem> {/* Default empty option */}
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                    </Select>
                                    {formErrors.gender && (
                                        <Typography sx={{ 
                                            color: "#ff6b6b", 
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                            fontSize: "12px",
                                            mt: 1
                                        }}>
                                            {formErrors.gender}
                                        </Typography>
                                    )}
                                </FormControl>
                                <TextField
                                    label="DOB"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.dob}
                                    onChange={(e) => handleInputChange("dob", e.target.value)}
                                    error={!!formErrors.dob}
                                    helperText={formErrors.dob}
                                    inputProps={{
                                        max: new Date().toISOString().split("T")[0] // Set the max date to today's date
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: "rgba(26, 43, 76, 0.3)",
                                            backdropFilter: "blur(10px)",
                                            '& fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(184, 134, 11, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#B8860B',
                                            },
                                            '& input': {
                                                color: '#ffffff',
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#B8860B',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                            '&.Mui-focused': {
                                                color: '#B8860B',
                                            },
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#ff6b6b',
                                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                        }
                                    }}
                                />

                            </Box>
                        </Box>
                    </>
                )}

                {activeStep === 1 && (
                    <>
                        <Typography variant="h6" sx={{ 
                            fontWeight: "700", 
                            mb: 3, 
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            color: "#B8860B"
                        }}>
                            Academics
                        </Typography>
                        <Divider sx={{ 
                            mb: 4,
                            borderColor: "rgba(184, 134, 11, 0.3)",
                            '&::before, &::after': {
                                borderColor: 'rgba(184, 134, 11, 0.3)'
                            }
                        }} />

                        {/* Graduation Year */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Typography fontFamily="Courier">What is your graduation year?</Typography>
                            <TextField
                                id="year"
                                select
                                defaultValue="2025"
                                SelectProps={{
                                    native: true,
                                }}
                                variant="standard"
                            >
                                {[2023, 2024, 2025, 2026].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </TextField>
                        </FormControl>

                        {/* College */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Typography fontFamily="Courier">Choose the college you're attending or attended</Typography>
                            <TextField
                                placeholder="Enter your college name"
                                value={formData.collegeName}
                                onChange={(e) => handleInputChange("collegeName", e.target.value)}
                            />
                        </FormControl>

                        {/* Majors */}
                        <FormControl fullWidth>
                            <Typography id="majors-label" fontFamily="Courier">
                                Choose your major
                            </Typography>
                            <Select
                                labelId="majors-label"
                                id="majors-select"
                                multiple
                                value={formData.selectedMajors || []}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedMajors: e.target.value })
                                }
                            >
                                {majorsOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}
                {activeStep === 2 && (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, fontFamily: "Courier" }}>
                            Profile Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="body1" sx={{ mb: 1, fontFamily: "Courier" }}>
                            Short Bio
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="State purpose..."
                            multiline
                            variant="outlined"
                            sx={{ mb: 3 }}
                            value={formData.shortBio}
                            onChange={(e) => handleInputChange("shortBio", e.target.value)}
                        />
                    </>
                )}
            </Box>

            <Box>
                {/* Navigation Buttons */}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 3, mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        sx={{ 
                            mr: 2,
                            background: activeStep === 0 
                                ? "linear-gradient(135deg, rgba(184, 134, 11, 0.2) 0%, rgba(218, 165, 32, 0.2) 100%)"
                                : "linear-gradient(135deg, rgba(184, 134, 11, 0.3) 0%, rgba(218, 165, 32, 0.3) 100%)",
                            color: activeStep === 0 ? "rgba(184, 134, 11, 0.5)" : "#B8860B",
                            fontWeight: "600",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            border: "1px solid rgba(184, 134, 11, 0.3)",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                            '&:hover': activeStep !== 0 ? {
                                background: "linear-gradient(135deg, rgba(184, 134, 11, 0.4) 0%, rgba(218, 165, 32, 0.4) 100%)",
                                transform: "translateY(-1px)"
                            } : {},
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep < steps.length - 1 ? (
                        <Button 
                            onClick={handleNext} 
                            variant="contained"
                            sx={{
                                background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                color: "#ffffff",
                                fontWeight: "600",
                                padding: "12px 24px",
                                borderRadius: "12px",
                                boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                '&:hover': {
                                    background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
                                    boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
                                    transform: "translateY(-2px)"
                                },
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <>
                            <Button 
                                onClick={handleReset} 
                                variant="contained" 
                                startIcon={<RestartAltIcon />} 
                                sx={{ 
                                    mr: 3,
                                    background: "linear-gradient(135deg, rgba(184, 134, 11, 0.2) 0%, rgba(218, 165, 32, 0.2) 100%)",
                                    color: "#B8860B",
                                    fontWeight: "600",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(184, 134, 11, 0.3)",
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                    '&:hover': {
                                        background: "linear-gradient(135deg, rgba(184, 134, 11, 0.3) 0%, rgba(218, 165, 32, 0.3) 100%)",
                                        transform: "translateY(-1px)"
                                    },
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                endIcon={<CheckCircleIcon />}
                                sx={{
                                    background: "linear-gradient(135deg, #B8860B 0%, #DAA520 100%)",
                                    color: "#ffffff",
                                    fontWeight: "600",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 25px rgba(184, 134, 11, 0.3)",
                                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                                    '&:hover': {
                                        background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
                                        boxShadow: "0 12px 35px rgba(184, 134, 11, 0.4)",
                                        transform: "translateY(-2px)"
                                    },
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                            >
                                Submit
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SettingsPage;