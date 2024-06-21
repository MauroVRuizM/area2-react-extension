import { ChangeEvent, FC, useState } from "react";
import { Container, Typography, TextField, Button, Box, Fade } from "@mui/material";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase/config";

interface Props {
    checkToken: () => Promise<void>;
}

export const Login: FC<Props> = ({ checkToken }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [submitTouched, setSubmitTouched] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        if (password === "") {return {isValid: false, msg: "Please enter your password."}}
        if (password.length < 6) {return {isValid: false, msg: "Password must be at least 6 characters long."}}
        return {isValid: true, msg: ""};
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
        const { isValid, msg } = validatePassword(e.target.value);
        if (!isValid) {
            setPasswordError(msg);
            return;
        }
        setPasswordError('');
    };

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
        setFirebaseError('');
    }

    const handleChangeMode = () => {
        setIsRegistering(!isRegistering);
        clearErrors();
    }

    const saveToken = async (token: string) => {
        await chrome.storage.session.set({ token });
        checkToken();
    }

    const handleSubmit = async () => {
        if(!submitTouched) {setSubmitTouched(true)}
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        const { isValid, msg } = validatePassword(password);

        if (!isValid) {
            setPasswordError(msg);
            return;
        }

        clearErrors();

        let errorMsg = '';

        // * On Register
        if (isRegistering) {
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                const token = await user.getIdToken();
                saveToken(token);
            } catch (_) {
                errorMsg = "This e-mail is already registered";
            }
            setFirebaseError(errorMsg);
            return;
        }

        // * On Login
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const token = await user.getIdToken();
            saveToken(token);
        } catch (_) {
            errorMsg = "Invalid e-mail or password";
        }
        setFirebaseError(errorMsg);
    };

    return (
        <>
            <Fade in>
                <Container maxWidth="xs">
                    <Box textAlign="center" mt={4}>
                        <Typography variant="h4">
                            { isRegistering ? "Sign Up" : "Sign In to continue" }
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
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            { isRegistering ? "Sign Up" : "Sign In" }
                        </Button>
                    </Box>

                    <Box mt={2} textAlign="center">
                        <Typography color="error">
                            { firebaseError }
                        </Typography>
                    </Box>

                    <Box textAlign="center" mt={4}>
                        <Typography variant="h5">
                            { isRegistering ? "I already have an account" : "Don't have an account?" }
                        </Typography>
                    </Box>

                    <Box mt={2} textAlign="center">
                        <Button variant="outlined" color="secondary" onClick={handleChangeMode}>
                            { isRegistering ? "Sign In" : "Sign Up" }
                        </Button>
                    </Box>
                </Container>
            </Fade>
        </>
    );
};
