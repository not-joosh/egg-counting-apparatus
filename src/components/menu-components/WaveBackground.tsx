import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";

const WaveBackground: React.FC = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);
    
    return (
        <>
            <div className="absolute inset-0 overflow-hidden bg-gray-900">
                <Particles
                    id="tsparticles"
                    // @ts-ignore
                    init={particlesInit}
                    options={{
                        fullScreen: { enable: false },
                        background: {
                            color: {
                                value: "transparent",
                            },
                        },
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                resize: true,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#ffffff",
                            },
                            links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.5,
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 2,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />
                <motion.div
                    className="absolute inset-0 opacity-50"
                    animate={{
                        background: [
                            "radial-gradient(circle, rgba(74,0,224,0.2) 0%, rgba(0,0,0,0) 50%)",
                            "radial-gradient(circle, rgba(74,0,224,0.2) 50%, rgba(0,0,0,0) 100%)",
                        ],
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg
                        className="w-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                        style={{ height: '25vh', minHeight: '100px' }}
                    >
                        <motion.path
                            fill="rgba(74, 0, 224, 0.2)"
                            fillOpacity="1"
                            initial={{ d: "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                            animate={{
                                d: [
                                    "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                    "M0,64L48,85.3C96,107,192,149,288,160C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                ],
                            }}
                            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        />
                        <motion.path
                            fill="rgba(74, 0, 224, 0.4)"
                            fillOpacity="1"
                            initial={{ d: "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                            animate={{
                                d: [
                                    "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                    "M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                ],
                            }}
                            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                        />
                    </svg>
                </div>
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            "linear-gradient(0deg, rgba(74,0,224,0) 0%, rgba(74,0,224,0.1) 100%)",
                            "linear-gradient(0deg, rgba(74,0,224,0.1) 0%, rgba(74,0,224,0) 100%)",
                        ],
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                />
            </div>
            <div className="absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-purple-500 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 4 + 1}px`,
                                height: `${Math.random() * 4 + 1}px`,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: Math.random() * 2 + 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
            </div>
        </>
    );
};

export default WaveBackground;