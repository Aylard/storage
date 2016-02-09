/*******************************************************************************
 * Name: Simple, lightweight web storage (cookies, session&local storage) module
 * Version: 1.0.0
 * Author: Michal Nerc (http://michalnerc.pl)
 ******************************************************************************/

/**
 * Returns an API for browsers storage (adapter)
 * Priorities localStorage > sessionStorage > cookies
 *
 * @param {String} preferredStorage (localStorage | sessionStorage | cookies) the storage you want to use
 * @returns object {
     *      // Get the value of given key
     *      get: function(key),
     *      // Set the value to key
     *      set: function(key, value),
     *      // Delete key
     *      remove: function(key)
     * }
 */
var BrowserStorage = function (preferredStorage) {

    // Flag for test if localStorage support
    var _isLocalStorageSupport = (function () {

        // Test if localStorage is not supported
        if (typeof localStorage === "undefined") {
            return false;
        }

        // Test if localStorage is turned off
        var testForStorageSupport = 'isSupported';
        try {
            localStorage.setItem(testForStorageSupport, 'isSupported');
            localStorage.removeItem(testForStorageSupport);
            return true;
        } catch (e) {
            return false;
        }
    })();

    // Flag for test if sessionStorage support
    var _isSessionStorageSupport = (function () {
        return (typeof sessionStorage != 'undefined');
    })();

    // Check for cookies support
    var _isCookiesSupport = (function () {
        if (typeof navigator.cookieEnabled == "undefined") {
            document.cookie = "testForCookieSupport";
            return (document.cookie.indexOf("testForCookieSupport") != -1);
        } else {
            return (navigator.cookieEnabled);
        }
    })();

    /**
     * Check size of Storage
     * Browser approx has 5MB ( 5242878 B , avg. 5200000 characters) limit, so I prefer to check that frequently
     *
     * @param {String} storage
     * @returns {number} size of a storage
     */
    var testStorageSize = function (storage) {
        var allStrings = '';

        // Storage check
        for (var key in window[storage]) {
            if (window[storage].hasOwnProperty(key)) {
                allStrings += window[storage][key];
            }
        }

        // Calculate size
        var size = allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) : 0;
        if (size >= 3000 && size < 4000) {
            console.warn(storage + ' has exceed 3MB mark. You have 2 MB left, careful.');
        }
        if (size >= 4000 && size < 5000) {
            console.warn(storage + ' has exceed 4MB mark. ');
        }
        if (size >= 5000) {
            console.error(storage + ' has exceed 5MB mark. Your item cannot be added.');
        }
        return size;
    };

    // Returns as first a localStorage if not specified in preferredStorage and browser has support
    if ((typeof preferredStorage == 'undefined' || preferredStorage == 'localStorage') && _isLocalStorageSupport) {
        return {
            set: function (key, value) {
                testStorageSize('localStorage');
                value = JSON.stringify(value);
                try {
                    window.localStorage.setItem(key, value);
                    return window.sessionStorage.getItem(key);
                } catch (e) {
                    console.error('Item ' + key + ' of value ' + value + ' cannot be added because of :');
                    console.error(e);
                    return false;
                }
            },
            get: function (key) {
                return JSON.parse(window.localStorage.getItem(key));
            },
            remove: function (key) {
                window.localStorage.removeItem(key);
                return true;
            }
        };
    }

    // Returns as second a sessionStorage if not specified in preferredStorage and browser has support
    if ((typeof preferredStorage == 'undefined' || preferredStorage == 'sessionStorage') && _isSessionStorageSupport) {
        return {
            set: function (key, value) {
                testStorageSize('sessionStorage');
                value = JSON.stringify(value);
                try {
                    window.sessionStorage.setItem(key, value);
                    return window.sessionStorage.getItem(key);
                } catch (e) {
                    console.error('Item ' + key + ' of value ' + value + ' cannot be added because of :');
                    console.error(e);
                    return false;
                }
            },
            get: function (key) {
                return JSON.parse(window.sessionStorage.getItem(key));
            },
            remove: function (key) {
                window.sessionStorage.removeItem(key);
                return true;
            }
        }
    }

    // Returns as third a cookies if not specified in preferredStorage and browser has support
    if ((typeof preferredStorage == 'undefined' || preferredStorage == 'cookies') && _isCookiesSupport) {
        return {
            set: function (key, value, exdays) {
                value = JSON.stringify(value);
                var cstring = key + "=" + value;
                if (typeof exdays != 'undefined') {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + d.toUTCString();
                    cstring += "; " + expires;
                }
                document.cookie = cstring;
                return value;
            },
            get: function (name) {
                var name = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return null;
            },
            remove: function (key) {
                document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                return true;
            }
        }
    }

    return null;
};

/**
 * Export browser storage
 */
module.exports = new BrowserStorage();