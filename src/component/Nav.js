import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Nav.module.css';
import { useAuth } from '../contexts/AuthContext';

const Nav = () => {
	const [menuOpen, setMenuOpen] = useState(true);
	const { isLoggedIn, setIsLoggedIn, userId, setUserId } = useAuth();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 1024) {
				setMenuOpen(false);
			} else {
				setMenuOpen(true);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const menuOpenBtnHandler = () => {
		setMenuOpen((prevState) => !prevState);
	}

	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
		setUserId('');
	}

	return (
		<nav>
			<ul>
				<div className={style.navBar}>
					<div className={style.navLogo}>
						<Link to="/">My pt</Link>
					</div>

					<li>
						{menuOpen && <div className={style.navMenuContainer} >
							<div className={style.dropDown}>
								<div><Link to="/tutorial" className={`${style.navMenu}  ${style.dropDownMenu} ${style.navTutorial}`}>Tutorial</Link></div>
								<div className={style.dropDownContent}>
									<div><Link to="/tutorial/plank" className={`${style.navTutorial} ${style.tutorialPlank}`}>Plank</Link></div>
									<div><Link to="/tutorial/pushup" className={`${style.navTutorial} ${style.tutorialPushUp}`}>Push Up</Link></div>
								</div>
							</div>
							<div><Link to="/community" className={style.navMenu}>Community</Link></div>
						</div>}
					</li>
					<li>
						{isLoggedIn ? (
							<div className={style.navLogin}>
								{userId}
								<span
									style={{
										marginLeft: '16px',
										cursor: 'pointer'
									}}
									onClick={handleLogout}>Logout</span>
							</div>
						) : (
							<Link to="/login" className={style.navLogin}>
								Login
							</Link>
						)}
					</li>
				</div>
				<li className={style.navMenu}>
					<div className={style.navMenuBtn} onClick={menuOpenBtnHandler}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
						</svg>
					</div>
				</li>
			</ul>
		</nav>
	);
}

export default Nav;