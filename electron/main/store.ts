import Store from 'electron-store';

export enum StoreKey {
    TIMER_SOUND_FOLDER = "timerSoundFolder"
}

export let store = new Store()