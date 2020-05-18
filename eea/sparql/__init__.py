""" Main product initializer
"""
from zope.i18nmessageid import MessageFactory

sparqlMessageFactory = MessageFactory('eea.dexterity.sparql')


def initialize(context):
    """Initializer called when used as a Zope 2 product.
    """
