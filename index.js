/* global Promise: false */
(function (global, navigator) {
    global.notify = {
        requestPermission: requestPermission(),
        sendNotification: sendNotification(),
        getStatus: getStatus(),
        addStatusChangedEvent: addStatusChangedEvent,
        removeStatusChangedEvent: removeStatusChangedEvent
    };

    var $$sts = null;

    function removeStatusChangedEvent(evtListener) {
        if (!evtListener || typeof evtListener !== "function")
            throw new TypeError("Falha: parâmetros incorretos.");
        if ($$sts)
            return $$sts.removeEventListener("change", evtListener);
    }

    function addStatusChangedEvent(evtListener) {
        if (!evtListener || typeof evtListener !== "function")
            throw new TypeError("Falha: parâmetros incorretos.");

        global.notify.getStatus().then(function (status) {
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
                return Promise.resolve(true);
            };
        }
        else
            return function () {
                return false;
            };
    }

    function getStatus() {
        if ("permissions" in navigator) {
            return function () {
                return navigator.permissions.query({ name: "notifications" });
            };
        } else {
            return function () {
                var t = new Error("Não suportado.");
                t.code = "NOT_SUPPORTED";
                throw t;
            };
        }
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
})(window, navigator);
