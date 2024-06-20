export interface IUserActivityData {
    user_id: string;
    appContext: string;
    setting: number;
    sourceId: string;
    studyId: string;
    text: string[];
    timeZone: number;
    startUnixTime: number;
    pressTimes: number[];
    releaseTimes: number[];
    keyAreas: string[];
    keyTypes: string[];
    positionX: number[];
    positionY: number[];
    pressure: number[];
    swipe: any[];
    autocorrectLengths: number[];
    autocorrectTimes: number[];
    autocorrectWords: string[];
    predictionLength: number | null;
    predictionLengths: number[];
    predictionTimes: number[];
    predictionWords: string[];
    textStructure: any[];
    mouseMovements: IMouseMoveData[];
}

export interface IMouseMoveData {
    timestamp: number;
    x: number;
    y: number;
}