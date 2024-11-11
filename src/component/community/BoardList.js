import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './Board.module.css';

const BoardList = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3001/api/posts')
			.then(res => res.json())
			.then(data => setPosts(data));
	}, []);


	return (
		<div className={style.boardList}>
			<div className={style.boardListSize}>
				총 <div className={style.sizeNum}> {posts.length} </div>건의 글이 있습니다.
			</div>
			<div className={style.boardContainer}>
				<table className={style.boardTable}>
					<thead>
						<tr>
							<th>NO</th>
							<th>제목</th>
							<th>작성자</th>
							<th>작성일</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((post, index) => (
							<tr>
								<td>{index + 1}</td>
								<td><Link to={`/community/${post._id}`}>{post.title}</Link></td>
								<td>{post.writer}</td>
								<td>{post.createdAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={style.writeBtnContainer}>
				<Link to='/community/write'>
					<input className={`${style.smallBtn} ${style.writeBtn}`} type="button" value="글쓰기"></input>
				</Link>
			</div>
		</div>
	);
}

export default BoardList;