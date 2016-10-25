/* global Promise: false */
(function () {
    window.notify = {
        requestPermission: requestPermission(),
        sendNotification: sendNotification(),
        getStatus: getStatus(),
        addEventoTrocaStatus: addEventoTrocaStatus,
        removerEvento: removerEvento
    };

    var $$sts = null;

    function removerEvento(evtListener) {
        if (!evtListener || typeof evtListener !== "function")
            throw new TypeError("Falha: parâmetros incorretos.");
        if ($$sts)
            return $$sts.removeEventListener("change", evtListener);
    }

    function addEventoTrocaStatus(evtListener) {
        if (!evtListener || typeof evtListener !== "function")
            throw new TypeError("Falha: parâmetros incorretos.");

        window.notify.getStatus().then(function (status) {
            ($$sts = status).addEventListener("change", evtListener);
        });
    }

    /**
     * Requisita ao usuário a permissão para enviar notificações
     * @returns {Function}
     */
    function requestPermission() {
        if ("Notification" in window) {
            return window.Notification.requestPermission;
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
        if ("Notification" in window) {
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
})();
