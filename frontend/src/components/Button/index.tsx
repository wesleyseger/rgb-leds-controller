
import styles from './styles.module.scss'

type ButtonProps = {
    name: string,
    onClick: () => void,
    active: boolean,
    disabled?: boolean
}

export const Button = ({ name, onClick, active, disabled }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={active ? styles.activeButton : undefined}
            disabled={disabled || active}
        >
            <span>
                {name}
            </span>
        </button>
    )
}