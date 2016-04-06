var crmjs = (function (xrm, errorOnNotFound) {
    var xrmvar = xrm;
    if (xrmvar === null) {
        if (typeof Xrm !== 'undefined' && Xrm != null && Xrm.Page != null && Xrm.Page.context != null) {
            scriptContext = Xrm.Page.context;
        } else {
            //To do - load ClientGlobalContext
        }
    }
    var throwErrorOnNotFound = errorOnNotFound;
    throwErrorOnNotFound = IsNullOrUndefined(throwErrorOnNotFound) ? false : throwErrorOnNotFound;
    
    function IsNullOrUndefined(param) {
        return param === null || param === undefined;
    }

    return {
        attr: {
            get: function (fieldName) {
                var attr = xrmvar.Page.getAttribute(fieldName);
                if (throwErrorOnNotFound) {
                    throw 'attributes.get - no attribute found with name: ' + fieldName;
                }
                return attr;
            },
            getControl: function (fieldName) {
                var attr = xrmvar.Page.getControl(fieldName);
                if (throwErrorOnNotFound) {
                    throw 'attributes.getControl - no attribute found with name: ' + fieldName;
                }
                return attr;
            },
            getValue: function (fieldName) {
                var attr = crmjs.attr.get(fieldName);
                return attr.getValue();
            },
            setValue: function(fieldName, value) {
                var attr = crmjs.attr.get(fieldName);
                try {
                    attr.setValue(value);
                } catch (ex) {
                    if (throwErrorOnNotFound) {
                        throw 'attr.setValue (' + fieldName + ') - Exception: ' + ex.message;
                    } else {
                        throw ex;
                    }
                }
            },
            setLookupValue: function (fieldName, lookupId, lookupName, lookupType) {
                var attr = crmjs.attr.get(fieldName);
                try {
                    var array = [];
                    array[0] = {};
                    array[0].id = lookupId;
                    array[0].name = lookupName;
                    array[0].entityType = lookupType;
                    attr.setValue(array);
                } catch (ex) {
                    if (throwErrorOnNotFound) {
                        throw 'attr.setLookupValue ('+ fieldName +') - Exception: ' + ex.message;
                    } else {
                        throw ex;
                    }
                }
            }
        },
        form: {
            getId: function() {
                return xrmvar.Page.data.entity.getId();
            }
        }
    }
})();
