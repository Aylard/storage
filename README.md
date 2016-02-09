# BrowserStorage
Unified API for Browser Storages (cookies, session, local)
## How to use

```javascript
// Import Storage
var BrowserStorage = require("browser-storage");

// ======================
// Get f.e. local storage
// ======================
var localStorage = BrowserStorage('localStorage');

// Sets value
localStorage.set("test", "abc");

// Gets value
localStorage.get("test");

// Remove value
localStorage.remove("test");

// ======================
// Get sessionStorage
// ======================
var sessionStorage = BrowserStorage('sessionStorage');

// Sets value
sessionStorage.set("test", "abc");

// Gets value
sessionStorage.get("test");

// Remove value
sessionStorage.remove("test");


// ======================
// Get cookies
// ======================
var cookies = BrowserStorage('cookies');

// Sets value
cookies.set("test", "abc");

// Gets value
cookies.get("test");

// Remove value
cookies.remove("test");

```

## API
Returns _null_ if localStorage, sessionStorage and cookies are disabled.

If no argument specified, priorites are:

1. localStorage
2. sessionStorage
3. cookies

Always returns three functions:

_get_(key) , _set_(key, value), _remove_(key)