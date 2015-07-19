'use strict';

var pmsg = {};
function myPrivateMessaging(data) {
    var name = getName(data);
    jPrompt('Please enter your message to ' + name, 'Hi ' + name + '...', 'Private Messageing to ' + name, function (msg) {
        pmsg = getPrivateMessageFormat(msg, name);
        sendSocketMessage(pmsg);
    });
}
function getName(data) {
    return data.innerHTML;
}
function getPrivateMessageFormat(msg, name) {
    if (msg != null) {
        pmsg.data = '/w ' + name + ' ' + msg;
        pmsg.to = name;
        pmsg.msg = msg;
    }
    return pmsg;
}
function sendSocketMessage(pmsg) {
    if (checkUndefinedOrNull(pmsg) && checkUndefinedOrNull(socket)) {
        socket.emit('private chat msg', pmsg.data, function (data) {
            if (data.error == 0) {
                var from = $('li#listItem.selected').innerHTML;
                if (from != null) {
                    $('#chat').append('<span class=\'whisper\'><b>' + from + ' :</b>' + pmsg.msg + '</span></br>');
                } else {
                    from = 'You';
                    $('#chat').append('<span class=\'whisper\'><b>' + from + ' :</b>' + pmsg.msg + '</span></br>');
                }
            } else {
                $('#chat').append('<span class=\'error\'><b>' + data + '</span></br>');
            }
        });
    }
}
function checkUndefinedOrNull(data) {
    if (data != undefined || data != null) {
        return true;
    } else {
        return false;
    }
}
