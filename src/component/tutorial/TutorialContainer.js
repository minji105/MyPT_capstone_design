import style from './tutorial.module.css'
import TutorialBox from './TutorialBox.js';

const TutorialContainer = () => {
    return (
        <div className={style.tutorialContainer}>
            <TutorialBox src="https://www.youtube.com/embed/1IJp0aPcXtg"></TutorialBox>
            <TutorialBox src="https://www.youtube.com/embed/88-AijqyhfI"></TutorialBox>
        </div>
    )
}

export default TutorialContainer;