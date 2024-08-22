import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {Card, Typography, Box, Container, Alert} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {userState} from "../../store/atoms/user.js";
import { BASE_URL } from "../../config.js";

function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const setUser = useSetRecoilState(userState);

    const handleSignin = async () => {
        try {
            setError(""); // Clear any previous errors
            const response = await axios.post(`${BASE_URL}/user/login`, {
                username: email,
                password: password
            }, {
                headers: {
                    "Content-type": "application/json"
                }
            });
            const data = response.data;
            localStorage.setItem("token", data.token);
            setUser({
                userEmail: email,
                isLoading: false
            });
            navigate("/user/courses");
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                console.error("Error data:", error.response.data);
                setError(error.response.data.message || "An error occurred during login.");
            } else if (error.request) {
                setError("No response received from the server. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.", error.message);
            }
        }
    };

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f0f4f8',
        }}>
            <Container maxWidth="sm">
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: '#1976d2' }}>
                    Sign in to Coursera
                </Typography>
                <Card variant="outlined" sx={{ p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={handleSignin}
                    >
                        Sign In
                    </Button>
                </Card>
            </Container>
        </Box>
    );
}

export default Signin;