import { Link } from "react-router-dom";

function Footer() {
   return (
      <footer>
        <hr />
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
               <h5>Find Data</h5>
              <Link to="/investigations">Investigations</Link>
            </li>
            <li>
              <Link to="/tools">Tools</Link>
            </li>
            <li>
              <Link to="/submit-data">Submit Data</Link>
            </li>
            <li>
              <Link to="/learn">Learn</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>
      </footer>
   )
}

export default Footer;