---
layout: project
permalink: /:title/
category: projects

meta:
  keywords: "Telemetry, Pipelines, Power BI, Documentation"

project:
  title: "Automated Telemetry Pipeline"
  type: "Telemetry"
  url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-compute-instance"
  logo: "/assets/images/projects/automatedtelemetrypipeline/logo.png"
  tech: "Kusto, YAML, Azure, Linux"

agency:
  title: "Microsoft"
  url: "https://azure.microsoft.com/en-us/services/machine-learning/"
  year: "2020"

images:
  - image:
    url: "/assets/images/projects/managedinstancesetup/workspace.png"
    alt: "Red Pineapple website on a desktop device"
  - image:
    url: "/assets/images/projects/managedinstancesetup/compute-page.png"
    alt: "Red Pineapple website on tablet, mobile and desktop"
  - image:
    url: "/assets/images/projects/managedinstancesetup/secure-training-environment.png"
    alt: "Red Pineapple website on tablet, mobile and desktop"

---
<p>
Telemetry 
- Started off fixing telemetry issues. It was hard to filter through all the logs being sent to app insights
- Eventually created a functional way of getting logs using Kusto's user defined functions
- Improved it again to work end to end and provide a framework for rest of team to contribute.
- End to end. When a feature was launched with monitoring, new dimensions would automatically be brought into the logs. Repository of queries supported bringing in the data. It updated the defined queries in a Azure Data Explorer (Data Analytics platform) cluster and triggered automatic refreshes for our livesite and data visualizations</p>