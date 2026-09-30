import { Button, Row ,Col} from "react-bootstrap";
import { useNavigate } from "react-router";
import GamesTable from "./gamesTable";

function UserProfile(props){

    const navigate = useNavigate();

    const handleBackPage = () => {
        navigate('/home');
    }

    return(
        <>
            <Row className="align-items-center mb-4">
                    <Col xs={2}>
                        <Button variant="secondary" onClick={handleBackPage}>← Back</Button>
                    </Col>

                    <Col xs={6} className="text-center">
                        <h2 className="mb-0">Game History</h2>
                    </Col>
                <Col xs={3} />
            </Row>
            <Row>
                <GamesTable userId={props.user.id}/>
            </Row>
        </>
    )
}

export default UserProfile;