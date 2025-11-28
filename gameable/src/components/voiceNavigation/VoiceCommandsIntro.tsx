import {Button, Card, Container, Table} from "react-bootstrap";
import {useState} from "react";
import "./VoiceNav.css"

export default function VoiceCommandsIntro() {
    const [visable, setVisible] = useState(true)
    console.log(visable)

    if (!visable) return (null);

    return (
        (
        <div className="vn-overlay">
            <div className="vn-modal">

                <button className="vn-close" aria-label="Close" onClick={() => setVisible(false)}>
                    ×
                </button>

                <h1 className="vn-title">How To Use Voice Navigation</h1>

                <div className="vn-content">
                    <Card className="mb-4">
                        <Card.Header as="h5">Basic Controls</Card.Header>
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
                                    <td>Stop listening</td>
                                    <td>click stop, stop record</td>
                                </tr>
                                <tr>
                                    <td>Clear current transcript</td>
                                    <td>clear, reset</td>
                                </tr>
                                <tr>
                                    <td>Navigate to a page</td>
                                    <td>click "page name", open "page name", go to "page name"</td>
                                </tr>
                                <tr>
                                    <td>Scrolling</td>
                                    <td>scroll up, scroll down, scroll to top, scroll to bottom</td>
                                </tr>
                                <tr>
                                    <td>Clicking Items</td>
                                    <td>click "thing you want to click"</td>
                                </tr>
                                <tr>
                                    <td>Typing in fields</td>
                                    <td>
                                        Say <cite>"write in *"</cite> or <cite>"type in *"</cite> to focus an
                                        input or textarea. Then say <cite>"paste"</cite> to insert dictated text.
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <p><strong>Hint:</strong> Try saying "click continue" to close this window!</p>

                    <div className="vn-actions">
                        <Button onClick={() => setVisible(false)} variant="primary">
                            Continue
                        </Button>
                    </div>
                </div>

            </div>
        </div>
        )
    )
}
