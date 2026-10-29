---
title: ODE4EC-AMS Technology
description: The open source EDA tools, design automation and PDKs that ODE4EC-AMS improves for analogue, mixed-signal and RF design.
---

# Technology

ODE4EC-AMS improves the analogue, mixed-signal and RF design flow from simulation to layout. All tool work goes into existing open source projects, so the community can use the results directly.

## Tools we improve

| Tool | What we add | Partners | Code |
|------|-------------|----------|------|
| [ngspice](https://ngspice.sourceforge.io) | Large-signal transient noise, stronger mixed-signal simulation, interfaces to Verilog-A and HDL simulators | UDE | [SourceForge](https://sourceforge.net/projects/ngspice/) |
| [OpenVAF](https://github.com/arpadbuermen/OpenVAF) | Transient noise for Verilog-A models, conversion of common SPICE device models to Verilog-A | UL | [GitHub](https://github.com/arpadbuermen/OpenVAF) |
| [KLayout-PEX](https://iic-jku.github.io/klayout-pex-website/) | Parasitic extraction with several engines, from fast estimates to high accuracy | JKU, SAL | [GitHub](https://github.com/iic-jku/klayout-pex) |
| FasterCap and FRW | 2D, 2.5D and 3D capacitance field-solver back-ends for KLayout-PEX | UTH | [FasterCap](https://github.com/martinjankoehler/FasterCap) |
| [Elmer FEM](https://www.elmerfem.org) | Electromagnetic and S-parameter simulation for IC layouts, linked to KLayout through KQCircuits | CSC, IQM | [Elmer](https://github.com/ElmerCSC/elmerfem), [KQCircuits](https://github.com/iqm-finland/KQCircuits) |
| [Coriolis](https://github.com/lip6/coriolis) | Procedural placement and routing for analogue circuits | Sorbonne Université | [GitHub](https://github.com/lip6/coriolis) |
| [Intelligent IP](https://www.intelligent-ip.org/) | Template-based layout and schematic automation | Fraunhofer IIS | |

## Analogue design automation

Analogue layout is still largely drawn by hand. The project develops **MOSAIC**, a modular and extensible framework for analogue design generation. It brings together circuit generators, layout generators and automated sizing, including machine-learning-based optimisation, from transistor level up to system level. Its core is the [MOSAIC Orchestrator](https://mosaic-orchestrator.readthedocs.io/en/latest/), a Python library for building analogue generators contributed by Infineon.

Fraunhofer IIS brings in the template-based layout method of its [Intelligent IP](https://www.intelligent-ip.org/) tool. It plans to release the layout generation API as open source and connect it to MOSAIC.

Industrial partners bring real design cases, so that the framework is shaped by what product teams need.

## PDKs and silicon

The tools are validated on mature technologies, starting with IHP's open source [SG13G2 PDK](https://github.com/IHP-GmbH/IHP-Open-PDK) (130 nm SiGe BiCMOS, [documentation](https://ihp-open-pdk-docs.readthedocs.io/en/latest/)) and including flexible integrated circuits from [Pragmatic Semiconductor](https://www.pragmaticsemi.com). IHP is also adding SG13G2Cu, a variant with a copper back-end from X-FAB, to the open source PDK.

Industrial and research partners design analogue, mixed-signal and RF IP blocks with the new flow. The designs are fabricated in multi-project wafer (MPW) runs and measured, and the results feed back into tool and PDK development.

::: info Open source licences
Tools, generators and IP developed in the project are released under OSI-approved open source licences. Whether a PDK can be fully open depends on the foundry; the project works towards open PDKs or, where that is not possible, PDKs that work with open source tools.
:::
