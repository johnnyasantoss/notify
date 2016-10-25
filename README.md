# Notify-wrapper
Just a simple wrapper for Notifications API

# Install

* using bower `bower install notify-wrapper`
* using npm `npm install notify-wrapper` 

# API

**requestPermission() => Promise**: returns a Promise that will be fulfilled when user interacts 
with your request.

**sendNotification(title: String, options?: Object) => Notification|Boolean**: returns
a Notification object and show it.

**getPermission() => Promise**: returns a Promise with current status of notifications permission.
If not supported, it will throw a Error

**addPermissionChangedEvent(Function) => void**: adds a listener to permission changed event

**removePermissionChangedEvent(Function) => void**: removes a listener from permission changed event

# Notifications API

* [w3](https://www.w3.org/TR/notifications/)

* [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

* [WHATWG](https://notifications.spec.whatwg.org/)