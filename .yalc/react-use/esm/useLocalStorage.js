/* eslint-disable */
import { useState, useCallback } from 'react';
import { isClient } from './util';
var noop = function () { };
var useLocalStorage = function (key, initialValue, options) {
    if (!isClient) {
        return [initialValue, noop, noop];
    }
    if (!key) {
        throw new Error('useLocalStorage key may not be falsy');
    }
    var deserializer = options ? (options.raw ? function (value) { return value; } : options.deserializer) : JSON.parse;
    var _a = useState(function () {
        try {
            var serializer = options ? (options.raw ? String : options.serializer) : JSON.stringify;
            var localStorageValue = localStorage.getItem(key);
            if (localStorageValue !== null) {
                return deserializer(localStorageValue);
            }
            else {
                initialValue && localStorage.setItem(key, serializer(initialValue));
                return initialValue;
            }
        }
        catch (_a) {
            // If user is in private mode or has storage restriction
            // localStorage can throw. JSON.parse and JSON.stringify
            // can throw, too.
            return initialValue;
        }
    }), state = _a[0], setState = _a[1];
    var set = useCallback(function (valOrFunc) {
        try {
            var newState = typeof valOrFunc === 'function' ? valOrFunc(state) : valOrFunc;
            if (typeof newState === 'undefined')
                return;
            var value = void 0;
            if (options)
                if (options.raw)
                    if (typeof newState === 'string')
                        value = newState;
                    else
                        value = JSON.stringify(newState);
                else if (options.serializer)
                    value = options.serializer(newState);
                else
                    value = JSON.stringify(newState);
            else
                value = JSON.stringify(newState);
            localStorage.setItem(key, value);
            setState(deserializer(value));
        }
        catch (_a) {
            // If user is in private mode or has storage restriction
            // localStorage can throw. Also JSON.stringify can throw.
        }
    }, [key, setState]);
    var remove = useCallback(function () {
        try {
            localStorage.removeItem(key);
            setState(undefined);
        }
        catch (_a) {
            // If user is in private mode or has storage restriction
            // localStorage can throw.
        }
    }, [key, setState]);
    return [state, set, remove];
};
export default useLocalStorage;
