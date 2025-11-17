import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    LinearProgress,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fade,
    Grow,
    Slide,
    Snackbar
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Description as FileIcon,
    ArrowBack as BackIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const NAVY_DARK = '#0A192F';
const NAVY_MID = '#112240';
const NAVY_LIGHT = '#1A365D';
const GOLD_DARK = '#B8860B';
const GOLD_MAIN = '#DAA520';
const GOLD_LIGHT = '#FFD700';

const AdminBulkUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewData, setPreviewData] = useState([]);
    const [validationResults, setValidationResults] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    const handleFileChange = (selectedFile) => {
        const validTypes = [
            'text/csv', 
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        if (!validTypes.includes(selectedFile.type)) {
            setSnackbar({
                open: true,
                message: '❌ Please upload a CSV or Excel file',
                severity: 'error'
            });
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            setSnackbar({
                open: true,
                message: '❌ File size must be less than 5MB',
                severity: 'error'
            });
            return;
        }

        setFile(selectedFile);
        parseFile(selectedFile);
    };

    const parseFile = (file) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split('\n').filter(row => row.trim());
            
            if (rows.length < 2) {
                setSnackbar({
                    open: true,
                    message: '❌ File must contain header and at least one data row',
                    severity: 'error'
                });
                return;
            }

            // Parse CSV
            const headers = rows[0].split(',').map(h => h.trim());
            const data = rows.slice(1).map((row, index) => {
                const values = row.split(',').map(v => v.trim());
                const student = {};
                headers.forEach((header, i) => {
                    student[header] = values[i] || '';
                });
                student.rowNumber = index + 2; // +2 because of header and 1-indexing
                return student;
            });

            setPreviewData(data);
            validateData(data, headers);
        };

        reader.readAsText(file);
    };

    const validateData = (data, headers) => {
        const requiredFields = ['Name', 'USN', 'Email', 'Branch', 'Semester'];
        const missingFields = requiredFields.filter(field => !headers.includes(field));
        
        const errors = [];
        const warnings = [];
        let validCount = 0;

        if (missingFields.length > 0) {
            errors.push(`Missing required columns: ${missingFields.join(', ')}`);
        }

        data.forEach((student, index) => {
            const rowErrors = [];
            
            // Validate required fields
            if (!student.Name) rowErrors.push('Name is required');
            if (!student.USN) rowErrors.push('USN is required');
            if (!student.Email) rowErrors.push('Email is required');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.Email)) {
                rowErrors.push('Invalid email format');
            }
            if (!student.Branch) rowErrors.push('Branch is required');
            if (!student.Semester) rowErrors.push('Semester is required');
            else if (isNaN(student.Semester) || student.Semester < 1 || student.Semester > 8) {
                rowErrors.push('Semester must be between 1 and 8');
            }

            if (rowErrors.length > 0) {
                errors.push(`Row ${student.rowNumber}: ${rowErrors.join(', ')}`);
            } else {
                validCount++;
            }

            // Warnings for optional fields
            if (!student.Phone) {
                warnings.push(`Row ${student.rowNumber}: Phone number missing`);
            }
        });

        setValidationResults({
            totalRows: data.length,
            validRows: validCount,
            errorRows: data.length - validCount,
            errors,
            warnings
        });

        if (errors.length === 0) {
            setSnackbar({
                open: true,
                message: '✅ File validated successfully!',
                severity: 'success'
            });
        }
    };

    const handleUpload = async () => {
        if (!file || !validationResults || validationResults.errors.length > 0) {
            setSnackbar({
                open: true,
                message: '❌ Please fix all errors before uploading',
                severity: 'error'
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);

        // Simulate API call
        setTimeout(() => {
            setUploading(false);
            setSnackbar({
                open: true,
                message: `🎉 Successfully uploaded ${validationResults.validRows} students!`,
                severity: 'success'
            });
            
            // Reset after success
            setTimeout(() => {
                navigate('/admin/students');
            }, 2000);
        }, 3000);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewData([]);
        setValidationResults(null);
        setUploadProgress(0);
    };

    const downloadTemplate = () => {
        const template = 'Name,USN,Email,Phone,Branch,Semester,Year\nJohn Doe,1MS20CS001,john@example.com,9876543210,CSE,5,3\nJane Smith,1MS20IS002,jane@example.com,9876543211,ISE,6,3';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_upload_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_MID} 100%)`,
            p: 4
        }}>
            {/* Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton 
                        onClick={() => navigate('/admin/dashboard')}
                        sx={{ 
                            color: GOLD_LIGHT,
                            mr: 2,
                            '&:hover': { background: `${GOLD_MAIN}15` }
                        }}
                    >
                        <BackIcon />
                    </IconButton>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_MAIN} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            flex: 1
                        }}
                    >
                        📤 Bulk Student Upload
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={downloadTemplate}
                        sx={{
                            borderColor: GOLD_MAIN,
                            color: GOLD_LIGHT,
                            '&:hover': {
                                borderColor: GOLD_LIGHT,
                                background: `${GOLD_MAIN}15`
                            }
                        }}
                    >
                        Download Template
                    </Button>
                </Box>
            </Fade>

            {/* Instructions */}
            <Slide direction="right" in={true} timeout={700}>
                <Paper sx={{ 
                    p: 3, 
                    mb: 3,
                    background: NAVY_MID,
                    border: `1px solid ${GOLD_MAIN}30`,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" sx={{ color: GOLD_LIGHT, mb: 2, display: 'flex', alignItems: 'center' }}>
                        <InfoIcon sx={{ mr: 1 }} />
                        Upload Instructions
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><CheckIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                            <ListItemText 
                                primary="File Format: CSV or Excel (.xlsx, .xls)"
                                sx={{ color: '#CBD5E1' }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                            <ListItemText 
                                primary="Required Columns: Name, USN, Email, Branch, Semester"
                                sx={{ color: '#CBD5E1' }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                            <ListItemText 
                                primary="Optional Columns: Phone, Year"
                                sx={{ color: '#CBD5E1' }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                            <ListItemText 
                                primary="Maximum File Size: 5MB"
                                sx={{ color: '#CBD5E1' }}
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Slide>

            {/* Upload Area */}
            <Grow in={true} timeout={800}>
                <Paper 
                    sx={{ 
                        p: 4, 
                        mb: 3,
                        background: NAVY_MID,
                        border: dragActive ? `2px dashed ${GOLD_LIGHT}` : `2px dashed ${GOLD_MAIN}50`,
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderColor: GOLD_MAIN,
                            background: `${GOLD_MAIN}05`,
                            transform: 'translateY(-2px)'
                        }
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <input
                        id="file-input"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                    
                    <UploadIcon sx={{ fontSize: 60, color: GOLD_MAIN, mb: 2 }} />
                    
                    {file ? (
                        <Box>
                            <Typography variant="h6" sx={{ color: GOLD_LIGHT, mb: 1 }}>
                                {file.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                                {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile();
                                }}
                            >
                                Remove File
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h6" sx={{ color: GOLD_LIGHT, mb: 1 }}>
                                Drag & drop your file here
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                or click to browse
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grow>

            {/* Validation Results */}
            {validationResults && (
                <Slide direction="left" in={true} timeout={900}>
                    <Paper sx={{ 
                        p: 3, 
                        mb: 3,
                        background: NAVY_MID,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{ color: GOLD_LIGHT, mb: 2 }}>
                            📊 Validation Results
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Chip 
                                icon={<FileIcon />}
                                label={`Total: ${validationResults.totalRows}`}
                                sx={{ 
                                    background: NAVY_LIGHT,
                                    color: '#CBD5E1',
                                    fontWeight: 600
                                }}
                            />
                            <Chip 
                                icon={<CheckIcon />}
                                label={`Valid: ${validationResults.validRows}`}
                                sx={{ 
                                    background: '#10B98115',
                                    color: '#10B981',
                                    fontWeight: 600
                                }}
                            />
                            <Chip 
                                icon={<ErrorIcon />}
                                label={`Errors: ${validationResults.errorRows}`}
                                sx={{ 
                                    background: '#EF444415',
                                    color: '#EF4444',
                                    fontWeight: 600
                                }}
                            />
                            <Chip 
                                icon={<WarningIcon />}
                                label={`Warnings: ${validationResults.warnings.length}`}
                                sx={{ 
                                    background: '#F59E0B15',
                                    color: '#F59E0B',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        {validationResults.errors.length > 0 && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 2,
                                    background: '#EF444410',
                                    border: '1px solid #EF444430'
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Errors Found:
                                </Typography>
                                {validationResults.errors.slice(0, 5).map((error, index) => (
                                    <Typography key={index} variant="body2">• {error}</Typography>
                                ))}
                                {validationResults.errors.length > 5 && (
                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                        ... and {validationResults.errors.length - 5} more errors
                                    </Typography>
                                )}
                            </Alert>
                        )}

                        {validationResults.warnings.length > 0 && (
                            <Alert 
                                severity="warning"
                                sx={{ 
                                    background: '#F59E0B10',
                                    border: '1px solid #F59E0B30'
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Warnings:
                                </Typography>
                                {validationResults.warnings.slice(0, 3).map((warning, index) => (
                                    <Typography key={index} variant="body2">• {warning}</Typography>
                                ))}
                                {validationResults.warnings.length > 3 && (
                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                        ... and {validationResults.warnings.length - 3} more warnings
                                    </Typography>
                                )}
                            </Alert>
                        )}
                    </Paper>
                </Slide>
            )}

            {/* Preview Table */}
            {previewData.length > 0 && (
                <Fade in={true} timeout={1000}>
                    <Paper sx={{ 
                        p: 3,
                        background: NAVY_MID,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{ color: GOLD_LIGHT, mb: 2 }}>
                            👁️ Data Preview (First 10 rows)
                        </Typography>
                        
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ background: NAVY_LIGHT, color: GOLD_LIGHT, fontWeight: 600 }}>Row</TableCell>
                                        <TableCell sx={{ background: NAVY_LIGHT, color: GOLD_LIGHT, fontWeight: 600 }}>Name</TableCell>
                                        <TableCell sx={{ background: NAVY_LIGHT, color: GOLD_LIGHT, fontWeight: 600 }}>USN</TableCell>
                                        <TableCell sx={{ background: NAVY_LIGHT, color: GOLD_LIGHT, fontWeight: 600 }}>Email</TableCell>
                                        <TableCell sx={{ background: NAVY_LIGHT, color: GOLD_LIGHT, fontWeight: 600 }}>Branch</TableCell>
                                        <TableCell sx={{ background: NAVY_LIGHT, color: GOLD_LIGHT, fontWeight: 600 }}>Semester</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {previewData.slice(0, 10).map((student, index) => (
                                        <TableRow 
                                            key={index}
                                            sx={{ 
                                                '&:hover': { background: `${GOLD_MAIN}05` },
                                                background: index % 2 === 0 ? NAVY_MID : NAVY_DARK
                                            }}
                                        >
                                            <TableCell sx={{ color: '#94A3B8' }}>{student.rowNumber}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{student.Name}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{student.USN}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{student.Email}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{student.Branch}</TableCell>
                                            <TableCell sx={{ color: '#CBD5E1' }}>{student.Semester}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        {previewData.length > 10 && (
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#94A3B8',
                                    mt: 2,
                                    textAlign: 'center',
                                    fontStyle: 'italic'
                                }}
                            >
                                ... and {previewData.length - 10} more rows
                            </Typography>
                        )}
                    </Paper>
                </Fade>
            )}

            {/* Upload Progress */}
            {uploading && (
                <Grow in={true} timeout={500}>
                    <Paper sx={{ 
                        p: 3,
                        mt: 3,
                        background: NAVY_MID,
                        border: `1px solid ${GOLD_MAIN}30`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" sx={{ color: GOLD_LIGHT, mb: 2 }}>
                            ⏳ Uploading Students...
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={uploadProgress}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                background: NAVY_LIGHT,
                                '& .MuiLinearProgress-bar': {
                                    background: `linear-gradient(90deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`
                                }
                            }}
                        />
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#CBD5E1',
                                mt: 1,
                                textAlign: 'center'
                            }}
                        >
                            {uploadProgress}% Complete
                        </Typography>
                    </Paper>
                </Grow>
            )}

            {/* Action Buttons */}
            {file && validationResults && !uploading && (
                <Fade in={true} timeout={1100}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={handleRemoveFile}
                            sx={{
                                borderColor: '#EF4444',
                                color: '#EF4444',
                                '&:hover': {
                                    borderColor: '#DC2626',
                                    background: '#EF444415'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={handleUpload}
                            disabled={validationResults.errors.length > 0}
                            sx={{
                                background: `linear-gradient(135deg, ${GOLD_MAIN} 0%, ${GOLD_LIGHT} 100%)`,
                                color: NAVY_DARK,
                                fontWeight: 600,
                                px: 4,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD_MAIN} 100%)`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 6px 20px ${GOLD_MAIN}40`
                                },
                                '&:disabled': {
                                    background: '#475569',
                                    color: '#94A3B8'
                                }
                            }}
                        >
                            Upload Students
                        </Button>
                    </Box>
                </Fade>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ 
                        background: NAVY_MID,
                        border: `1px solid ${
                            snackbar.severity === 'success' ? '#10B981' : 
                            snackbar.severity === 'error' ? '#EF4444' : 
                            GOLD_MAIN
                        }`
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminBulkUpload;
