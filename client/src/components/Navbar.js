import styles from './Navbar.module.css'
import React from 'react'
import { useNavigate, Link, BrowserRouter as Router } from 'react-router-dom';
import { PiChats } from 'react-icons/pi'



const AppName = () => (
	<div className={styles.appName}>
		BENJAMIN CLEEK
	</div>
);

const Description = () => (
	<div className={styles.description}>
		composer
	</div>
);

function Navbar() {
    return (
			<nav className={styles.Navbar} style={{ height: '8%' }}>
				<AppName className={styles.appName}/>
				<Description/>
				<ul className={styles.navbarNav} style={{ margin: '0 15vw' }}>
					<li className={styles.navbarItem}>
						<Link to="/Bio" className={styles.navLink}>
							Bio
						</Link>
					</li>
					<li className={styles.navbarItem}>
						<Link to="/Film" className={styles.navLink}>
							Film
						</Link>
					</li>
					<li className={styles.navbarItem}>
						<Link to="/Music" className={styles.navLink}>
							Music
						</Link>
					</li>
					<li className={styles.navbarItem}>
						<Link to="/Collaborations" className={styles.navLink}>
							Collaborations
						</Link>
					</li>
					<li className={styles.navbarItem}>
						<Link to="/Admin" className={styles.navLink}>
							Admin
						</Link>
					</li>
				</ul>
      </nav>			
    );
  }

export default Navbar