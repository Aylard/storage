# BrowserStorage
Unified API for Browser Storages (cookies, session, local)
## How to use

```javascript
// Import Storage
var BrowserStorage = require("browser-storage");

// Get f.e. local storage
var localStorage = BrowserStorage('localStorage');

// Sets value
localStorage.set("test", "abc");

// Gets value
localStorage.get("test");

// Remove value
localStorage.remove("test");
```



[http://michalnerc.pl](http://michalnerc.pl)
