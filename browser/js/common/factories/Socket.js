'use strict';
app.factory('SocketFactory', function() {
    var socket = null;
    return {
        getSocket : function() {
            if (!socket) {
                socket = io();
            }
            return socket;
        }
    };
});