import { Platform } from 'react-native';
import * as webDb from './database.web';
import * as nativeDb from './database.native';

const activeDb = Platform.OS === 'web' ? webDb : nativeDb;

export const initDatabase = activeDb.initDatabase;
export const getOrCreateDeviceUuid = activeDb.getOrCreateDeviceUuid;
export const getLocalFlashcards = activeDb.getLocalFlashcards;
export const saveLocalFlashcard = activeDb.saveLocalFlashcard;
export const deleteLocalFlashcard = activeDb.deleteLocalFlashcard;
export const updateFlashcardSM2 = activeDb.updateFlashcardSM2;
export const cacheWordsBulk = activeDb.cacheWordsBulk;
export const getCachedWordByClass = activeDb.getCachedWordByClass;
export const getAllCachedWords = activeDb.getAllCachedWords;
export const logLearningEvent = activeDb.logLearningEvent;
export const getUnsyncedEvents = activeDb.getUnsyncedEvents;
export const markEventsSynced = activeDb.markEventsSynced;

export type LocalFlashcard = webDb.LocalFlashcard;
export type LearningEvent = webDb.LearningEvent;
