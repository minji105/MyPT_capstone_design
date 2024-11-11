import style from './tutorial.module.css'

const TutorialBox = (props) => {
    return (
        <div className={style.tutorialBox}>
            <iframe className={style.tutorialVideo} src={props.src} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
    )
}

export default TutorialBox;