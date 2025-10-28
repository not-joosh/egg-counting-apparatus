

export const serialize = (eggMatrix: string[][]) => {
    let flatMatrix: any[] = [];
    eggMatrix.forEach((row) => {
        flatMatrix = flatMatrix.concat(row);
    });
    return flatMatrix;
};


export const unserialize = (flatMatrix: string[]) => {
    let eggMatrix = [];
    for (let i = 0; i < flatMatrix.length; i += 6) {
        eggMatrix.push(flatMatrix.slice(i, i + 6));
    }
    return eggMatrix;
};
