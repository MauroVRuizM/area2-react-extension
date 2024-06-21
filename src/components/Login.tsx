import { ChangeEvent, useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

export const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [submitTouched, setSubmitTouched] = useState(false);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        if (password === "") {return false;}
        return true;
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if(!submitTouched) {return;}
        if (!validateEmail(e.target.value)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if(!submitTouched) {return;}
        if (!validatePassword(e.target.value)) {
            setPasswordError('Please enter your password.');
            return;
        }
        setPasswordError('');
    };

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
    }

    const handleSignIn = () => {
        if(!submitTouched) {setSubmitTouched(true)}
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError('Please enter your password.');
            return;
        }

        clearErrors();
    };

    return (
        <Container maxWidth="xs">
            <Box textAlign="center" mt={4}>
                <Typography variant="h4">
                    Sign In to continue
                </Typography>
            </Box>

            <Box mt={4}>
                <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    margin="normal"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                />
            </Box>
            <Box mt={2}>
                <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    margin="normal"
                    value={password}
                    onChange={handlePasswordChange}
                    error={!!passwordError}
                    helperText={passwordError}
                />
            </Box>
            <Box mt={4} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleSignIn}>
                    Sign In
                </Button>
            </Box>

            <Box textAlign="center" mt={4}>
                <Typography variant="h5">
                    Don't have an account?
                </Typography>
            </Box>

            <Box mt={2} textAlign="center">
                <Button variant="outlined" color="secondary" id="signUp">
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
};
