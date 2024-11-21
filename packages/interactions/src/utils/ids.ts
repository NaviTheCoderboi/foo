const idsUpdaterMap: Map<string, (v: string) => void> = new Map();

/**
 * Merges two ids.
 * @param idA - The first id.
 * @param idB - The second id.
 *
 * @returns The merged id.
 */
export const mergeIds = (idA: string, idB: string): string => {
    if (idA === idB) {
        return idA;
    }

    const setIdA = idsUpdaterMap.get(idA);
    if (setIdA) {
        setIdA(idB);
        return idB;
    }

    const setIdB = idsUpdaterMap.get(idB);
    if (setIdB) {
        setIdB(idA);
        return idA;
    }

    return idB;
};

const PREFIX = String(Math.round(Math.random() * 10000000000));

const getID = (() => {
    let id = 0;
    return () => ++id;
})();

export const useGenID = ({
    defaultId,
    customPrefix
}: {
    defaultId?: string;
    customPrefix?: string;
} = {}) => {
    const id = getID();
    const prefix = `op-svelte${PREFIX}`;
    return (
        defaultId ?? `${prefix}${customPrefix ? `-${customPrefix}` : ''}-${id}`
    );
};
