# CRMJS

Wraps the Dynamics CRM XRM object to give a friendlier namespace and minimal file size (6.4kb when minified).

I've also decided that 2017 is the year I will finally try to wean myself off jQuery - so no dependencies there either.

To use, add the file as a web resource and then reference on your Dynamics 365 forms. To use, simply reference the object crmjs:

```javascript
var attribute = crmjs.attr.get('firstname');
crmjs.attr.addOnChange(
   'firstname', 
    function () {
        //do something on change
    }, 
    true);
```

Requests can be made by raising issues against this repo.

### Useful:

 * [uglify-js](https://skalman.github.io/UglifyJS-online/) for producing the minified file.
