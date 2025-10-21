import {testWithSynpress} from "@synthetixio/synpress";
import {metaMaskFixtures} from "@synthetixio/synpress/playwright";
import {getDataFromEnvironment} from "./utils";
import initMetamaskSetup from './metamask';

export const createMetamaskTestInstance = () => {
    try {
        const {password, seed} = getDataFromEnvironment('evm');

        const setup = initMetamaskSetup(password, seed);

        return {
            test:testWithSynpress(metaMaskFixtures(setup)),
            password: password,
    }
    } catch (error) {
        console.error(error);
    }
}