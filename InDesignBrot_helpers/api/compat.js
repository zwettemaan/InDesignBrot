//
// This is the compat API. It is available in ExtendScript, CEP/JavaScript and UXPScript 
//

/**
* Function that either maps to `clearImmediate` or, in ExtendScript, to a substitute implementation.
* Calling UXES.clearImmediate works in all environments and can be used in shared code.
* 
* @function UXES.clearImmediate
* 
* @param {any} taskId - Identifies the pending immediate to clear. This is the value returned by `UXES.setImmediate()`.
*/

UXES.clearImmediate = function(taskId) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Function that either maps to `clearInterval` or, in ExtendScript, to a substitute implementation.
* Calling UXES.clearInterval works in all environments and can be used in shared code.
* 
* @function UXES.clearInterval
* 
* @param {any} taskId - Identifies the pending immediate to clear. This is the value returned by `UXES.setImmediate()`.
*/

UXES.clearInterval = function(taskId) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Function that either maps to `clearTimeout` or, in ExtendScript, to a substitute implementation.
* Calling UXES.clearTimeout works in all environments and can be used in shared code.
* 
* @function UXES.clearTimeout
* 
* @param {any} taskId - Identifies the pending immediate to clear. This is the value returned by `UXES.setImmediate()`.
*/

UXES.clearTimeout = function(taskId) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Function that either maps to `setImmediate` or, in ExtendScript, to a substitute implementation.
* Delay a call to a callback to the next tick of the event loop or next idle time (in ExtendScript)
* 
* @function UXES.setImmediate
* 
* @param {function} taskFtn - function to call
* @return {any} taskId - Identifies the pending immediate. This is the value passed to `UXES.clearImmediate()`.
*/

UXES.setImmediate = function(taskFtn) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Function that either maps to `setInterval` or, in ExtendScript, to a substitute implementation.
* Delay a call to a callback for at least the requested amount of time. Calls the callback repeatedly,
* with a minimum delay between each call, until the `UXES.clearInterval()` method is called.
* 
* @function UXES.setInterval
* 
* @param {function} taskFtn - function to call
* @param {number} timeoutMilliseconds - minimum delay in milliseconds
* @return {any} taskId - Identifies the pending interval. This is the value passed to `UXES.clearImmediate()`.
*/

UXES.setInterval = function(taskFtn, timeoutMilliseconds) { return UXES.IMPLEMENTATION_MISSING; };

/**
* Function that either maps to `setInterval` or, in ExtendScript, to a substitute implementation.
* Delay a call to a callback for at least the requested amount of time. Can be cancelled by calling `UXES.clearTimeout()`.
* 
* @function UXES.setTimeout
* 
* @param {function} taskFtn - function to call
* @param {number} timeoutMilliseconds - minimum delay in milliseconds
* @return {any} taskId - Identifies the pending timeout. This is the value passed to `UXES.clearTimeout()`.
*/

UXES.setTimeout = function(taskFtn, timeoutMilliseconds) { return UXES.IMPLEMENTATION_MISSING; };

//----------- Tests
