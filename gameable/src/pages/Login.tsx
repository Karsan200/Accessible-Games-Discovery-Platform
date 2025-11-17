import Container from "react-bootstrap/Container";
import { useState } from "react";
import type { FeedbackType } from "react-bootstrap/Feedback";
import { LoginForm } from "../logic/LoginForm.tsx";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export function Login() {
    // Email States
    const emailStatus = useState<FeedbackType | undefined>();
    const emailMessage = useState("");

    // Password States
    const passwordStatus = useState<FeedbackType | undefined>();
    const passwordMessage = useState("");

    async function handleSubmit() {
        await LoginForm({
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
        <Container>
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
                <Button variant="primary" onClick={() => { void handleSubmit() }}>
                    Login
                </Button>
            </Form>
        </Container>
    )
}