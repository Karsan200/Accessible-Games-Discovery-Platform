import {Card, Container, Table} from "react-bootstrap";

export default function VoiceCommandsPage() {
    return (
        <Container className="py-5">
            <h1 className="mb-4">How To Use Voice Navigation</h1>
            <p>
                Welcome to the Voice Navigation system! You can control the website hands-free using the voice commands listed below. Commands are flexible—any variation in each group will work.
            </p>

            {/* Recording Controls */}
            <Card className="mb-4">
                <Card.Header as="h5">Recording Controls</Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Action</th>
                            <th>Supported Commands</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Start voice control</td>
                            <td>start</td>
                        </tr>
                        <tr>
                            <td>Stop listening</td>
                            <td>
                                click stop, stop record, stop listening, stop mic, end mic, end listening
                            </td>
                        </tr>
                        <tr>
                            <td>Clear current transcript</td>
                            <td>clear, reset, clear text, reset text</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Page Navigation */}
            <Card className="mb-4">
                <Card.Header as="h5">Page Navigation</Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Action</th>
                            <th>Supported Commands</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Navigate to a page</td>
                            <td>
                                click "page name", open "page name", go to "page name", navigate "page name"
                            </td>
                        </tr>
                        <tr>
                            <td>Scroll down</td>
                            <td>
                                scroll down, move down, go down
                            </td>
                            <td><strong>Note:</strong> These are adjustable via saying less or more afterward</td>
                        </tr>
                        <tr>
                            <td>Scroll up</td>
                            <td>
                                scroll up, move up, go up
                            </td>
                            <td><strong>Note:</strong> These are adjustable via saying less or more afterward</td>
                        </tr>
                        <tr>
                            <td>Go page Top or Bottom</td>
                            <td>
                                scroll to top, go to top, scroll to bottom, go to bottom
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Clicking & Typing */}
            <Card className="mb-4">
                <Card.Header as="h5">Clicking and Typing</Card.Header>
                <Card.Body>
                    <h6>Click Elements</h6>
                    <p>
                        Use <cite>"open *"</cite>, <cite>"click *"</cite>, or <cite>"select *"</cite> to interact with buttons, links, or elements on the page.
                    </p>
                    <p>
                        <strong>Note:</strong> If there are ever multiple buttons with the same name state the number of button.
                    </p>
                    <h6>Typing in Fields</h6>
                    <p>
                        Say <cite>"write in *"</cite> or <cite>"type in *"</cite> to focus an input or textarea. Then say <cite>"paste"</cite> to insert dictated text.
                    </p>
                    <p>
                        <strong>Note:</strong> If there are multiple text input fields also state the number.
                        <strong>Hint:</strong> The search bar is always visible and an input field.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}