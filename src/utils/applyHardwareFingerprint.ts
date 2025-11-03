import {Page} from "playwright";
import {BrowserFingerprint} from "../types";

export const applyHardwareFingerprint = async (page: Page, fingerprint: BrowserFingerprint): Promise<void> => {
    await page.addInitScript((fprint) => {
        Object.defineProperty(navigator, 'hardwareConcurrency', {get: () => fprint.hardwareConcurrency});
        Object.defineProperty(navigator, 'deviceMemory', {get: () => fprint.deviceMemory});
        Object.defineProperty(screen, 'width', {get: () => fprint.screen.width});
        Object.defineProperty(screen, 'height', {get: () => fprint.screen.height});

        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function (parameter) {
            if (parameter === 37445) return fprint.renderer;
            return getParameter.call(this, parameter);
        };
    }, fingerprint);
};