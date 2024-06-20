import {
    handleKeydown,
    handleFocusOut,
    handleKeyup,
    handleMouseMove,
    handleSendMessage
} from "./utils/events"

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);
document.addEventListener('focusout', handleFocusOut);
document.addEventListener('mousemove', handleMouseMove);
window.addEventListener('sendMessage', handleSendMessage);