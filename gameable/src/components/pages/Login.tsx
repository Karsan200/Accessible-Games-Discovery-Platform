import Container from "react-bootstrap/Container";
import { useState } from "react";
import type { FeedbackType } from "react-bootstrap/Feedback";
import { LoginForm } from "../../logic/LoginForm.tsx";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../data/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

export function Login() {
    // Email States
    const emailStatus = useState<FeedbackType | undefined>();
    const emailMessage = useState("");

    // Password States
    const passwordStatus = useState<FeedbackType | undefined>();
    const passwordMessage = useState("");

    // Other States
    const banner = useState(<></>);
    const auth = useAuth();

    // Calling UseNavigate for redirecting to the register page
    const navigate = useNavigate();

    async function handleSubmit() {
        await LoginForm({
            banner: banner,
            authContext: auth,
            inputs: {
                email: {
                    value: (document.getElementById("email") as HTMLInputElement).value,
                    status: emailStatus,
                    message: emailMessage
                },
                password: {
                    value: (document.getElementById("password") as HTMLInputElement).value,
                    status: passwordStatus,
                    message: passwordMessage
                }
            }
        })
    }

    return (
        <div className="auth-container"><Container fluid className="bg-light p-4 rounded-4">
            {banner[0]}
            <h1 className="mb-3">Login</h1>

            <Form noValidate>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        isValid={emailStatus[0] === "valid"}
                        isInvalid={emailStatus[0] === "invalid"}
                    />
                    <label htmlFor="email">Email Address</label>
                    <Form.Control.Feedback type="invalid">
                        {emailMessage[0]}
                    </Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                        isValid={passwordStatus[0] === "valid"}
                        isInvalid={passwordStatus[0] === "invalid"}
                    />
                    <label htmlFor="password">Password</label>
                    <Form.Control.Feedback type="invalid">
                        {passwordMessage[0]}
                    </Form.Control.Feedback>
                </Form.Floating>
                <Button variant="outline-primary" className="w-100 py-2 mb-3" onClick={() => { void handleSubmit() }}>
                    Submit
                </Button>
                <small className="text-muted d-block mb-2">
                    Don’t have an account?
                </small>
                <Button variant="outline-primary" className="w-100 py-2 mb-3" onClick={() => navigate("/register")}>
                    Register
                </Button>
            </Form>
        </Container></div>
    )
}