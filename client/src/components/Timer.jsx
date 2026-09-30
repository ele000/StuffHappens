import { useState , useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

{/*
function Timer(props) {

  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setTimeLeft(30);
  }, [props.round]);

  useEffect(() => {

    if (timeLeft<=0){ 
        if(props.onTimeout) {
            props.onTimeout();
        }
        return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft , props.onTimeout]);

  return (
    <div>
      <h2>TIMER : { timeLeft<=3 ? <div className="text-danger">{timeLeft}</div> : <div>{timeLeft}</div> }</h2>
    </div>
  );
};
*/}

function Timer(props) {
  const duration = 30;

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [props.round]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (props.onTimeout) {
        props.onTimeout();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, props.onTimeout]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <CountdownCircleTimer
        isPlaying={timeLeft > 0}
        duration={duration}
        initialRemainingTime={timeLeft}
        colors={[
          "#00C853", // verde
          "#F7B801", // giallo
          "#A30000",  // rosso
          "#A30000"
        ]}
        colorsTime={[30, 15, 3, 0]}
      >
        {() => (
          <div 
            className={timeLeft <= 3 ? "text-danger" : ""}
            style={{ fontSize: "3rem", fontWeight: "bold" }}
          >
            {timeLeft}
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
}

export default Timer;