import { Row , Col  } from "react-bootstrap";
import dayjs from 'dayjs';

function Footer(){
    return(
        <>
        <footer>
            <Row>
                <Col className="text-left">
                    <p style={{ marginBottom: 0 }}>
                        &copy; {dayjs().year()} Applicazioni Web 1. All rights reserved
                    </p>
                </Col>
            </Row>
        </footer>
        </>
    );
}

export default Footer;