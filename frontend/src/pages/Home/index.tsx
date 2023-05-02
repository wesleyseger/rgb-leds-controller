import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Wheel from '@uiw/react-color-wheel';

import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { InformationField } from '../../components/InformationField';

import { api } from '../../services/api';

import logo from '../../assets/icon.jpg';

export const Home = () => {
    const queryClient = useQueryClient();

    const [color, setColor] = useState('#FFFFFF')
    const [effects, setEffects] = useState([]);
    const [brightness, setBrightness] = useState(10);
    const [speed, setSpeed] = useState(10);

    const { data: status, error, isLoading: isLoadingStatus } = useQuery({
        queryKey: ['status'],
        queryFn: async () => {
            const { data } = await api.get('/status');
            setSpeed(parseInt(data.speed))
            setBrightness(parseInt(data.brightness))
            return data;
        }
    })

    function changeColor() {
        handleSetColor();
        document.getElementById('root')?.removeEventListener('mouseup', changeColor)
    }

    const { mutate: handleSetColor, isLoading: isLoadingColor } = useMutation({
        mutationFn: async () => {
            await api.post('/colorandbrightness', { color, brightness });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['status'] })
    })

    const { mutate: handleSetEffect, isLoading: isLoadingEffect } = useMutation({
        mutationFn: async (effect: string) => {
            await api.post('/effect', { effect, speed });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['status'] })
    })

    const { mutate: handleTurnOn, isLoading: isLoadingPowerOn } = useMutation({
        mutationFn: async () => {
            await api.post('/power', { power: true });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['status'] })
    })

    const { mutate: handleTurnOff, isLoading: isLoadingPowerOff } = useMutation({
        mutationFn: async () => {
            await api.post('/power', { power: false });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['status'] })
    })

    useEffect(() => {
        (async () => {
            const response = await api.get('/effects');
            setEffects(response.data)
        })();
    }, [])

    if (isLoadingStatus || isLoadingColor || isLoadingEffect || isLoadingPowerOff || isLoadingPowerOn)
        return <div className={styles.homeWrapper}><Loader /></div>
    if (!status.device)
        return <div className={styles.homeWrapper}>Não foi possível conectar ao dispositivo.</div>
    if (error)
        return <div className={styles.homeWrapper}>Erro desconhecido.</div>

    return (
        <div className={styles.homeWrapper}>
            <h2><img src={logo} alt="" />RGB Leds Controller</h2>
            <div className={styles.homeContent}>
                <section className={styles.statusWrapper}>
                    <InformationField
                        title="Dispositivo"
                        value={status.device}
                    />
                    <InformationField
                        title="Energia"
                        value={status.on === true ? 'Ligado' : 'Desligado'}
                    />
                    <InformationField
                        title="Modo"
                        value={status.on === true ? (status.mode === 'color' ? 'Cor Fixa' : 'Efeito') : '-'}
                    />
                    <InformationField
                        title="Efeito"
                        value={status.on === true && status.effectName ? status.effectName : '-'}
                    />
                    <InformationField
                        title="Velocidade"
                        value={status.on === true && status.mode == 'pattern' ? `${parseInt(status.speed)}%` : '-'}
                    />
                    <InformationField
                        title="Cor"
                        value={
                            status.on && status.mode === 'color' ?
                                <div
                                    className={styles.currentColor}
                                    style={{ backgroundColor: status.hexColor }}
                                /> : '-'
                        }
                    />
                </section>

                <div className={styles.line} />

                <section className={styles.energyWrapper}>
                    <h3>Energia</h3>
                    <div>
                        <Button
                            onClick={handleTurnOn}
                            name="Ligado"
                            active={status.on}
                        />
                        <Button
                            onClick={handleTurnOff}
                            name="Desligado"
                            active={!status.on}
                        />
                    </div>
                </section>

                <section className={styles.controllersWrapper}>

                    <div>
                        <h3>Cores</h3>

                        <Wheel
                            onChange={color => {
                                status.on && setColor(color.hex)
                            }}
                            onMouseDownCapture={() => {
                                status.on &&
                                    document.getElementById('root')!.addEventListener('mouseup', changeColor)
                            }}
                            color={color}
                            style={{ opacity: !status.on ? 0.5 : 1 }}
                        />

                        <div className={styles.rangeWrapper}>
                            <span>Brilho</span>
                            <span>
                                <input
                                    type="range"
                                    min={10}
                                    max={100}
                                    value={brightness}
                                    onChange={e => setBrightness(Number(e.currentTarget.value))}
                                    onMouseUp={() => handleSetColor()}
                                    disabled={!status.on}
                                />
                                <label>{brightness}%</label>
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3>Efeitos</h3>

                        <div className={styles.effectButtonsWrapper}>
                            {effects.map((effect: any, idx: number) => (
                                <Button
                                    key={idx}
                                    onClick={() => handleSetEffect(effect.effect)}
                                    name={effect.name}
                                    active={status.pattern === effect.effect && status.on}
                                    disabled={!status.on}
                                />
                            ))}
                        </div>

                        <div className={styles.rangeWrapper}>
                            <span>Velocidade</span>
                            <span>
                                <input
                                    type="range"
                                    min={10}
                                    max={100}
                                    value={speed}
                                    onChange={e => setSpeed(Number(e.currentTarget.value))}
                                    onMouseUp={() => handleSetEffect(status.pattern)}
                                    disabled={!status.on || !status.pattern}
                                />
                                <label>{speed}%</label>
                            </span>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    )
}