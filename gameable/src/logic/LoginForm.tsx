import type { LoginFormModel } from "../models/forms/LoginFormModel.ts";
import { settings } from "../AppSettings.ts";
import { HTTPError } from "../models/HttpError.ts";
import { useAuth } from "../data/AuthContext.tsx";

export async function LoginForm(body: LoginFormModel) {
    let valid = true

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
    // Mark password as valid
    else {
        body.inputs.password.status[1]("valid");
        body.inputs.password.message[1]("");
    }

    // If all inputs are valid, proceed with login logic
    if (valid) {
        const data = await fetch(settings.apiBaseUrl + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: body.inputs.email.value,
                password: body.inputs.password.value
            })
        })

        if (data.ok) {
            // Get access token from memory
            const token = useAuth()

            const response = await data.json()

            // Store access token in memory
            token.setAccessToken(response.accessToken)
        }
        else {
            if (data.status === 401) {
                body.inputs.email.status[1]("invalid")
                body.inputs.email.message[1]("Invalid email or Password")
                body.inputs.password.status[1]("invalid")
                body.inputs.password.message[1]("Invalid email or password")
            }
            else {
                throw new HTTPError(data.status, (await data.json()).error)
            }
        }
    }
}