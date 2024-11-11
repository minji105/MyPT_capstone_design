import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from "@tensorflow-models/pose-detection";
import p5 from 'p5';
import style from './Exercise.module.css';
import CanvasContainer from './CanvasContainer.js';

const PushUp = () => {
    tf.setBackend('webgl');

    const sketchRef = useRef(null);
    const location = useLocation();
    const targetCount = location.state && location.state.count ? location.state.count : 1;
    const [personDetected, setPersonDetected] = useState(false);
    const [exerciseCount, setExerciseCount] = useState(0);
    let exerciseState;
    const [feedback, setFeedback] = useState({ Excellent: 0, Best: 0, Good: 0 });
    let poses = [];
    const [backAngle, setBackAngle] = useState(0);
    const [feedbackMsg, setFeedbackMsg] = useState();
    const navigate = useNavigate();
    let direction;

    useEffect(() => {
        if (exerciseCount === targetCount) {
            // navigate('/');
        }
    }, [exerciseCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(targetCount > exerciseCount) {
                checkExercise(poses);
            }
        }, 50);

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

                if(targetCount !== exerciseCount) {
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
                    for (let j = 0; j < keypoints.length; j++) {
                        const keypoint = keypoints[j];
                        if (keypoint.score > 0.2) {
                            p.fill(255, 255, 255);
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
                                    (partB === 'left_hip' || partB === 'right_hip')) && (backAngle < 170 || backAngle > 190)) {
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
        if (poses[0] && targetCount !== (feedback.Excellent + feedback.Best + feedback.Good)) {
            const keypoints = poses[0].keypoints;
            if (findKeypoint(keypoints, 'nose').x > findKeypoint(keypoints, 'left_ankle').x) {
                direction ='right';
            } else {
                direction = 'left';
            }
            const shoulder = findKeypoint(keypoints, 'left_shoulder');
            const hip = findKeypoint(keypoints, 'left_hip');
            const knee = findKeypoint(keypoints, 'left_knee');
            const elbow = findKeypoint(keypoints, 'left_elbow');
            const wrist = findKeypoint(keypoints, 'left_wrist');

            const backAngle = calculateAngle(shoulder, hip, knee);
            if (backAngle >= 170 && backAngle <= 190) {
                setBackAngle(0);
                const armAngle = calculateAngle(shoulder, elbow, wrist);
                console.log(direction, armAngle)
                if (armAngle >= 150 && armAngle <= 200) {
                    if (exerciseState !== 'upPosition') {
                        exerciseState = 'upPosition';
                        setFeedback((prevFeedback) => {
                            let updatedFeedback = { ...prevFeedback };
                            if (armAngle >= 165 && armAngle <= 185) {
                                updatedFeedback = { ...prevFeedback, Excellent: prevFeedback.Excellent + 1 };
                            } else if (armAngle >= 160 && armAngle <= 190) {
                                updatedFeedback = { ...prevFeedback, Best: prevFeedback.Best + 1 };
                            } else if (armAngle >= 150 && armAngle <= 200) {
                                updatedFeedback = { ...prevFeedback, Good: prevFeedback.Good + 1 };
                            }
                            return updatedFeedback;
                        });
                    }
                } else if ((direction === 'right' && armAngle >= 60 && armAngle <= 90) || (direction === 'left' && armAngle >= 270 && armAngle <= 300)) {
                    if (exerciseState === 'upPosition') {
                        setExerciseCount((prevCount) => prevCount + 1);
                        exerciseState = 'downPosition';
                    }
                }
            } else {
                if ((direction === 'left' && backAngle < 170) || (direction === 'right' && backAngle > 190)) {
                    setBackAngle(-1);
                    setFeedbackMsg('엉덩이가 너무 낮습니다')
                } else if ((direction === 'left' &&backAngle > 190) || (direction === 'right' && backAngle < 170)) {
                    setBackAngle(1);
                    setFeedbackMsg('엉덩이가 너무 높습니다')
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
            {targetCount > exerciseCount && !personDetected && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>사람이 감지되지 않았습니다.</div></div>}
            {targetCount > exerciseCount && personDetected && backAngle === 1 && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>엉덩이가 너무 높습니다. 코어에 힘을 주세요.</div></div>}
            {targetCount > exerciseCount && personDetected && backAngle === -1 && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>엉덩이가 너무 낮습니다. 어깨로 바닥을 밀어주세요.</div></div>}
            {targetCount > exerciseCount && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>Push Up-Count: {exerciseCount} / {targetCount}</div></div>}
            {exerciseCount === targetCount && <div style={{ width: '640px', fontSize: '24px', padding: '10px' }}><div>Excellent: {feedback.Excellent}, Best: {feedback.Best}, Good: {feedback.Good}</div></div>}
            {exerciseCount !== targetCount && <CanvasContainer id="canvasContainer" />}
        </div>
    );
};

export default PushUp;