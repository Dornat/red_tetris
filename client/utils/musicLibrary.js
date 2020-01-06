import {buildUrl} from './serverProtocol';
import boscage from '../music/tetris_effect_ost_boscage.mp3';
import newBeginnings from '../music/tetris_effect_ost_new_beginings.mp3';
import halfLife from '../music/halr_life_ost.mp3';

export const musicLibrary = {
    boscage: new Audio((buildUrl() + boscage)),
    newBeginnings: new Audio((buildUrl() + newBeginnings)),
    halfLife: new Audio((buildUrl() + halfLife)),
};

