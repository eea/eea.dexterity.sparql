# -*- coding: utf-8 -*-
import Acquisition
import zope
import z3c.form.browser.textarea
from z3c.form.interfaces import ITextAreaWidget, IFormLayer, IFieldWidget
from z3c.form.widget import FieldWidget
from zope.component.hooks import getSite
from zope.interface import implementer, implementer_only
from zope.schema.interfaces import IField


class IPreviewWidget(ITextAreaWidget):
    pass


@implementer_only(IPreviewWidget)
class PreviewWidget(z3c.form.browser.textarea.TextAreaWidget):

    klass = u'preview-widget'
    value = u''

    def update(self):
        super(z3c.form.browser.textarea.TextAreaWidget, self).update()
        z3c.form.browser.widget.addFieldClass(self)
        # We'll wrap context in the current site *if* it's not already
        # wrapped.  This allows the template to acquire tools with
        # ``context/portal_this`` if context is not wrapped already.
        # Any attempts to satisfy the Kupu template in a less idiotic
        # way failed:
        if getattr(self.form.context, 'aq_inner', None) is None:
            self.form.context = Acquisition.ImplicitAcquisitionWrapper(
                self.form.context, getSite())


@zope.component.adapter(IField, IFormLayer)
@implementer(IFieldWidget)
def PreviewFieldWidget(field, request):
    """IFieldWidget factory for WysiwygWidget."""
    return FieldWidget(field, PreviewWidget(request))