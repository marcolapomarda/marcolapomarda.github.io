import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found">
            <h2>Oops!</h2>
            <p>That page cannot be found</p>
            <Link to="/">Go back to the Homepage...</Link>
        </div>
    );
}
 
export default NotFound;