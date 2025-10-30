import {Tokens} from "../types";

export const useTokenPair = () => {
    const tokenPair = {
        first: '',
        second: '',
    }



    let pairEstablished = false;
    let counter = 1;

    const establishTokenPair = async (
        setTokenPair: (first: string, second: string) => Promise<void>
    ) => {
        console.log(pairEstablished)
        if (
            (tokenPair.first === Tokens.SOL && tokenPair.second === Tokens.USDT) ||
            (tokenPair.first !== Tokens.USDT && tokenPair.second !== Tokens.SOL)
        ) {
            console.debug('Ставим USDC -> USDT')
            await setTokenPair(Tokens.USDC, Tokens.USDT)
        } else if (
            (tokenPair.first === Tokens.SOL && tokenPair.second === Tokens.USDC) ||
            (tokenPair.first === Tokens.USDC && tokenPair.second === Tokens.SOL)
        ) {
            console.debug('Ставим USDT -> USDC')
            await setTokenPair(Tokens.USDT, Tokens.USDC)
        } else {
            throw Error('Наебнулась установка пары')
        }
    }

    return {tokenPair, pairEstablished, counter, establishTokenPair}
}