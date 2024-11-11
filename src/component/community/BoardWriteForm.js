import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import style from './Board.module.css';

const BoardWriteForm = () => {
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const { userId } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('http://localhost:3001/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					writer: userId,
					content
				})
			})

			if (response.ok) {
				const data = await response.json();
				console.log(data);

				navigate('/community');
			}
		} catch (error) {
			console.log('게시물 등록에 실패하였습니다.');
		}
	}

	return (
		<form className={style.boardWriteFormContainer} name="boardWriteFormContainer" onSubmit={handleSubmit}>
			<div className={style.boardWriteForm}>
				<div className={style.explainForm}>제목</div>
				<input
					name="title"
					className={`${style.inputForm} ${style.titleForm}`}
					type="text"
					placeholder="글 제목을 입력해주세요."
					required
					onChange={(e) => setTitle(e.target.value)} />
				<div className={style.explainForm}>작성자</div>
				<div>{userId}</div>
				<div className={style.explainForm}>내용</div>
				<textarea
					name="content"
					className={`${style.inputForm} ${style.contentForm}`}
					placeholder="글 내용을 입력해주세요."
					required
					onChange={(e) => setContent(e.target.value)} />
			</div>
			<div className={style.boardWriteBtn}>
				<Link to='/community'><input className={style.smallBtn} type="button" value="목록" /></Link>
				<input className={`${style.smallBtn} ${style.saveBtn}`} type="submit" value="저장" />
			</div>
		</form>
	);
}

export default BoardWriteForm;