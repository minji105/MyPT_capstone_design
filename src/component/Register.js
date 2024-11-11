import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import style from './Register.module.css'

const Register = () => {
	const navigate = useNavigate();

	const [validations, setValidations] = useState({
		id: null,
		password: null,
		confirmPassword: null,
		emailLocal: null,
		emailDomain: null,
		year: null,
		month: null,
		day: null,
	});

	const [password, setPassword] = useState();
	const [emailLocal, setEmailLocal] = useState();
	const [emailDomain, setEmailDomain] = useState();
	const [id, setId] = useState();
	const [name, setName] = useState();
	const [error, setError] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('가입 요청이 시작됨');

		try {
			const response = await fetch('http://localhost:3001/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id,
					pw: password,
					name,
					email: `${emailLocal}@${emailDomain}`
				})
			});


			console.log('응답 받음', response);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				navigate('/login');
			} else {
				console.error('회원가입 요청 실패', response);
			}
		} catch (error) {
			console.error('회원가입 실패', error);
		}
	};

	const patterns = {
		id: /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{6,20}$/,
		password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
		emailLocal: /^(?![-_.])[a-zA-Z0-9-_.]+$/,
		emailDomain: /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
		year: /^(?:1[0-9]{3})$|^(?:20[01][0-9])$|^(?:20[2][0-3])$/,
		day: {
			1: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
			2: /^(?:[01]?[0-9])$|^(?:[2][0-9])$/,
			3: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
			4: /^(?:[012]?[0-9])$|^(?:[3][0])$/,
			5: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
			6: /^(?:[012]?[0-9])$|^(?:[3][0])$/,
			7: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
			8: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
			9: /^(?:[012]?[0-9])$|^(?:[3][0])$/,
			10: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
			11: /^(?:[012]?[0-9])$|^(?:[3][0])$/,
			12: /^(?:[012]?[0-9])$|^(?:[3][01])$/,
		},
	};

	const inputChangeHandler = (field, event) => {
		const value = event.target.value;
		let isValid;

		if (field === 'password') {
			setPassword(value);
			isValid = patterns[field].test(value);
		} else if (field === 'confirmPassword') {
			isValid = password === value;
		} else {
			isValid = patterns[field].test(value);
		}

		setValidations((prevValidations) => ({
			...prevValidations,
			[field]: isValid,
		}));
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className={style.loginContainer}>
				<div className={style.signupBox}>
					{error && <p>회원가입에 실패했습니다.</p>}
					<div className={style.signupDescription}>
						<div>회원가입</div>
						<div>가입을 통해 다양한 서비스를 만나보세요!</div>
					</div>

					<div className={style.signupProfile}>
						<div className={style.profileId}>
							<label htmlFor="id">아이디</label>
							<input type="text" placeholder="6자~20자" id="id" name="id" onChange={(e) => setId(e.target.value)} value={id} />
							{validations.id === false && <div className={style.notice}>영문 소문자, 숫자를 포함한 6~20자를 입력하세요.</div>}
						</div>

						<div className={style.profilePwd}>
							<label htmlFor="pwd">비밀번호</label>
							<input type="password" placeholder="문자, 숫자, 특수문자 포함 8자~20자" id="pwd" name="pw" onChange={(e) => setPassword(e.target.value)} value={password} />
							{validations.password === false && <div className={style.notice}>영문 대문자, 소문자, 숫자, 특수문자를 포함한 8~20자를 입력하세요.</div>}
							<label htmlFor="pwdConfirm">비밀번호 재확인</label>
							<input type="password" id="pwdConfirm" onChange={(e) => inputChangeHandler('confirmPassword', e)} />
							{validations.confirmPassword === false && <div className={style.notice}>비밀번호가 일치하지 않습니다.</div>}
						</div>

						<div className={style.profileName}>
							<label htmlFor="name">이름</label>
							<input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)} />
							<div className={style.notice}></div>
						</div>

						<div className={style.profileEmail}>
							<label htmlFor="email">이메일</label>
							<input type="text" className={style.emailLocal} id="email" name="emailLocal" onChange={(e) => setEmailLocal(e.target.value)} />
							<span>@</span>
							<input type="text" className={style.emailDomain} name="emailDomain" onChange={(e) => setEmailDomain(e.target.value)} />
							<select className={style.emailSelect} onChange={(e) => setEmailDomain(e.target.value)}>
								<option value="type">직접 입력</option>
								<option value="naver.com">naver.com</option>
								<option value="gmail.com">gmail.com</option>
								<option value="daum.net">daum.net</option>
								<option value="hanmail.com">hanmail.com</option>
							</select>
							{validations.emailLocal === false && <div className={style.notice + ' ' + style.localNotice}>이메일 로컬의 형식을 정확하게 입력하세요.</div>}
							{validations.emailDomain === false && <div className={style.notice + ' ' + style.domainNotice}>이메일 도메인의 형식을 정확하게 입력하세요.</div>}
						</div>
					</div>

					<div className={style.signupBtn}>
						<button type='submit'>가입하기</button>
					</div>
				</div>
			</div>
		</form>
	);
}

export default Register;