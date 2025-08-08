import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faSun, faCloud } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';


function Forest() {
    const [trees, setTrees] = useState<{x: number,y: number, size: number}[]>([]);
    const [clouds, setClouds] = useState<{x: number,y: number, size: number}[]>([]);
    const [rocks, setRocks] = useState<{x: number,y: number, size: number}[]>([]);
    useEffect(() => {
        const generateRocks = () => {
            const rockCount = 15; //Math.floor(Math.random() * 5) + 5;
            const newRocks = Array.from({ length: rockCount }, () => ({
                x: Math.random() * 100,
                y: Math.random() * 90,
                size: Math.random() * 0.4 + 0.5,
            }));
            setRocks(newRocks);
        };
        const generateTrees = () => {
            const treeCount = 100;//Math.floor(Math.random() * 10) + 5;
            const newTrees = Array.from({ length: treeCount }, () => ({
                x: Math.random() * 100,
                y: Math.random() * 101,
                size: Math.random() * 3 + 3,
            }));
            setTrees(newTrees);
        };

        const generateClouds = () => {
            const cloudCount = 25; //Math.floor(Math.random() * 3) + 2;
            const newClouds = Array.from({ length: cloudCount }, () => ({  
                x: Math.random() * 110,
                y: Math.random() * 110,
                size: Math.random() * 3 + 1,
            }));
            setClouds(newClouds);
        };
        generateRocks();
        generateClouds();
        generateTrees();
    }, []);

  return (
    <>{(trees.length > 0 && clouds.length > 0) &&
        <div className="fixed inset-0">
            <Image src={"/ani.png"} alt="Ani" className="absolute -bottom-8 -left-10 z-1" width={500} height={500}/>
            <div className='absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500 to-blue-200 overflow-hidden'>
                <FontAwesomeIcon icon={faSun} className="absolute text-yellow-400 blur" size="4x" />
                {clouds.map((cloud, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faCloud}
                        className="absolute text-blue-200 opacity-70"
                        style={{
                            top: `${cloud.y}%`,
                            left: `${cloud.x}%`,
                            fontSize: `${cloud.size}rem`,
                            filter: 'blur(2px)',

                        }}
                    />
                ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-green-400 to-green-800">

                        <div
                            className="mountain bottom-35 left-0"
                            style={{
                                width: `10rem`,
                                height: `10rem`,
                                backgroundColor: '#964B00',
                            }}
                        />

                        <div
                            className="mountain2 bottom-75 left-25"
                            style={{
                                width: `15rem`,
                                height: `10rem`,
                                backgroundColor: '#964B00',
                            }}
                        />

                        <div
                            className="mountain3 bottom-130 left-250"
                            style={{
                                width: `20rem`,
                                height: `15rem`,
                                backgroundColor: '#964B00',
                            }}
                        />
                {trees.map((tree, index) => (
                    <div key={index}  >
                    <FontAwesomeIcon
                        icon={faTree}
                        className="text-lime-700 absolute h-1/2"
                        style={{
                        bottom: `${-10+tree.y}%`,
                        left: `${tree.x}%`,
                        fontSize: `${tree.size}rem`,
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faTree}
                        className="text-green-800 grayscale-35 absolute h-1/2"
                        style={{
                        bottom: `${-10+tree.y}%`,
                        left: `${tree.x}%`,
                        fontSize: `${tree.size}rem`,
                        clipPath: 'inset(0 0 0 55%)',
                        }}
                    />
                    </div>
                    
                ))}
                {rocks.map((rock, index) => (
                    <div
                        key={index}
                        className="absolute rock3"
                        style={{
                            bottom: `${rock.y}%`,
                            left: `${rock.x}%`,
                            width: `${rock.size}rem`,
                            height: `${rock.size}rem`,
                            backgroundColor: '#964B00',
                            borderRadius: `${Math.random() * 20}%`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                ))}
        </div>
        </div>}
    </>
  );
}

export default Forest;