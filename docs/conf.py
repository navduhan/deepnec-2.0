# Author: Naveen Duhan
# Configuration file for the Sphinx documentation builder.
# deepNEC 2.0 Read the Docs Configuration

import os
import sys
from datetime import datetime

# Add deepNEC package directory to sys.path
sys.path.insert(0, os.path.abspath('..'))

import deepNEC

project = 'deepNEC'
copyright = f'{datetime.now().year}, KAABiL Lab (Kaundal Artificial Intelligence & Advanced Bioinformatics Lab)'
author = 'Naveen Duhan, Rakesh Kaundal'
version = deepNEC.__version__
release = deepNEC.__version__

# General configuration
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
    'sphinx.ext.intersphinx',
    'sphinx.ext.mathjax',
    'myst_parser',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

master_doc = 'index'

# HTML Output Options
html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    'navigation_depth': 4,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'includehidden': True,
    'titles_only': False,
    'style_nav_header_background': '#0f2439',
}

html_static_path = ['_static']

# Intersphinx mapping
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
    'numpy': ('https://numpy.org/doc/stable/', None),
    'pandas': ('https://pandas.pydata.org/pandas-docs/stable/', None),
}
