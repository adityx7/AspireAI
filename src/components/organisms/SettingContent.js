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
    Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { toast, ToastContainer } from "react-toastify";

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
        setFormErrors({ ...formErrors, [field]: "" });
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
                theme="dark"
                toastStyle={{
                    background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    color: "#e2e8f0",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                }}
                progressStyle={{
                    background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)"
                }}
            />

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ 
                width: "100%", 
                maxWidth: "800px",
                mb: 4,
                '& .MuiStepLabel-label': {
                    color: '#e2e8f0 !important',
                    fontWeight: 600,
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
                },
                '& .MuiStepLabel-label.Mui-active': {
                    color: '#ffd700 !important'
                },
                '& .MuiStepLabel-label.Mui-completed': {
                    color: '#4caf50 !important'
                },
                '& .MuiStepIcon-root': {
                    color: 'rgba(255,255,255,0.3)'
                },
                '& .MuiStepIcon-root.Mui-active': {
                    color: '#ffd700'
                },
                '& .MuiStepIcon-root.Mui-completed': {
                    color: '#4caf50'
                }
            }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            <Paper
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth: "800px",
                    borderRadius: "24px",
                    overflow: "hidden",
                    background: "linear-gradient(120deg, rgba(30,58,138,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    boxShadow: "0 8px 32px rgba(255,215,0,0.2)",
                    padding: "32px",
                    color: "#e2e8f0",
                    "& .MuiTextField-root": {
                        "& .MuiOutlinedInput-root": {
                            background: "rgba(15,23,42,0.5)",
                            borderRadius: "12px",
                            "& fieldset": {
                                borderColor: "rgba(255,215,0,0.3)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255,215,0,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#ffd700",
                                borderWidth: "2px",
                            },
                            "& input": {
                                color: "#e2e8f0",
                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(255,215,0,0.8)",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            "&.Mui-focused": {
                                color: "#ffd700",
                            },
                        },
                        "& .MuiFormHelperText-root": {
                            color: "#cbd5e1",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            "&.Mui-error": {
                                color: "#ff6b6b",
                            },
                        },
                    },
                    "& .MuiFormControl-root": {
                        "& .MuiOutlinedInput-root": {
                            background: "rgba(15,23,42,0.5)",
                            borderRadius: "12px",
                            "& fieldset": {
                                borderColor: "rgba(255,215,0,0.3)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255,215,0,0.5)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#ffd700",
                                borderWidth: "2px",
                            },
                            color: "#e2e8f0",
                        },
                        "& .MuiInputLabel-root": {
                            color: "rgba(255,215,0,0.8)",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            "&.Mui-focused": {
                                color: "#ffd700",
                            },
                        },
                        "& .MuiSelect-select": {
                            color: "#e2e8f0",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "rgba(255,215,0,0.8)",
                        },
                    },
                    "& .MuiTypography-root": {
                        color: "#e2e8f0",
                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                    },
                    "& .MuiDivider-root": {
                        backgroundColor: "rgba(255,215,0,0.3)",
                    },
                }}
            >
                {activeStep === 0 && (
                    <>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            mb: 2, 
                            color: "#ffd700",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}>
                            User Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                />
                                <TextField
                                    label="USN"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.usn.toUpperCase()}
                                    onChange={(e) => {
                                        const uppercasedValue = e.target.value.toUpperCase();
                                        handleInputChange("usn", uppercasedValue);
                                    }}
                                    error={!!formErrors.usn}
                                    helperText={formErrors.usn}
                                />
                            </Box>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    label="Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.mobileNumber}
                                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                                    error={!!formErrors.mobileNumber}
                                    helperText={formErrors.mobileNumber}
                                />
                                <TextField
                                    label="Alternate Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.alternateMobileNumber}
                                    onChange={(e) =>
                                        handleInputChange("alternateMobileNumber", e.target.value)
                                    }
                                />
                            </Box>
                            <TextField
                                label="Email ID"
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                            <TextField
                                label="College Email ID"
                                variant="outlined"
                                fullWidth
                                value={formData.collegeEmail}
                                onChange={(e) => handleInputChange("collegeEmail", e.target.value)}
                                error={!!formErrors.collegeEmail}
                                helperText={formErrors.collegeEmail}
                            />
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        id="gender-select"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange("gender", e.target.value)}
                                        error={!!formErrors.gender}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                                                    backdropFilter: "blur(10px)",
                                                    border: "1px solid rgba(255,215,0,0.3)",
                                                    "& .MuiMenuItem-root": {
                                                        color: "#e2e8f0",
                                                        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                                        "&:hover": {
                                                            background: "rgba(255,215,0,0.2)",
                                                        },
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="">Select Gender</MenuItem>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                    </Select>
                                    {formErrors.gender && (
                                        <Typography color="error" variant="caption" sx={{ fontFamily: "inherit" }}>
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
                                        max: new Date().toISOString().split("T")[0]
                                    }}
                                />
                            </Box>
                        </Box>
                    </>
                )}

                {activeStep === 1 && (
                    <>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            mb: 2, 
                            color: "#ffd700",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}>
                            Academics
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Typography sx={{ color: "#e2e8f0", fontFamily: "inherit", mb: 1 }}>
                                What is your graduation year?
                            </Typography>
                            <TextField
                                id="year"
                                select
                                defaultValue="2025"
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                            >
                                {[2023, 2024, 2025, 2026].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </TextField>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Typography sx={{ color: "#e2e8f0", fontFamily: "inherit", mb: 1 }}>
                                Choose the college you're attending or attended
                            </Typography>
                            <TextField
                                placeholder="Enter your college name"
                                value={formData.collegeName}
                                onChange={(e) => handleInputChange("collegeName", e.target.value)}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography sx={{ color: "#e2e8f0", fontFamily: "inherit", mb: 1 }}>
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
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            background: "linear-gradient(120deg, rgba(30,58,138,0.95) 0%, rgba(15,23,42,0.98) 100%)",
                                            backdropFilter: "blur(10px)",
                                            border: "1px solid rgba(255,215,0,0.3)",
                                            "& .MuiMenuItem-root": {
                                                color: "#e2e8f0",
                                                fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                                                "&:hover": {
                                                    background: "rgba(255,215,0,0.2)",
                                                },
                                                "&.Mui-selected": {
                                                    background: "rgba(255,215,0,0.3)",
                                                },
                                            },
                                        },
                                    },
                                }}
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
                        <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            mb: 1, 
                            color: "#ffd700",
                            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}>
                            Profile Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="body1" sx={{ mb: 1, color: "#e2e8f0", fontFamily: "inherit" }}>
                            Short Bio
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="State purpose..."
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ mb: 3 }}
                            value={formData.shortBio}
                            onChange={(e) => handleInputChange("shortBio", e.target.value)}
                        />
                    </>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2, mt: 3 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        sx={{ 
                            mr: 1,
                            color: "#e2e8f0",
                            fontFamily: "inherit",
                            "&:hover": {
                                backgroundColor: "rgba(255,215,0,0.1)",
                            },
                        }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep < steps.length - 1 ? (
                        <Button onClick={handleNext} variant="contained" sx={{
                            background: "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                            color: "#1e3a8a",
                            fontFamily: "inherit",
                            fontWeight: 700,
                            "&:hover": {
                                background: "linear-gradient(90deg, #ffed4e 0%, #ffd700 100%)",
                                transform: "translateY(-2px)",
                            },
                        }}>
                            Next
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleReset} variant="contained" startIcon={<RestartAltIcon />} sx={{ 
                                mr: 2,
                                background: "rgba(255,215,0,0.2)",
                                color: "#e2e8f0",
                                fontFamily: "inherit",
                                "&:hover": {
                                    background: "rgba(255,215,0,0.3)",
                                },
                            }}>
                                Reset
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                endIcon={<CheckCircleIcon />}
                                sx={{
                                    background: "linear-gradient(90deg, #4caf50 0%, #45a049 100%)",
                                    color: "#fff",
                                    fontFamily: "inherit",
                                    fontWeight: 700,
                                    "&:hover": {
                                        background: "linear-gradient(90deg, #45a049 0%, #4caf50 100%)",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingsPage;