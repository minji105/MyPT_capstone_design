import style from './CanvasContainer.module.css'

const CanvasContainer = (props) => {
    return(
        <div id='canvasContainer' className={style.canvasContainer}>
            {props.children}
        </div>
    )
}

export default CanvasContainer;