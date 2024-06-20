import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { FC } from 'react';

interface Props {
    message: string;
}

export const Popup: FC<Props> = ({ message }) => {
    return (
        <Container>
            <Box textAlign="center">
                <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
                    Mouse Movement and Typing Data Logger
                </Typography>
            </Box>

            <Box mt={2} mb={2} textAlign="right">
                <Button variant="text" color="warning">
                    Logout
                </Button>
            </Box>

            <Paper
                elevation={3}
                style={{
                backgroundColor: "#f8f8f8",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontSize: "12px",
                width: "100%",
                boxSizing: "border-box",
                marginBottom: 16,
                overflowX: "hidden",
                }}
            >
                <Typography variant="body1" component="pre">
                    {message}
                </Typography>
            </Paper>
        </Container>
    );
};
