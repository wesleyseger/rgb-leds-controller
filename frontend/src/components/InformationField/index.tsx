import styles from './styles.module.scss'

type InformationFieldProps = {
    title: string,
    value: any
}

export const InformationField = ({ title, value }: InformationFieldProps) => {
    return (
        <div className={styles.fieldWrapper}>
            <small>{title}</small>
            <small>{value}</small>
        </div>
    );
}