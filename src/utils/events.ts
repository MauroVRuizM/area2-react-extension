import { IKeyPressStartTimes } from "../interfaces/IKeyPressStartTimes";
import { IUserActivityData } from "../interfaces/IUserActivityData";

const createTypingData = () => {
    return {
        user_id: "a1b2c3d4e5f6g7h8i9j0",
        appContext: document.location.href,
        setting: 1,
        sourceId: "demo",
        studyId: "",
        text: [],
        timeZone: new Date().getTimezoneOffset() / -60,
        startUnixTime: Date.now(),
        pressTimes: [],
        releaseTimes: [],
        keyAreas: [],
        keyTypes: [],
        positionX: [],
        positionY: [],
        pressure: [],
        swipe: [],
        autocorrectLengths: [0],
        autocorrectTimes: [],
        autocorrectWords: [],
        predictionLength: null,
        predictionLengths: [],
        predictionTimes: [],
        predictionWords: [],
        textStructure: [],
        mouseMovements: []
    } as IUserActivityData;
}

let typingData = createTypingData();
let keyPressStartTimes: IKeyPressStartTimes = {};
let isTypingSessionActive = false;
let isMouseMovementSessionActive = false;

const resetTypingData = () => {
    typingData = createTypingData();
    isTypingSessionActive = false;
    console.log("Typing data reset");
}

const endMouseSession = () => {
    isMouseMovementSessionActive = false;
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    
    return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const trimArraysToMatchLength = () => {
    const minLength = Math.min(
        typingData.pressTimes.length, 
        typingData.releaseTimes.length
    );
    typingData.pressTimes.length = minLength;
    typingData.releaseTimes.length = minLength;
}

const sendTypingData = debounce(() => {
    if (!isTypingSessionActive) return;

    trimArraysToMatchLength();
    let attempts = 0;
    const maxAttempts = 3;

    function trySendMessage() {
        try {
            console.log('Attempting to send typing data:', JSON.stringify(typingData, null, 2));
            chrome.runtime.sendMessage(null, { type: 'log_key', data: typingData }, {}, (_) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                    if (attempts < maxAttempts) {
                        attempts++;
                        console.log(`Retrying to send typing data (attempt ${attempts})`);
                        trySendMessage();
                    }
                    return;
                }
                console.log('Typing data sent successfully');
                resetTypingData();
            });
        } catch (error) {
            console.error('Error during sendTypingData:', error);
        }
    }

    trySendMessage();
}, 5000);

export const handleKeydown = (event: KeyboardEvent) => {
    if (!isTypingSessionActive) {
        isTypingSessionActive = true;
        isMouseMovementSessionActive = true;
        typingData.startUnixTime = Date.now();
    }

    if (!keyPressStartTimes[event.key]) {
        keyPressStartTimes[event.key] = Date.now();
        typingData.pressTimes.push(keyPressStartTimes[event.key]);
        typingData.keyTypes.push(event.key);
        typingData.text.push(event.key);
    }
}

export const handleKeyup = (event: KeyboardEvent) => {
    if (keyPressStartTimes[event.key]) {
        typingData.releaseTimes.push(Date.now());
        delete keyPressStartTimes[event.key];
    }

    if (event.key === 'Enter') {
        endMouseSession(); //? End mouse movement session
        //? Explicitly capture Enter key release
        sendTypingData();
        (document.activeElement as HTMLElement)?.blur(); //? Unfocus the input to ensure session ends
    }
}

export const handleFocusOut = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;

    if (target.classList.contains('message_input')) {
        console.log('Focus out detected on message input');
    }

    if (!relatedTarget || !relatedTarget.closest('.message_input')) {
        console.log('Focus out detected');
    }

    endMouseSession(); //? End mouse movement session
    sendTypingData();
}

export const handleSendMessage = () => {
    console.log('sendMessage event detected');
    sendTypingData();
}

export const handleMouseMove = (event: MouseEvent) => {
    if(!isMouseMovementSessionActive) {return;}

    const mouseMoveData = {
        timestamp: Date.now(),
        x: event.clientX,
        y: event.clientY
    }

    typingData.mouseMovements.push(mouseMoveData);
    console.log(`Mouse move recorded at (${event.clientX}, ${event.clientY})`);
}