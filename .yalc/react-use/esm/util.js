import isDeepEqualReact from 'fast-deep-equal/react';
export var isClient = typeof window === 'object';
export var on = function (obj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return obj.addEventListener.apply(obj, args);
};
export var off = function (obj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return obj.removeEventListener.apply(obj, args);
};
export var isDeepEqual = isDeepEqualReact;
