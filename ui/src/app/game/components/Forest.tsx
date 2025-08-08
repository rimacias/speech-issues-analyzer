import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faSun, faCloud } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

type Object = {
  x: number;
  y: number;
  size: number; 
};


function Forest() {
    const [trees, setTrees] = useState<{x: number,y: number, size: number}[]>([]);
    const [clouds, setClouds] = useState<{x: number,y: number, size: number}[]>([]);
    const [rocks, setRocks] = useState<{x: number,y: number, size: number}[]>([]);

    const isOverlapping = (newObject:Object, existingObject:Object[]) => {
        const buffer = 2;
            return existingObject.some(object => {
                const dx = (object.x - newObject.x);
                const dy = (object.y - newObject.y);
                const distance = Math.sqrt(dx * dx + dy * dy);

                const sizeSum = (object.size + newObject.size) * 0.5 + buffer;

                return distance < sizeSum;
            });
    };


    const generateTrees = (setTrees: (trees: Object[]) => void): void => {
        const treeCount = 100;
        const maxAttempts = treeCount * 10;
        const newTrees: Object[] = [];

        let attempts = 0;

        while (newTrees.length < treeCount && attempts < maxAttempts) {
            const newTree: Object = {
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 3, // Entre 3 y 6 rem
            };

            if (!isOverlapping(newTree, newTrees)) {
            newTrees.push(newTree);
            }

            attempts++;
        }

        setTrees(newTrees);
    };
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
        generateTrees(setTrees);
    }, []);

  return (
    <>{(trees.length > 0 && clouds.length > 0) &&
        <div className="fixed inset-0">
            <Image src={"/ani.png"} alt="Ani" className="absolute -bottom-8 -left-10 z-201" width={500} height={500}/>
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
                            className="mountain bottom-35 left-0 bg-gradient-to-b from-amber-900 to-amber-950"
                            style={{
                                width: `10rem`,
                                height: `10rem`,
                            }}
                        />

                        <div
                            className="mountain2 bottom-75 left-25 bg-gradient-to-br from-amber-800 to-amber-950"
                            style={{
                                width: `15rem`,
                                height: `10rem`,
                            }}
                        />

                        <div
                            className="mountain3 bottom-130 left-250 bg-gradient-to-t from-amber-900 from-25% via-amber-700 via-50% to-white" 
                            style={{
                                width: `20rem`,
                                height: `15rem`,
                                backgroundColor: '#964B00',
                            }}
                        />
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
                {trees.map((tree, index) => (
                    <div key={index} className={`h-fit`} 
                        style={{
                            width: `${tree.size}rem`,
                            height: `${tree.size}rem`,
                            left: `${tree.x}%`,
                            bottom: `${tree.y-10}%`,   
                            position: 'absolute',
                            zIndex: Math.floor(100 + (1000 - tree.y * 10) * 0.1),
                        }}
                    >
                    <FontAwesomeIcon
                        icon={faTree}
                        className={`absolute text-lime-700 stroke-green-900 stroke-5 h-1/2`}
                        style={{
                        fontSize: `${tree.size}rem`,
                        filter: 'blur(0.5px)',
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faTree}
                        className={`text-green-800 h-1/2`}
                        style={{
                        fontSize: `${tree.size}rem`,
                        clipPath: 'inset(0 0 0 55%)',
                        filter: 'blur(0.9px) grayscale(0.45)',
                        }}
                    />
                    </div>
                    
                ))}
        </div>
        </div>}
    </>
  );
}

export default Forest;