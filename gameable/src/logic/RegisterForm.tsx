import type { RegisterFormModel } from "../models/forms/RegisterFormModel.ts";
import { settings } from "../AppSettings.ts";
import {HTTPError} from "../models/HttpError.ts";
import {Alert} from "react-bootstrap";

export async function RegisterForm(body: RegisterFormModel) {
    let valid = true

    // Ensure the username is not empty
    if (body.inputs.username.value.trim() === "") {
        body.inputs.username.status[1]("invalid");
        body.inputs.username.message[1]("Username is required");
        valid = false
    }
    // Mark username as valid
    else {
        body.inputs.username.status[1]("valid");
        body.inputs.username.message[1]("");
    }

    // Ensure the email is not empty
    if (body.inputs.email.value.trim() === "") {
        body.inputs.email.status[1]("invalid");
        body.inputs.email.message[1]("Email is required");
        valid = false
    }
    // Ensure email includes "@" symbol
    else if (!body.inputs.email.value.includes("@")) {
        body.inputs.email.status[1]("invalid");
        body.inputs.email.message[1]("Email is invalid");
        valid = false
    }
    // Mark email as valid
    else {
        body.inputs.email.status[1]("valid");
        body.inputs.email.message[1]("");
    }

    // Ensure the password is not empty
    if (body.inputs.password.value.trim() === "") {
        body.inputs.password.status[1]("invalid");
        body.inputs.password.message[1]("Password is required");
        valid = false
    }
    // Ensure the password is at least 8 characters
    else if (body.inputs.password.value.length < 8) {
        body.inputs.password.status[1]("invalid");
        body.inputs.password.message[1]("Password must be at least 8 characters");
        valid = false
    }
    // Mark password as valid
    else {
        body.inputs.password.status[1]("valid");
        body.inputs.password.message[1]("");
    }

    // Ensure the passwords match
    if (body.inputs.password.value !== body.inputs.passwordConfirm.value) {
        body.inputs.passwordConfirm.status[1]("invalid");
        body.inputs.passwordConfirm.message[1]("Passwords do not match");
        valid = false
    }
    // Mark confirm password as valid
    else {
        body.inputs.passwordConfirm.status[1]("valid");
        body.inputs.passwordConfirm.message[1]("");
    }

    // If the form is valid then submit
    if (valid) {
        const data = await fetch(settings.apiBaseUrl + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: body.inputs.username.value,
                email: body.inputs.email.value,
                password: body.inputs.password.value
            })
        })

        // Registration successful
        if (data.ok) {
            // Set banner to show success message
            body.banner[1](
                <Alert variant="success">
                    <Alert.Heading>Registration Successful</Alert.Heading>
                    You can now <Alert.Link href="/login">login</Alert.Link> to your new account.
                </Alert>
            );
        }
        // Registration failed
        else {
            if (data.status === 409) {
                const res = await data.json();
                if (res.error.includes('username')) {
                    body.inputs.username.status[1]("invalid");
                    body.inputs.username.message[1]("Username is already taken");
                }
                else if (res.error.includes('email')) {
                    body.inputs.email.status[1]("invalid");
                    body.inputs.email.message[1]("Email is already registered");
                }
            }
            else {
                throw new HTTPError(data.status, (await data.json()).error)
            }
        }
    }
}