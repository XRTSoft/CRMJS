var crmjs = {
    xrmvar: Xrm,
    throwErrorOnNotFound: true,
    FORM_CREATE: 1,
    FORM_UPDATE: 2,
    FORM_READ_ONLY: 3,
    FORM_DISABLED: 4,
    AUTOSAVE: 70,

    isNullOrUndefined: function (param) {
        return param === null || param === undefined;
    },
    form: {
        name: function () {
            return crmjs.xrmvar.Page.ui.formSelector.getCurrentItem() === null ? '' : crmjs.xrmvar.Page.ui.formSelector.getCurrentItem().getLabel();
        },
        entityName: function () {
            return crmjs.xrmvar.Page.data.entity.getEntityName();
        },
        getId: function () {
            return crmjs.xrmvar.Page.data.entity.getId();
        }
    },
    notifications: {
        clearField: function (field) {
            var control = crmjs.attr.getControl();
            control.clearNotification();
        },
        setField: function (field, msg) {
            var control = crmjs.attr.getControl();
            control.setNotification(msg);
        },
        clearForm: function (id) {
            crmjs.xrmvar.Page.ui.clearFormNotification(id);
        },
        setForm: function (field, msg, level) {
            if (level !== 'ERROR' && level !== 'WARNING' && level !== 'INFORMATION') {
                leve = 'INFORMATION';
            }
            crmjs.xrmvar.Page.ui.setFormNotification(message, level, id);
        }
    },
    attr: {
        get: function (fieldName) {
            var attr = crmjs.xrmvar.Page.getAttribute(fieldName);
            if (attr === null && crmjs.throwErrorOnNotFound) {
                throw 'attributes.get - no attribute found with name: ' + fieldName;
            }
            return attr;
        },
        getControl: function (fieldName) {
            var attr = crmjs.xrmvar.Page.getControl(fieldName);
            if (attr === null && crmjs.throwErrorOnNotFound) {
                throw 'attributes.getControl - no attribute found with name: ' + fieldName;
            }
            return attr;
        },
        getValue: function (fieldName) {
            var attr = crmjs.attr.get(fieldName);
            return attr.getValue();
        },
        setValue: function (fieldName, value) {
            var attr = crmjs.attr.get(fieldName);
            try {
                attr.setValue(value);
            } catch (ex) {
                if (crmjs.throwErrorOnNotFound) {
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
                if (crmjs.throwErrorOnNotFound) {
                    throw 'attr.setLookupValue (' + fieldName + ') - Exception: ' + ex.message;
                } else {
                    throw ex;
                }
            }
        }
    }
}