import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from "@tensorflow-models/pose-detection";
import p5 from 'p5';
import style from './Exercise.module.css';
import CanvasContainer from './CanvasContainer.js';
import { useAuth } from '../../contexts/AuthContext.js';

const Plank = () => {
	const navigate = useNavigate();
	const { userId } = useAuth();

	tf.setBackend('webgl');

	const sketchRef = useRef(null);
	const location = useLocation();
	const targetCount = location.state && location.state.min ? location.state.min : 1;
	const targetCountConvertSec = targetCount * 60
	const [exerciseCount, setExerciseCount] = useState(0);
	const [personDetected, setPersonDetected] = useState(false);
	let poses = [];
	const [backAngle, setBackAngle] = useState(0);
	const [headAngle, setHeadAngle] = useState(0);
	let direction;
	const [feedbackMsg, setFeedbackMsg] = useState();

	const formatTime = (count) => {
		const seconds = parseInt((count - parseInt(count)) * 60)
		return `${parseInt(count)}:${seconds}`
	}
	const formatExerciseTime = (count) => {
		const minutes = parseInt(count / 60);
		const seconds = count % 60;
		return `${minutes}:${seconds}`
	}

	useEffect(() => {
		if (exerciseCount >= targetCountConvertSec) {
			(async () => {
				await saveExerciseRecord();
				alert('운동이 종료되었습니다!');
				navigate('/');
			})();
		}
	}, [exerciseCount]);

	const saveExerciseRecord = async () => {
		try {
			const response = await fetch('http://localhost:3001/api/save-exercise', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					exerciseType: 'Plank',
					user: userId,
					duration: exerciseCount,
					date: new Date(),
				}),
			});

			const data = await response.json();
			console.log(data.message);
		} catch (error) {
			console.error('운동 기록 저장 실패:', error);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (targetCountConvertSec > exerciseCount) {
				checkExercise(poses);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		const msg = new SpeechSynthesisUtterance(feedbackMsg);
		msg.rate = 0.8
		window.speechSynthesis.speak(msg);
	}, [feedbackMsg])

	useEffect(() => {
		const sketch = new p5((p) => {
			let canvas;
			let video;
			let detector;

			p.setup = async () => {
				let container = document.getElementById('canvasContainer');
				const width = container.offsetWidth;
				const height = container.offsetHeight;

				canvas = p.createCanvas(width, height);
				canvas.parent(container);

				if (targetCountConvertSec > exerciseCount) {
					video = p.createCapture(p.VIDEO, () => {
						video.size(width, height);
						video.hide();

						const detectorConfig = {
							modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
						};

						poseDetection
							.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
							.then((det) => {
								detector = det;
								getPoses();
								p.loop();
							})
							.catch((error) => {
								console.error('Error:', error);
							});
					});
				}
			};

			p.draw = () => {
				p.background(220);
				p.translate(p.width, 0);
				p.scale(-1, 1);
				p.image(video, 0, 0, p.width, p.height);

				drawKeypoints();
				drawSkeleton();

				p.fill(255);
				p.strokeWeight(2);
				p.stroke(51);
				p.translate(p.width, 0);
				p.scale(-1, 1);
				p.textSize(40);


			};

			async function getPoses() {
				const pose = await detector.estimatePoses(video.elt);
				poses = pose;
				if (!poses || poses.length === 0) {
					setPersonDetected(false);
					window.requestAnimationFrame(getPoses);
					return;
				}
				setPersonDetected(true);
				window.requestAnimationFrame(getPoses);
			}

			function drawKeypoints() {
				for (let i = 0; i < poses.length; i++) {
					const keypoints = poses[i].keypoints;
					const nose = findKeypoint(keypoints, 'nose');
					const shoulder = findKeypoint(keypoints, 'left_shoulder');
					for (let j = 0; j < keypoints.length; j++) {
						const keypoint = keypoints[j];
						if (keypoint.score > 0.2) {
							if (keypoint.name === "left_eye" || keypoint.name === "right_eye") {
								if (nose.y < shoulder.y) {
									p.fill(255, 0, 0); // 빨간색으로 설정
								} else {
									p.fill(255, 255, 255); // 기본 흰색으로 설정
								}
							} else {
								p.fill(255, 255, 255); // 기본 흰색으로 설정
							}
							p.noStroke();
							p.circle(keypoint.x, keypoint.y, 10);
						}
					}
				}
			}

			function drawSkeleton() {
				for (let i = 0; i < poses.length; i++) {
					const keypoints = poses[i].keypoints;

					// 연결된 부분의 인덱스 매핑
					const connections = [
						['left_shoulder', 'right_shoulder'],
						['left_shoulder', 'left_elbow'],
						['left_elbow', 'left_wrist'],
						['right_shoulder', 'right_elbow'],
						['right_elbow', 'right_wrist'],
						['left_shoulder', 'left_hip'],
						['right_shoulder', 'right_hip'],
						['left_hip', 'right_hip'],
						['left_hip', 'left_knee'],
						['left_knee', 'left_ankle'],
						['right_hip', 'right_knee'],
						['right_knee', 'right_ankle'],
					];

					for (let j = 0; j < connections.length; j++) {
						const [partA, partB] = connections[j];
						const keypointA = findKeypoint(keypoints, partA);
						const keypointB = findKeypoint(keypoints, partB);

						if (keypointA && keypointB) {
							const confidenceThreshold = 0.5;

							if (
								keypointA.score > confidenceThreshold &&
								keypointB.score > confidenceThreshold
							) {
								const scaledX1 = p.map(keypointA.x, 0, video.width, 0, p.width);
								const scaledY1 = p.map(keypointA.y, 0, video.height, 0, p.height);
								const scaledX2 = p.map(keypointB.x, 0, video.width, 0, p.width);
								const scaledY2 = p.map(keypointB.y, 0, video.height, 0, p.height);

								const keypoints = poses[0].keypoints;
								const shoulder = findKeypoint(keypoints, 'left_shoulder');
								const hip = findKeypoint(keypoints, 'left_hip');
								const knee = findKeypoint(keypoints, 'left_knee');

								const backAngle = calculateAngle(shoulder, hip, knee);

								if (((partA === 'left_shoulder' || partA === 'right_shoulder') &&
									(partB === 'left_hip' || partB === 'right_hip')) && (backAngle < 165 || backAngle > 190)) {
									p.strokeWeight(4);
									p.stroke(255, 0, 0); // 빨간색
									p.line(scaledX1, scaledY1, scaledX2, scaledY2);
								} else {
									p.strokeWeight(2);
									p.stroke(0, 255, 0); // 초록색
									p.line(scaledX1, scaledY1, scaledX2, scaledY2);
								}
							}
						}
					}
				}
			}
		});

		sketchRef.current = sketch;

		return () => {
			sketchRef.current.remove();
		};
	}, []);

	function checkExercise(poses) {
		if (poses[0]) {
			const keypoints = poses[0].keypoints;
			const nose = findKeypoint(keypoints, 'nose');
			const shoulder = findKeypoint(keypoints, 'left_shoulder');
			const hip = findKeypoint(keypoints, 'left_hip');
			const knee = findKeypoint(keypoints, 'left_knee');
			const elbow = findKeypoint(keypoints, 'left_elbow');
			const wrist = findKeypoint(keypoints, 'left_wrist');
			const ankle = findKeypoint(keypoints, 'left_ankle')
			if (nose.x > ankle.x) {
				direction = 'right';
			} else {
				direction = 'left';
			}
			const backAngle = calculateAngle(shoulder, hip, knee);
			console.log(backAngle)
			if (backAngle >= 165 && backAngle <= 190 && nose.y > shoulder.y) {
				setBackAngle(0);
				setHeadAngle(0);
				const armAngle = calculateAngle(shoulder, elbow, wrist);
				console.log(direction, armAngle)
				if ((direction === 'right' && armAngle >= 75 && armAngle <= 100) || (direction === 'left' && armAngle >= 255 && armAngle <= 285)) {
					setExerciseCount(((prevCount) => prevCount + 1))
				}
			} else {
				if ((direction === 'left' && backAngle < 165) || (direction === 'right' && backAngle > 190)) {
					setBackAngle(-1);
					setFeedbackMsg('엉덩이가 너무 낮습니다')
				} else if ((direction === 'left' && backAngle > 190) || (direction === 'right' && backAngle < 165)) {
					setBackAngle(1);
					setFeedbackMsg('엉덩이가 너무 높습니다')
				}

				if (nose.y < shoulder.y) {
					setHeadAngle(1);
					setFeedbackMsg('고개가 너무 높습니다')
				} else {
					setHeadAngle(0)
				}
			}
		}
	}

	function calculateAngle(pointA, pointB, pointC) {
		const dxAB = pointB.x - pointA.x;
		const dyAB = pointB.y - pointA.y;
		const dxCB = pointB.x - pointC.x;
		const dyCB = pointB.y - pointC.y;

		const angleAB = Math.atan2(dyAB, dxAB) * (180 / Math.PI);
		const angleCB = Math.atan2(dyCB, dxCB) * (180 / Math.PI);

		let angle = angleCB - angleAB;
		if (angle < 0) angle += 360;

		return angle;
	}

	function findKeypoint(keypoints, name) {
		return keypoints.find((keypoint) => keypoint.name === name);
	}

	return (
		<div className={style.container}>
			{targetCountConvertSec > exerciseCount && !personDetected && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>사람이 감지되지 않았습니다.</div></div>}
			{targetCountConvertSec > exerciseCount && personDetected && backAngle === 1 && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>엉덩이가 너무 높습니다. 코어에 힘을 주세요.</div></div>}
			{targetCountConvertSec > exerciseCount && personDetected && backAngle === -1 && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>엉덩이가 너무 낮습니다. 어깨로 바닥을 밀어주세요.</div></div>}
			{targetCountConvertSec > exerciseCount && personDetected && headAngle === 1 && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>고개가 너무 높습니다. 바닥을 봐주세요.</div></div>}
			{targetCountConvertSec > exerciseCount && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>Plank-Count: {formatExerciseTime(exerciseCount)} / {formatTime(targetCount)}</div></div>}
			{exerciseCount < targetCountConvertSec && <CanvasContainer id="canvasContainer" />}
		</div>
	);
};

export default Plank;