import style from './tutorial.module.css'

const PushUp = () => {
    return (
        <div className={style.tutorialContainer}>
            <div className={style.tutorialBox}>
                <iframe className={style.tutorialVideo} src="https://www.youtube.com/embed/88-AijqyhfI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
    )
}

export default PushUp;