import { Link, useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { setIsLoggedIn, setUserId } = useAuth();

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('http://localhost:3001/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: username,
					pw: password
				}),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('token', data.token);
				localStorage.setItem('id', data.id);
				console.log(data);

				setIsLoggedIn(true);
				setUserId(data.id);

				navigate('/');
			}
		} catch (error) {
			setError('로그인에 실패했습니다.');
		}
	};

	return (
		<div className={style.loginContainer}>
			<form className={style.loginBox} onSubmit={handleSubmit}>
				<div className={style.loginLogo}>
					<div>My pt</div>
				</div>

				<div className={style.loginInput}>
					<div>
						<input
							type="text"
							placeholder="아이디"
							name="username"
							value={username}
							onChange={handleUsernameChange} />
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
							<path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
							<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
						</svg>
					</div>
					<div>
						<input
							type="password"
							placeholder="비밀번호"
							name="password"
							value={password}
							onChange={handlePasswordChange} />
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
							<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
						</svg>
					</div>
				</div>

				<div className={style.loginBtn}>
					<button type="submit">로그인</button>
				</div>

				{error && <div className={style.error}>{error}</div>}

				<div className={style.loginEtcBtn}>
					<span>아이디 찾기</span>
					<span> | </span>
					<span>비밀번호 찾기</span>
					<span> | </span>
					<span><Link to="/register" className={style.signup}>회원가입</Link></span>
				</div>
			</form>
		</div>
	);
}

export default Login;  