var crmjs = (function () {
    var xrmvar = Xrm;
    var throwErrorOnNotFound = true;


    function IsNullOrUndefined(param) {
        return param === null || param === undefined;
    }
    function IsNullOrUndefinedOrEmptyString(param) {
        var isEmpty = IsNullOrUndefined(param);
        return isEmpty ? isEmpty : isEmpty === '';
    }

    var FORM_TYPE_CREATE = 1;
    var FORM_TYPE_UPDATE = 2;
    var FORM_TYPE_READ_ONLY = 3;
    var FORM_TYPE_DISABLED = 4;
    var FORM_TYPE_BULK_EDIT = 6;
    var FORM_TYPE_READ_OPTIMIZED = 11;

    return {
        FORM_TYPE_CREATE: 1,
        FORM_TYPE_UPDATE: 2,
        FORM_TYPE_READ_ONLY: 3,
        FORM_TYPE_DISABLED: 4,
        FORM_TYPE_BULK_EDIT: 6,
        FORM_TYPE_READ_OPTIMIZED: 11,
        isNullOrUndefined: function (param) {
            return param === null || param === undefined;
        },
        isNullOrUndefinedOrEmptyString: function (param) {
            var isEmpty = IsNullOrUndefined(param);
            return isEmpty ? isEmpty : isEmpty === '';
        },
        init: function () {

        },
        webAPI: {
            fixId: function (id) {
                id = crmjs.isNullOrUndefined(id) ? '' : id;
                id = id.replace('{', '');
                id = id.replace('}', '');
                return id;
            },
            getByUrl: function (url, onComplete) {
                var xhr = new XMLHttpRequest()
                xhr.open('get', url, true);
                xhr.setRequestHeader('OData-MaxVersion', '4.0');
                xhr.setRequestHeader('OData-Version', '4.0');
                xhr.setRequestHeader('Prefer', 'odata.include-annotations="*"');
                xhr.onreadystatechange = function (result) {
                    if (this.readyState == 4) {
                        xhr.onreadystatechange = null;
                        if (onComplete !== null && typeof onComplete === 'function') {
                            onComplete(JSON.parse(this.responseText));
                        }
                    }
                };

                //Send XHRs
                xhr.send();
            },
            filter: function (setName, filter, select, onComplete) {
                var url = '/api/data/v8.2/' + setName + '/';
                url += '?filter=' + filter + '&';
                url += '$select=' + select;
                crmjs.webAPI.getByUrl(url, onComplete);
            },
            byId: function (setName, id, select, onComplete) {
                var url = '/api/data/v8.2/' + setName + '(' + crmjs.webAPI.fixId(id) + ')';
                url += '?$select=' + select;
                crmjs.webAPI.getByUrl(url, onComplete);
            }
        },
        attr: {
            get: function (fieldName) {
                var attr = xrmvar.Page.getAttribute(fieldName);
                if (throwErrorOnNotFound && IsNullOrUndefined(attr)) {
                    throw 'attributes.get - no attribute found with name: ' + fieldName;
                }
                return attr;
            },
            getControl: function (fieldName) {
                var attr = xrmvar.Page.getControl(fieldName);
                if (throwErrorOnNotFound && IsNullOrUndefined(attr)) {
                    throw 'attributes.getControl - no control found with name: ' + fieldName;
                }
                return attr;
            },
            getValue: function (fieldName) {
                var attr = crmjs.attr.get(fieldName);
                return attr.getValue();
            },
            getCurrentValue: function (fieldName) {
                var control = crmjs.attr.getControl(fieldName);
                return control.getValue();
            },
            setValue: function (fieldName, value) {
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
                        throw 'attr.setLookupValue (' + fieldName + ') - Exception: ' + ex.message;
                    } else {
                        throw ex;
                    }
                }
            },
            getDisabled: function (fieldName) {
                var control = crmjs.attr.getControl(fieldName);
                return control.getDisabled();
            },
            setDisabled: function (fieldName, isDisabled) {
                var control = crmjs.attr.getControl(fieldName);
                control.setDisabled(isDisabled);
            },
            getVisible: function (fieldName) {
                var control = crmjs.attr.getControl(fieldName);
                return control.getVisible();
            },
            setVisible: function (fieldName, isDisabled) {
                var control = crmjs.attr.getControl(fieldName);
                control.setVisible(isDisabled);
            },
            setRequired: function (fieldName, isRequired) {
                var attr = crmjs.attr.get(fieldName);
                if (isRequired) {
                    attr.setRequiredLevel('required')
                } else {
                    attr.setRequiredLevel('none');
                }
            },
            getLabel: function (fieldName) {
                var control = crmjs.attr.getControl(fieldName);
                return control.getLabel();
            },
            setLabel: function (fieldName, label) {
                var control = crmjs.attr.getControl(fieldName);
                control.setLabel(label);
            },
            addOnChange: function (fieldName, func, doFireNow) {
                var attr = crmjs.attr.get(fieldName).addOnChange(func);
                if (doFireNow) {
                    attr.fireOnChange();
                }
            }
        },
        grids: {
            refresh: function (gridName) {
                var control = crmjs.attr.getControl(gridName);
                control.refresh();
            },
            get: function (gridName) {
                var control = crmjs.attr.getControl(gridName);
                return control.getGrid();
            },
            getEntityName: function (gridName) {
                var control = crmjs.attr.getControl(gridName);
                return control.getEntityName();
            },
            addOnLoad: function (gridName, onLoadFunc) {
                var control = crmjs.attr.getControl(gridName);
                control.addOnLoad(onLoadFunc);
            }
        },
        form: {
            getLabel: function () {
                var form = xrmvar.Page.ui.formSelector.getCurrentItem();
                return form === null ? '' : form.getLabel();
            },
            getEntityId: function () {
                return xrmvar.Page.data.entity.getId();
            },
            getEntityName: function () {
                return xrmvar.Page.data.entity.getEntityName();
            },
            getFormType: function () {
                return xrmvar.Page.ui.getFormType();
            },
            addOnSave: function (onSaveFunc) {
                xrmvar.Page.data.entity.addOnSave(onSaveFunc);
            },
            removeOnSave: function (onSaveFunc) {
                xrmvar.Page.data.entity.removeOnSave(onSaveFunc);
            },
            close: function () {
                xrmvr.Page.ui.close();
            },
            refreshRibbon: function () {
                xrmvar.Page.ui.refreshRibbon();
            },
            quickForm: {
                get: function (formName) {
                    var form = xrmvar.Page.ui.quickForm.get(formName);
                    if (throwErrorOnNotFound && IsNullOrUndefined(form)) {
                        throw 'attributes.get - no quickview form found with name: ' + formName;
                    }
                    return form;
                },
                getWhenLoaded: function (formName) {
                    var form = xrmvar.form.quickForm.get(formName);
                    if (form.isLoaded()) {
                        return form;
                    }
                    window.setTimeout(xrmvar.forms.quickForm.get(formName), 100);
                }
            },
            tab: {
                get: function (tabName) {
                    var tab = xrmvar.Page.ui.tabs.get(tabName);
                    if (throwErrorOnNotFound && IsNullOrUndefined(tab)) {
                        throw 'form.getTab - no tab found with name: ' + tabName;
                    }
                    return tab;
                },
                isCollapsed: function (tabName) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.getDisplayState() === 'collapsed';
                },
                collapse: function (tabName) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.setDisplayState('collapsed');
                },
                expand: function (tabName) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.setDisplayState('expanded');
                },
                getLabel: function (tabName) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.getLabel();
                },
                setLabel: function (tabName, label) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.setLabel(label);
                },
                getVisible: function (tabName) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.getVisible();
                },
                setVisible: function (tabName, isVisible) {
                    var tab = crmjs.form.tab.get(tabName);
                    return tab.setVisible(isVisible);
                },
            },
            section: {
                get: function (sectionName) {
                    var tabs = xrmvar.Page.ui.tabs.getAll();
                    if (tabs === null || tabs.length < 1) {
                        if (throwErrorOnNotFound) {
                            throw 'form.getSection - no tabs found on form to use to find section: ' + sectionName;
                        }
                    }

                    var section = null;
                    for (var ctr = 0; ctr < tabs.length; ctr++) {
                        section = tabs[ctr].sections.getByName(sectionName);
                        if (section !== null) {
                            break;
                        }
                    }
                    if (throwErrorOnNotFound && IsNullOrUndefined(section)) {
                        throw 'form.getSection - no section found with name: ' + sectionName;
                    }
                    return section;
                },
                getLabel: function (sectionName) {
                    var section = crmjs.form.section.get(sectionName);
                    return section.getLabel();
                },
                setLabel: function (sectionName, label) {
                    var section = crmjs.form.section.get(sectionName);
                    return section.setLabel(label);
                },
                getVisible: function (sectionName) {
                    var section = crmjs.form.section.get(sectionName);
                    return section.getVisible();
                },
                setVisible: function (sectionName, isVisible) {
                    var section = crmjs.form.section.get(sectionName);
                    return section.setVisible(isVisible);
                },
            }
        },
        navItems: {
            get: function (navName) {
                var nav = xrmvar.Page.ui.navigation.items(navName);
                if (throwErrorOnNotFound && IsNullOrUndefined(nav)) {
                    throw 'navItems.get - no nav item found with name: ' + navName;
                }
                return nav;
            },
            setLabel: function (navName, label) {
                var navItem = crmjs.navItems.get(navName);
                navItem.setLabel(label);
            },
            getVisible: function (navName) {
                var navItem = crmjs.navItems.get(navName);
                navItem.getVisible();
            },
            setVisible: function (navName, isVisible) {
                var navItem = crmjs.navItems.get(navName);
                navItem.setVisible(isVisible);
            }
        },
        events: {
            refresh: function (doSave, successFunc, errorFunc) {
                xrmvar.Page.data.refresh(save).then(successFunc, errorFunc);
            },
            save: function (successFunc, errorFunc) {
                xrmvar.Page.data.save().then(successFunc, errorFunc);
            },
            saveAndClose: function () {
                xrmvar.Page.data.entity.save('saveandclose');
            },
            saveAndNew: function () {
                xrmvar.Page.data.entity.save('saveandnew');
            }
        },
        notificatons: {
            set: function (msg, level, id) {
                xrmvar.Page.ui.setFormNotification(msg, level, id);
            },
            clear: function (id) {
                xrmvar.Page.ui.clearFormNotification(id);
            },
            fieldSet: function (fieldName, msg, id) {
                var control = crmjs.attr.getControl(fieldName);
                control.setNotification(msg, id);
            },
            fieldClear: function (fieldName, id) {
                var control = crmjs.attr.getControl(fieldName);
                control.clearNotification(id);
            }
        },
        iframe: {
            getSrc: function (iFrameName) {
                var control = crmjs.attr.getControl(iFrameName);
                return control.getSrc();
            },
            setSrc: function (iFrameName, src) {
                var control = crmjs.attr.getControl(iFrameName);
                return control.setSrc(src);
            },
            get: function (iframeName) {
                var control = crmjs.attr.getControl(iFrameName);
                return control.getObject();
            }
        },
        debug: {
            log: function (msg) {
                if (typeof console === 'undefined' || typeof console.log === 'undefined') {
                    console = {};
                    console.log = function (msg) {
                        alert(msg);
                    };
                }
                console.log('debug: ' + msg);
            }
        }
    }
})();