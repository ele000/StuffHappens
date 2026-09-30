function NotFound() {
  return(
          <div className="d-flex justify-content-center align-items-center"
              style={{ height: '80vh', textAlign: 'center' }}>
            <p className="lead mb-0">
              <strong>Oops! Page not found... Did you type the address correctly?</strong>
            </p>
          </div>
  );
}

export default NotFound;