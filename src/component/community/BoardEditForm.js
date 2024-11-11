import { Link } from 'react-router-dom';
import style from './Board.module.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BoardEditForm = ({ userId }) => {
	const { postId } = useParams();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
    if (postId) {
      fetch(`http://localhost:3001/api/posts/${postId}`)
        .then(res => res.json())
				.then(data => {
						setTitle(data.title);
						setContent(data.content);
				})
    }
  }, [postId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					content,
				}),
			});

			if (response.ok) {
				window.location.href = `/community/${postId}`;
			} else {
				setError(true);
			}
		} catch (error) {
			console.error('게시물 수정 실패', error);
		}
	};

	return (
		<form
			className={style.boardWriteFormContainer}
			name="boardWriteFormContainer"
			onSubmit={handleSubmit}>
			<div className={style.boardWriteForm}>
				<div className={style.explainForm}>제목</div>
				<input
					name="title"
					className={`${style.inputForm} ${style.titleForm}`}
					type="text" 
					value={title}
					placeholder="글 제목을 입력해주세요."
					required
					onChange={(e) => setTitle(e.target.value)} />
				<div className={style.explainForm}>작성자</div>
				<div>{userId}</div>
				<div className={style.explainForm}>내용</div>
				<textarea
					name="content"
					className={`${style.inputForm} ${style.contentForm}`}
					value={content}
					placeholder="글 내용을 입력해주세요."
					required
					onChange={(e) => setContent(e.target.value)}></textarea>
			</div>
			<div className={style.boardWriteBtn}>
				<Link to='/community'><input className={style.smallBtn} type="button" value="목록" /></Link>
				<input className={`${style.smallBtn} ${style.saveBtn}`} type="submit" value="저장" />
			</div>
		</form>
	);
}

export default BoardEditForm;