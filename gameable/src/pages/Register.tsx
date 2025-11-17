import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";

import { RegisterForm } from "../logic/RegisterForm.tsx";
import type { FeedbackType } from "react-bootstrap/Feedback";

export function Register() {
    // Username States
    const usernameStatus = useState<FeedbackType | undefined>();
    const usernameMessage = useState("");

    // Email States
    const emailStatus = useState<FeedbackType | undefined>();
    const emailMessage = useState("");

    // Password States
    const passwordStatus = useState<FeedbackType | undefined>();
    const passwordMessage = useState("");

    // Confirm Password States
    const passwordConfirmStatus = useState<FeedbackType | undefined>();
    const passwordConfirmMessage = useState("");

    async function handleSubmit() {
        await RegisterForm({
            inputs: {
                username: {
                    value: (document.getElementById("username") as HTMLInputElement).value,
                    status: usernameStatus,
                    message: usernameMessage
                },
                email: {
                    value: (document.getElementById("email") as HTMLInputElement).value,
                    status: emailStatus,
                    message: emailMessage
                },
                password: {
                    value: (document.getElementById("password") as HTMLInputElement).value,
                    status: passwordStatus,
                    message: passwordMessage
                },
                passwordConfirm: {
                    value: (document.getElementById("passwordConfirm") as HTMLInputElement).value,
                    status: passwordConfirmStatus,
                    message: passwordConfirmMessage
                }
            }
        })
    }

    return (
        <Container>
            <h1>Register</h1>

            <Form noValidate>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="username"
                        type="text"
                        placeholder="username"
                        required
                        isValid={usernameStatus[0] === "valid"}
                        isInvalid={usernameStatus[0] === "invalid"}
                    />
                    <label htmlFor="username">Username</label>
                    <Form.Control.Feedback type="invalid">
                        {usernameMessage[0]}
                    </Form.Control.Feedback>
                </Form.Floating>
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
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="passwordConfirm"
                        type="password"
                        placeholder="Password"
                        required
                        isValid={passwordConfirmStatus[0] === "valid"}
                        isInvalid={passwordConfirmStatus[0] === "invalid"}
                    />
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <Form.Control.Feedback type="invalid">
                        {passwordConfirmMessage[0]}
                    </Form.Control.Feedback>
                </Form.Floating>
                <Button variant="primary" onClick={() => { void handleSubmit() }}>
                    Register
                </Button>
            </Form>
        </Container>
    )
}