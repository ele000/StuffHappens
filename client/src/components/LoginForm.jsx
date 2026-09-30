import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useActionState } from "react";

function LoginForm(props){

    const [state,formAction,isPending] = useActionState(loginFunction, {username: '' , password: ''});

    const navigate = useNavigate();


    async function loginFunction(prevState,formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try{
            await props.handleLogin(credentials);
            return {success: true};
        }catch(error){
            return {error: 'Login failed , check your credentials'};
        }
    }

    const handleCancel = () => {
        navigate('/');
    }

    return(
        <>
        {isPending && <Alert variant="danger">Please wait the server's response</Alert>}
        <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Col xs={10} sm={8} md={6} lg={4}>
                <div style={{ padding: '2rem', borderRadius: '10px' }}>
                    <Form action={formAction}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="username" required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"  name="password" minLength={7} required/>
                        </Form.Group>
                        {state.error && <p className="text-danger">{state.error}</p>}
                    <Button className="me-3" variant="secondary" onClick={handleCancel} disabled={isPending}>← Back</Button>
                     <Button type="submit" variant="danger" disabled={isPending}>Sign in</Button>
                    </Form>
                </div>
            </Col>
        </Row>
        </>
    )
}

export default LoginForm;