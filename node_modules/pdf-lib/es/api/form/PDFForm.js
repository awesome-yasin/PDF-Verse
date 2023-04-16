import { __assign, __spreadArrays } from "tslib";
import PDFDocument from "../PDFDocument";
import PDFButton from "./PDFButton";
import PDFCheckBox from "./PDFCheckBox";
import PDFDropdown from "./PDFDropdown";
import PDFOptionList from "./PDFOptionList";
import PDFRadioGroup from "./PDFRadioGroup";
import PDFSignature from "./PDFSignature";
import PDFTextField from "./PDFTextField";
import { NoSuchFieldError, UnexpectedFieldTypeError, FieldAlreadyExistsError, InvalidFieldNamePartError, } from "../errors";
import PDFFont from "../PDFFont";
import { StandardFonts } from "../StandardFonts";
import { rotateInPlace } from "../operations";
import { drawObject, popGraphicsState, pushGraphicsState, translate, } from "../operators";
import { PDFAcroForm, PDFAcroCheckBox, PDFAcroComboBox, PDFAcroListBox, PDFAcroRadioButton, PDFAcroSignature, PDFAcroText, PDFAcroPushButton, PDFAcroNonTerminal, PDFDict, PDFRef, createPDFAcroFields, PDFName, } from "../../core";
import { assertIs, Cache, assertOrUndefined } from "../../utils";
/**
 * Represents the interactive form of a [[PDFDocument]].
 *
 * Interactive forms (sometimes called _AcroForms_) are collections of fields
 * designed to gather information from a user. A PDF document may contains any
 * number of fields that appear on various pages, all of which make up a single,
 * global interactive form spanning the entire document. This means that
 * instances of [[PDFDocument]] shall contain at most one [[PDFForm]].
 *
 * The fields of an interactive form are represented by [[PDFField]] instances.
 */
var PDFForm = /** @class */ (function () {
    function PDFForm(acroForm, doc) {
        var _this = this;
        this.embedDefaultFont = function () {
            return _this.doc.embedStandardFont(StandardFonts.Helvetica);
        };
        assertIs(acroForm, 'acroForm', [[PDFAcroForm, 'PDFAcroForm']]);
        assertIs(doc, 'doc', [[PDFDocument, 'PDFDocument']]);
        this.acroForm = acroForm;
        this.doc = doc;
        this.dirtyFields = new Set();
        this.defaultFontCache = Cache.populatedBy(this.embedDefaultFont);
    }
    /**
     * Returns `true` if this [[PDFForm]] has XFA data. Most PDFs with form
     * fields do not use XFA as it is not widely supported by PDF readers.
     *
     * > `pdf-lib` does not support creation, modification, or reading of XFA
     * > fields.
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * if (form.hasXFA()) console.log('PDF has XFA data')
     * ```
     * @returns Whether or not this form has XFA data.
     */
    PDFForm.prototype.hasXFA = function () {
        return this.acroForm.dict.has(PDFName.of('XFA'));
    };
    /**
     * Disconnect the XFA data from this [[PDFForm]] (if any exists). This will
     * force readers to fallback to standard fields if the [[PDFDocument]]
     * contains any. For example:
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * form.deleteXFA()
     * ```
     */
    PDFForm.prototype.deleteXFA = function () {
        this.acroForm.dict.delete(PDFName.of('XFA'));
    };
    /**
     * Get all fields contained in this [[PDFForm]]. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const fields = form.getFields()
     * fields.forEach(field => {
     *   const type = field.constructor.name
     *   const name = field.getName()
     *   console.log(`${type}: ${name}`)
     * })
     * ```
     * @returns An array of all fields in this form.
     */
    PDFForm.prototype.getFields = function () {
        var allFields = this.acroForm.getAllFields();
        var fields = [];
        for (var idx = 0, len = allFields.length; idx < len; idx++) {
            var _a = allFields[idx], acroField = _a[0], ref = _a[1];
            var field = convertToPDFField(acroField, ref, this.doc);
            if (field)
                fields.push(field);
        }
        return fields;
    };
    /**
     * Get the field in this [[PDFForm]] with the given name. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getFieldMaybe('Page1.Foo.Bar[0]')
     * if (field) console.log('Field exists!')
     * ```
     * @param name A fully qualified field name.
     * @returns The field with the specified name, if one exists.
     */
    PDFForm.prototype.getFieldMaybe = function (name) {
        assertIs(name, 'name', ['string']);
        var fields = this.getFields();
        for (var idx = 0, len = fields.length; idx < len; idx++) {
            var field = fields[idx];
            if (field.getName() === name)
                return field;
        }
        return undefined;
    };
    /**
     * Get the field in this [[PDFForm]] with the given name. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('Page1.Foo.Bar[0]')
     * ```
     * If no field exists with the provided name, an error will be thrown.
     * @param name A fully qualified field name.
     * @returns The field with the specified name.
     */
    PDFForm.prototype.getField = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getFieldMaybe(name);
        if (field)
            return field;
        throw new NoSuchFieldError(name);
    };
    /**
     * Get the button field in this [[PDFForm]] with the given name. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const button = form.getButton('Page1.Foo.Button[0]')
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a button.
     * @param name A fully qualified button name.
     * @returns The button with the specified name.
     */
    PDFForm.prototype.getButton = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFButton)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFButton, field);
    };
    /**
     * Get the check box field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const checkBox = form.getCheckBox('Page1.Foo.CheckBox[0]')
     * checkBox.check()
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a check box.
     * @param name A fully qualified check box name.
     * @returns The check box with the specified name.
     */
    PDFForm.prototype.getCheckBox = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFCheckBox)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFCheckBox, field);
    };
    /**
     * Get the dropdown field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const dropdown = form.getDropdown('Page1.Foo.Dropdown[0]')
     * const options = dropdown.getOptions()
     * dropdown.select(options[0])
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a dropdown.
     * @param name A fully qualified dropdown name.
     * @returns The dropdown with the specified name.
     */
    PDFForm.prototype.getDropdown = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFDropdown)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFDropdown, field);
    };
    /**
     * Get the option list field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const optionList = form.getOptionList('Page1.Foo.OptionList[0]')
     * const options = optionList.getOptions()
     * optionList.select(options[0])
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not an option list.
     * @param name A fully qualified option list name.
     * @returns The option list with the specified name.
     */
    PDFForm.prototype.getOptionList = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFOptionList)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFOptionList, field);
    };
    /**
     * Get the radio group field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const radioGroup = form.getRadioGroup('Page1.Foo.RadioGroup[0]')
     * const options = radioGroup.getOptions()
     * radioGroup.select(options[0])
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a radio group.
     * @param name A fully qualified radio group name.
     * @returns The radio group with the specified name.
     */
    PDFForm.prototype.getRadioGroup = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFRadioGroup)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFRadioGroup, field);
    };
    /**
     * Get the signature field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const signature = form.getSignature('Page1.Foo.Signature[0]')
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a signature.
     * @param name A fully qualified signature name.
     * @returns The signature with the specified name.
     */
    PDFForm.prototype.getSignature = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFSignature)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFSignature, field);
    };
    /**
     * Get the text field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const textField = form.getTextField('Page1.Foo.TextField[0]')
     * textField.setText('Are you designed to act or to be acted upon?')
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a text field.
     * @param name A fully qualified text field name.
     * @returns The text field with the specified name.
     */
    PDFForm.prototype.getTextField = function (name) {
        assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFTextField)
            return field;
        throw new UnexpectedFieldTypeError(name, PDFTextField, field);
    };
    /**
     * Create a new button field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const button = form.createButton('cool.new.button')
     *
     * button.addToPage('Do Stuff', font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new button.
     * @returns The new button field.
     */
    PDFForm.prototype.createButton = function (name) {
        assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var button = PDFAcroPushButton.create(this.doc.context);
        button.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [button, button.ref], nameParts.terminal);
        return PDFButton.of(button, button.ref, this.doc);
    };
    /**
     * Create a new check box field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const checkBox = form.createCheckBox('cool.new.checkBox')
     *
     * checkBox.addToPage(page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new check box.
     * @returns The new check box field.
     */
    PDFForm.prototype.createCheckBox = function (name) {
        assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var checkBox = PDFAcroCheckBox.create(this.doc.context);
        checkBox.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [checkBox, checkBox.ref], nameParts.terminal);
        return PDFCheckBox.of(checkBox, checkBox.ref, this.doc);
    };
    /**
     * Create a new dropdown field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const dropdown = form.createDropdown('cool.new.dropdown')
     *
     * dropdown.addToPage(font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new dropdown.
     * @returns The new dropdown field.
     */
    PDFForm.prototype.createDropdown = function (name) {
        assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var comboBox = PDFAcroComboBox.create(this.doc.context);
        comboBox.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [comboBox, comboBox.ref], nameParts.terminal);
        return PDFDropdown.of(comboBox, comboBox.ref, this.doc);
    };
    /**
     * Create a new option list field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const optionList = form.createOptionList('cool.new.optionList')
     *
     * optionList.addToPage(font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new option list.
     * @returns The new option list field.
     */
    PDFForm.prototype.createOptionList = function (name) {
        assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var listBox = PDFAcroListBox.create(this.doc.context);
        listBox.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [listBox, listBox.ref], nameParts.terminal);
        return PDFOptionList.of(listBox, listBox.ref, this.doc);
    };
    /**
     * Create a new radio group field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const radioGroup = form.createRadioGroup('cool.new.radioGroup')
     *
     * radioGroup.addOptionToPage('is-dog', page, { y: 0 })
     * radioGroup.addOptionToPage('is-cat', page, { y: 75 })
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new radio group.
     * @returns The new radio group field.
     */
    PDFForm.prototype.createRadioGroup = function (name) {
        assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var radioButton = PDFAcroRadioButton.create(this.doc.context);
        radioButton.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [radioButton, radioButton.ref], nameParts.terminal);
        return PDFRadioGroup.of(radioButton, radioButton.ref, this.doc);
    };
    /**
     * Create a new text field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const textField = form.createTextField('cool.new.textField')
     *
     * textField.addToPage(font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new radio group.
     * @returns The new radio group field.
     */
    PDFForm.prototype.createTextField = function (name) {
        assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var text = PDFAcroText.create(this.doc.context);
        text.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [text, text.ref], nameParts.terminal);
        return PDFTextField.of(text, text.ref, this.doc);
    };
    /**
     * Flatten all fields in this [[PDFForm]].
     *
     * Flattening a form field will take the current appearance for each of that
     * field's widgets and make them part of their page's content stream. All form
     * fields and annotations associated are then removed. Note that once a form
     * has been flattened its fields can no longer be accessed or edited.
     *
     * This operation is often used after filling form fields to ensure a
     * consistent appearance across different PDF readers and/or printers.
     * Another common use case is to copy a template document with form fields
     * into another document. In this scenario you would load the template
     * document, fill its fields, flatten it, and then copy its pages into the
     * recipient document - the filled fields will be copied over.
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm();
     * form.flatten();
     * ```
     */
    PDFForm.prototype.flatten = function (options) {
        if (options === void 0) { options = { updateFieldAppearances: true }; }
        if (options.updateFieldAppearances) {
            this.updateFieldAppearances();
        }
        var fields = this.getFields();
        for (var i = 0, lenFields = fields.length; i < lenFields; i++) {
            var field = fields[i];
            var widgets = field.acroField.getWidgets();
            for (var j = 0, lenWidgets = widgets.length; j < lenWidgets; j++) {
                var widget = widgets[j];
                var page = this.findWidgetPage(widget);
                var widgetRef = this.findWidgetAppearanceRef(field, widget);
                var xObjectKey = page.node.newXObject('FlatWidget', widgetRef);
                var rectangle = widget.getRectangle();
                var operators = __spreadArrays([
                    pushGraphicsState(),
                    translate(rectangle.x, rectangle.y)
                ], rotateInPlace(__assign(__assign({}, rectangle), { rotation: 0 })), [
                    drawObject(xObjectKey),
                    popGraphicsState(),
                ]).filter(Boolean);
                page.pushOperators.apply(page, operators);
            }
            this.removeField(field);
        }
    };
    /**
     * Remove a field from this [[PDFForm]].
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm();
     * const ageField = form.getFields().find(x => x.getName() === 'Age');
     * form.removeField(ageField);
     * ```
     */
    PDFForm.prototype.removeField = function (field) {
        var widgets = field.acroField.getWidgets();
        var pages = new Set();
        for (var i = 0, len = widgets.length; i < len; i++) {
            var widget = widgets[i];
            var widgetRef = this.findWidgetAppearanceRef(field, widget);
            var page = this.findWidgetPage(widget);
            pages.add(page);
            page.node.removeAnnot(widgetRef);
        }
        pages.forEach(function (page) { return page.node.removeAnnot(field.ref); });
        this.acroForm.removeField(field.acroField);
        var fieldKids = field.acroField.normalizedEntries().Kids;
        var kidsCount = fieldKids.size();
        for (var childIndex = 0; childIndex < kidsCount; childIndex++) {
            var child = fieldKids.get(childIndex);
            if (child instanceof PDFRef) {
                this.doc.context.delete(child);
            }
        }
        this.doc.context.delete(field.ref);
    };
    /**
     * Update the appearance streams for all widgets of all fields in this
     * [[PDFForm]]. Appearance streams will only be created for a widget if it
     * does not have any existing appearance streams, or the field's value has
     * changed (e.g. by calling [[PDFTextField.setText]] or
     * [[PDFDropdown.select]]).
     *
     * For example:
     * ```js
     * const courier = await pdfDoc.embedFont(StandardFonts.Courier)
     * const form = pdfDoc.getForm()
     * form.updateFieldAppearances(courier)
     * ```
     *
     * **IMPORTANT:** The default value for the `font` parameter is
     * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
     * that encoding errors will be thrown if any fields contain text with
     * characters outside the WinAnsi character set (the latin alphabet).
     *
     * Embedding a custom font and passing that as the `font`
     * parameter allows you to generate appearance streams with non WinAnsi
     * characters (assuming your custom font supports them).
     *
     * > **NOTE:** The [[PDFDocument.save]] method will call this method to
     * > update appearances automatically if a form was accessed via the
     * > [[PDFDocument.getForm]] method prior to saving.
     *
     * @param font Optionally, the font to use when creating new appearances.
     */
    PDFForm.prototype.updateFieldAppearances = function (font) {
        assertOrUndefined(font, 'font', [[PDFFont, 'PDFFont']]);
        font = font !== null && font !== void 0 ? font : this.getDefaultFont();
        var fields = this.getFields();
        for (var idx = 0, len = fields.length; idx < len; idx++) {
            var field = fields[idx];
            if (field.needsAppearancesUpdate()) {
                field.defaultUpdateAppearances(font);
            }
        }
    };
    /**
     * Mark a field as dirty. This will cause its appearance streams to be
     * updated by [[PDFForm.updateFieldAppearances]].
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('foo.bar')
     * form.markFieldAsDirty(field.ref)
     * ```
     * @param fieldRef The reference to the field that should be marked.
     */
    PDFForm.prototype.markFieldAsDirty = function (fieldRef) {
        assertOrUndefined(fieldRef, 'fieldRef', [[PDFRef, 'PDFRef']]);
        this.dirtyFields.add(fieldRef);
    };
    /**
     * Mark a field as dirty. This will cause its appearance streams to not be
     * updated by [[PDFForm.updateFieldAppearances]].
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('foo.bar')
     * form.markFieldAsClean(field.ref)
     * ```
     * @param fieldRef The reference to the field that should be marked.
     */
    PDFForm.prototype.markFieldAsClean = function (fieldRef) {
        assertOrUndefined(fieldRef, 'fieldRef', [[PDFRef, 'PDFRef']]);
        this.dirtyFields.delete(fieldRef);
    };
    /**
     * Returns `true` is the specified field has been marked as dirty.
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('foo.bar')
     * if (form.fieldIsDirty(field.ref)) console.log('Field is dirty')
     * ```
     * @param fieldRef The reference to the field that should be checked.
     * @returns Whether or not the specified field is dirty.
     */
    PDFForm.prototype.fieldIsDirty = function (fieldRef) {
        assertOrUndefined(fieldRef, 'fieldRef', [[PDFRef, 'PDFRef']]);
        return this.dirtyFields.has(fieldRef);
    };
    PDFForm.prototype.getDefaultFont = function () {
        return this.defaultFontCache.access();
    };
    PDFForm.prototype.findWidgetPage = function (widget) {
        var pageRef = widget.P();
        var page = this.doc.getPages().find(function (x) { return x.ref === pageRef; });
        if (page === undefined) {
            var widgetRef = this.doc.context.getObjectRef(widget.dict);
            if (widgetRef === undefined) {
                throw new Error('Could not find PDFRef for PDFObject');
            }
            page = this.doc.findPageForAnnotationRef(widgetRef);
            if (page === undefined) {
                throw new Error("Could not find page for PDFRef " + widgetRef);
            }
        }
        return page;
    };
    PDFForm.prototype.findWidgetAppearanceRef = function (field, widget) {
        var _a;
        var refOrDict = widget.getNormalAppearance();
        if (refOrDict instanceof PDFDict &&
            (field instanceof PDFCheckBox || field instanceof PDFRadioGroup)) {
            var value = field.acroField.getValue();
            var ref = (_a = refOrDict.get(value)) !== null && _a !== void 0 ? _a : refOrDict.get(PDFName.of('Off'));
            if (ref instanceof PDFRef) {
                refOrDict = ref;
            }
        }
        if (!(refOrDict instanceof PDFRef)) {
            var name_1 = field.getName();
            throw new Error("Failed to extract appearance ref for: " + name_1);
        }
        return refOrDict;
    };
    PDFForm.prototype.findOrCreateNonTerminals = function (partialNames) {
        var nonTerminal = [
            this.acroForm,
        ];
        for (var idx = 0, len = partialNames.length; idx < len; idx++) {
            var namePart = partialNames[idx];
            if (!namePart)
                throw new InvalidFieldNamePartError(namePart);
            var parent_1 = nonTerminal[0], parentRef = nonTerminal[1];
            var res = this.findNonTerminal(namePart, parent_1);
            if (res) {
                nonTerminal = res;
            }
            else {
                var node = PDFAcroNonTerminal.create(this.doc.context);
                node.setPartialName(namePart);
                node.setParent(parentRef);
                var nodeRef = this.doc.context.register(node.dict);
                parent_1.addField(nodeRef);
                nonTerminal = [node, nodeRef];
            }
        }
        return nonTerminal;
    };
    PDFForm.prototype.findNonTerminal = function (partialName, parent) {
        var fields = parent instanceof PDFAcroForm
            ? this.acroForm.getFields()
            : createPDFAcroFields(parent.Kids());
        for (var idx = 0, len = fields.length; idx < len; idx++) {
            var _a = fields[idx], field = _a[0], ref = _a[1];
            if (field.getPartialName() === partialName) {
                if (field instanceof PDFAcroNonTerminal)
                    return [field, ref];
                throw new FieldAlreadyExistsError(partialName);
            }
        }
        return undefined;
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.getForm]] method, which will create an
     * > instance of [[PDFForm]] for you.
     *
     * Create an instance of [[PDFForm]] from an existing acroForm and embedder
     *
     * @param acroForm The underlying `PDFAcroForm` for this form.
     * @param doc The document to which the form will belong.
     */
    PDFForm.of = function (acroForm, doc) {
        return new PDFForm(acroForm, doc);
    };
    return PDFForm;
}());
export default PDFForm;
var convertToPDFField = function (field, ref, doc) {
    if (field instanceof PDFAcroPushButton)
        return PDFButton.of(field, ref, doc);
    if (field instanceof PDFAcroCheckBox)
        return PDFCheckBox.of(field, ref, doc);
    if (field instanceof PDFAcroComboBox)
        return PDFDropdown.of(field, ref, doc);
    if (field instanceof PDFAcroListBox)
        return PDFOptionList.of(field, ref, doc);
    if (field instanceof PDFAcroText)
        return PDFTextField.of(field, ref, doc);
    if (field instanceof PDFAcroRadioButton) {
        return PDFRadioGroup.of(field, ref, doc);
    }
    if (field instanceof PDFAcroSignature) {
        return PDFSignature.of(field, ref, doc);
    }
    return undefined;
};
var splitFieldName = function (fullyQualifiedName) {
    if (fullyQualifiedName.length === 0) {
        throw new Error('PDF field names must not be empty strings');
    }
    var parts = fullyQualifiedName.split('.');
    for (var idx = 0, len = parts.length; idx < len; idx++) {
        if (parts[idx] === '') {
            throw new Error("Periods in PDF field names must be separated by at least one character: \"" + fullyQualifiedName + "\"");
        }
    }
    if (parts.length === 1)
        return { nonTerminal: [], terminal: parts[0] };
    return {
        nonTerminal: parts.slice(0, parts.length - 1),
        terminal: parts[parts.length - 1],
    };
};
var addFieldToParent = function (_a, _b, partialName) {
    var parent = _a[0], parentRef = _a[1];
    var field = _b[0], fieldRef = _b[1];
    var entries = parent.normalizedEntries();
    var fields = createPDFAcroFields('Kids' in entries ? entries.Kids : entries.Fields);
    for (var idx = 0, len = fields.length; idx < len; idx++) {
        if (fields[idx][0].getPartialName() === partialName) {
            throw new FieldAlreadyExistsError(partialName);
        }
    }
    parent.addField(fieldRef);
    field.setParent(parentRef);
};
//# sourceMappingURL=PDFForm.js.map