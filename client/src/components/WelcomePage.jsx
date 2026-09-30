import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function WelcomePage() {

  const navigate = useNavigate();

  const handleClickDemo = () => {
    navigate('/demo');
  }

  const handleClickLogin = () => {
    navigate('/login');
  }

  return (
    <div className="text-center mt-5">
      <h1 className="mb-4">Welcome!</h1>
      <p className="mb-4">Start a demo match now or log in to your profile.</p>
        <div className="d-flex justify-content-center gap-3">
            <Button variant="danger" onClick={handleClickDemo}>Demo</Button>
            <Button variant="danger" onClick={handleClickLogin}>Login</Button>
        </div>
    </div>
  );
}

export default WelcomePage; 