import { Link } from 'react-router-dom';
import style from './Board.module.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BoardDetail = () => {
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (postId) {
			fetch(`http://localhost:3000/api/posts/${postId}`)
				.then(res => res.json())
				.then(data => setPost(data));
		}
	}, [postId]);

	const handleDelete = async () => {
		try {
			const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				window.location.href = '/community';
			} else {
				setError(true);
			}
		} catch (error) {
			console.error('게시물 삭제 실패', error);
			setError(true);
		}
	};

	return (
		<form
			className={style.boardWriteFormContainer}
			name="boardWriteFormContainer">
			<div className={style.boardWriteForm}>
				<div className={style.explainForm}>제목</div>
				<div>{post ? post.title : '로딩 중...'}</div>
				<div className={style.explainForm}>작성자</div>
				<div>{post ? post.writer : '로딩 중...'}</div>
				<div className={style.explainForm}>내용</div>
				<div>{post ? post.content : '로딩 중...'}</div>
			</div>
			<div className={style.boardWriteBtn}>
				<Link to='/community'><input className={style.smallBtn} type="button" value="목록" /></Link>
				<input className={style.smallBtn} onClick={handleDelete} type="button" value="삭제" />
				<Link to={`/community/edit/${postId}`}><input className={`${style.smallBtn} ${style.saveBtn}`} type="submit" value="수정" /></Link>
			</div>
		</form>
	);
}

export default BoardDetail;