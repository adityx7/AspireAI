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
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ width: "60%", mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    width: "60%",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    padding: "24px",
                }}
            >
                {activeStep === 0 && (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontFamily: "courier" }}>
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
                                    value={formData.usn.toUpperCase()} // Ensure input is displayed in uppercase
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
                                    >
                                        <MenuItem value="">Select Gender</MenuItem> {/* Default empty option */}
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                    </Select>
                                    {formErrors.gender && (
                                        <Typography color="error" variant="caption">
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
                                />

                            </Box>
                        </Box>
                    </>
                )}

                {activeStep === 1 && (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontFamily: "Courier" }}>
                            Academics
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

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
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2, mt: 3 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep < steps.length - 1 ? (
                        <Button onClick={handleNext} variant="contained">
                            Next
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleReset} variant="contained" color="secondary" startIcon={<RestartAltIcon />} sx={{ mr: 2 }}>
                                Reset
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                endIcon={<CheckCircleIcon />}
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