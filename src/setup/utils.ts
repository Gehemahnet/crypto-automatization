export type EnvData = { password: string, seed: string }

export const getDataFromEnvironment = (walletType: 'solana' | 'evm'): EnvData  => {
    return walletType === 'solana' ? getSolanaData() : getEvmData()
}


const getEvmData = (): EnvData => {
    if (!process.env.EVM_PASS || !process.env.EVM_SEED) {
        throw new Error('Input data to .env file')
    }

    return {
        password: process.env.EVM_PASS,
        seed: process.env.EVM_SEED,
    }
}

const getSolanaData = (): EnvData => {
    if (!process.env.SOLANA_PASS || !process.env.SOLANA_SEED) {
        throw new Error('Input data to .env file')
    }

    return {
        password: process.env.SOLANA_PASS,
        seed: process.env.SOLANA_SEED,
    }
}