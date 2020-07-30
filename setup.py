""" EEA Dexterity Sparql Installer
"""
import os

from setuptools import find_packages, setup

NAME = 'eea.dexterity.sparql'
PATH = NAME.split('.') + ['version.txt']
VERSION = open(os.path.join(*PATH)).read().strip()

setup(name=NAME,
      version=VERSION,
      description="Wrapper for Products.ZSPARQLMethod",
      long_description_content_type='text/x-rst',
      long_description=open("README.rst").read() + "\n" +
      open(os.path.join("docs", "HISTORY.txt")).read(),
      # https://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
          "Framework :: Plone",
          "Framework :: Plone :: 5.2",
          "Framework :: Zope",
          "Framework :: Zope :: 4",
          "Programming Language :: Python",
          "Programming Language :: Python :: 3.7",
          "Topic :: Software Development :: Libraries :: Python Modules",
          "License :: OSI Approved :: GNU General Public License (GPL)",
      ],
      keywords='EEA Add-ons Plone Zope',
      author='European Environment Agency: IDM2 A-Team',
      author_email='eea-edw-a-team-alerts@googlegroups.com',
      download_url="https://pypi.python.org/pypi/eea.dexterity.sparql",
      url='https://github.com/eea/eea.dexterity.sparql',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['eea'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'pytz',
          'setuptools',
          'Products.ZSPARQLMethod',
          'collective.z3cform.datagridfield>=1.5.3',
          'collective.js.jqueryui>=2.1.6',
          'plone.api',
          'six',
      ],
      extras_require={
          'test': [
              'plone.app.testing',
              'plone.restapi',
          ],
      },
      entry_points="""
      [z3c.autoinclude.plugin]
      target = plone
      """
      )
