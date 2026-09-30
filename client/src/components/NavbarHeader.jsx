import { Navbar , Container, Alert, Row } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Outlet } from "react-router";
import Footer from './Footer';


function NavbarHeader(props){
    
    return(
        <>
            <Navbar bg='danger' variant='dark' sticky="top">
                    <h1 className="ms-5 text-white">&nbsp; <i className="bi bi-controller">&nbsp;</i>Stuff Happens&nbsp;</h1><div className='text-white'>Sport and Fitness edition</div>
            </Navbar>
            {/*
            {props.message &&
                <Row style={{ marginTop: '70px', zIndex: 1050 }}>
                    <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible> 
                        {props.message.msg}
                    </Alert>
                </Row> }
            */}
            <Container fluid
                className="px-0"
                style={{
                backgroundColor: '#ffebcd',
                minHeight: 'calc(100vh - 72px)',
                width: '100%',
                maxWidth: '100%',
                margin: 0,
                overflowX: 'hidden',
                paddingTop: '2rem'
                }}>
                    <Outlet />
            </Container>
            {/*<Footer />*/}
        </>
    )
}

export default NavbarHeader;