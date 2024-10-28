declare const random: {
    seed: (seed?: string | undefined) => void;
    integer: (max?: number, min?: number) => number;
    float: (max?: number, min?: number) => number;
    list: (maxLength?: number, minLength?: number) => any[];
    words: (numWordsMax?: number, numWordsMin?: number) => string;
    boolean: () => boolean;
};
export default random;
