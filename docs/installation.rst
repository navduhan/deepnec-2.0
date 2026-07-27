Installation Guide
==================

This guide describes how to install **deepNEC 2.0** and its dependencies.

System Requirements
-------------------

* **Operating System**: Linux, macOS, or Windows (WSL2 recommended for Windows users).
* **Python**: Python 3.9, 3.10, or 3.11.
* **RAM**: Minimum 8 GB (16 GB recommended for batch ESM-2 feature extraction).
* **Disk Space**: ~4 GB for model weights and dependencies.

Option A: Installation via uv (Recommended)
--------------------------------------------

`uv <https://github.com/astral-sh/uv>`_ is an extremely fast Python package manager. It automatically resolves dependencies and lockfiles via PEP 621.

.. code-block:: bash

   # 1. Clone the deepNEC 2.0 repository
   git clone https://github.com/navduhan/deepnec-2.0.git
   cd deepnec-2.0/tool/deepnec-2.0

   # 2. Create virtual environment and install in editable mode
   uv venv
   source .venv/bin/activate
   uv pip install -e .

Option B: Standard Installation via pip
---------------------------------------

You can also install deepNEC using standard ``pip``:

.. code-block:: bash

   cd deepnec-2.0/tool/deepnec-2.0
   pip install -e .

Option C: Conda Environment
---------------------------

If you prefer Conda or Mamba:

.. code-block:: bash

   conda env create -f environment.yml
   conda activate deepnec
   pip install -e .

Verifying Installation
----------------------

Verify your installation by running the version check command:

.. code-block:: bash

   deepnec --version
   # Output: DeepNEC 2.0.1

You can also run deepNEC using its versioned alias commands:

.. code-block:: bash

   deepnec2 --version
   deepnec2.0 --version
