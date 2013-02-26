// set up the REST API handler methods are defined in api.js
var api = require('./controller/api.js');
app.post('/dogtag', api.post);
app.get('/dogtag/near/:lon/:lat/:dist?', api.near);
app.get('/dogtag/:name/:descr/:latitude/:longitude?', api.save);
app.get('/dogtag/:name.:format?', api.show);
app.get('/dogtag', api.list);
