/* global Promise: false */
(function (global, navigator) {
    global.notify = {
        requestPermission: requestPermission(),
        sendNotification: sendNotification(),
        getPermission: getPermission(),
        addPermissionChangedEvent: addPermissionChangedEvent,
        removePermissionChangedEvent: removePermissionChangedEvent
    };

    var $$sts = null;

    function removePermissionChangedEvent(evtListener) {
        if (!evtListener || typeof evtListener !== "function")
            throw new TypeError("Falha: parâmetros incorretos.");
        if ($$sts)
            $$sts.removeEventListener("change", evtListener);
    }

    function addPermissionChangedEvent(evtListener) {
        if (!evtListener || typeof evtListener !== "function")
            throw new TypeError("Falha: parâmetros incorretos.");

        _getPermission().then(function (status) {
            ($$sts = status).addEventListener("change", evtListener);
        });
    }

    /**
     * Requisita ao usuário a permissão para enviar notificações
     * @returns {Function}
     */
    function requestPermission() {
        if ("Notification" in global) {
            return global.Notification.requestPermission;
        } else if ("mozNotification" in navigator || "webkitNotifications" in navigator) {
            return function () {
                return Promise.resolve("granted");
            };
        }
        else
            return function () {
                return notSupported();
            };
    }

    function getPermission() {
        if ("Notification" in global) {
            return function () { return Promise.resolve(Notification.permission); };
        } else if ("permissions" in navigator) {
            return function () { return _getPermission(); };
        } else return notSupported();
    }

    function _getPermission() {
        return navigator.permissions.query({ name: "notifications" });
    }

    /**
     * Envia uma notificação para a tela, se tiver suporte
     * @returns {Function}
     */
    function sendNotification() {
        if ("Notification" in global) {
            return function (title, options) {
                return new Notification(title, options);
            };
        } else if ("mozNotification" in navigator) {
            return function (title, options) {
                // Gecko < 22
                return navigator.mozNotification
                    .createNotification(title, options.body, options.icon)
                    .show();
            };
        } else if ("webkitNotifications" in navigator) {
            return function (title, options) {
                // Chromium < 22
                return navigator.webkitNotifications
                    .createNotification(title, options.body, options.icon)
                    .show();
            };
        } else {
            return function (title, options) {
                alert(title + ": " + (options.body || ""));
                return false;
            };
        }
    }

    function notSupported() {
        return new Promise(function () {
            var t = new Error("Não suportado.");
            t.code = "NOT_SUPPORTED";
            throw t;
        });
    }
})(window, navigator);
