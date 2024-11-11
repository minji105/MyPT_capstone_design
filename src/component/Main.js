import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './Main.module.css';

const Main = () => { 

    const [selectedExercise, setSelectedExercise] = useState(null);
    const [pushUpValue, setPushUpValue] = useState(10);
    const [plankValue, setPlankValue] = useState(5);

    const handleExerciseChange = (event) => {
        setSelectedExercise(event.target.value);
    };

    const handlePushUpValueChange = (event) => {
        setPushUpValue(event.target.value);
    };

    const handlePlankValueChange = (event) => {
        setPlankValue(event.target.value);
    }

    return (
        <div className={style.mainContainer}>
            <h1>집에서도 PT선생님과<br /> 함께 운동하세요!</h1>
            <h2>본인만의 운동루틴을 설정해 운동하면, My Pt가 평가해줄거에요.</h2>
            <div className={style.exerciseOption}>
                <div className={style.exerciseOptionOp}>
                    <input type="radio" id="plankRadio" name="exercise" value="plank" onChange={handleExerciseChange}></input>
                    <label htmlFor="plankRadio">플랭크</label>
                    {selectedExercise === 'plank' && (
                        <div className={style.plankOption}>
                            시간 (분): <input type="number" min="1" value={plankValue} onChange={handlePlankValueChange} />
                        </div>
                    )}
                </div>
                <div className={style.exerciseOptionOp}>
                    <input type="radio" id="pushUpRadio" name="exercise" value="pushUp" onChange={handleExerciseChange}></input>
                    <label htmlFor="pushUpRadio">푸쉬업</label>
                    {selectedExercise === 'pushUp' && (
                        <div className={style.pushUpOption}>
                            개수: <input type="number" min="1" value={pushUpValue} onChange={handlePushUpValueChange} />
                        </div>
                    )}
                </div>
            </div>
            {selectedExercise === 'plank' ? (
                <button className={style.exerciseBtn}>
                    <Link to={"/exercise/plank"} state= {{ min: parseFloat(plankValue, 10) }}>운동 시작하기</Link>
                </button>
            ) : (
                selectedExercise === 'pushUp' && (
                    <button className={style.exerciseBtn}>
                        <Link to={"/exercise/pushUp"} state= {{ count: parseInt(pushUpValue, 10) }}>운동 시작하기</Link>
                    </button>
                )
            )}
        </div>
    );
}

export default Main;
