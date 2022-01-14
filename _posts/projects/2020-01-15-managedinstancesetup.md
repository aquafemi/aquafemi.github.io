---
layout: project
permalink: /:title/
category: projects
mermaid: mermaid/2020-01-15-managed-instance-setup-mermaid.html

meta:
  keywords: "Machine Learning Infrastructure, Backend, Managed Instance, Telemetry"

project:
  title: "Managed Instance Setup"
  type: "Infrastructure"
  url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-compute-instance"
  logo: "/assets/images/projects/managedinstancesetup/logo.jpg"
  tech: "Golang, Azure Batch, Linux"

agency:
  title: "Microsoft"
  url: "https://azure.microsoft.com/en-us/services/machine-learning/"
  year: "2020"

images:
  - image:
    url: "/assets/images/projects/workspace.png"
    alt: "The AzureML workspace where users can create and manage ML services"
  - image:
    url: "/assets/images/projects/compute-page.png"
    alt: "UI for creating a compute instance"
  - image:
    url: "/assets/images/projects/secure-training-environment.png"
    alt: "Architectural diagram for compute instance within AzureML"

---

<p class="text">Migrated our existing compute setup to job based execution in a remote environment</p>
<br />
<p class="text">Extended setup process with a microservice framework that leveraged Linux systemd</p>
<br />
<p class="text">Added telemetry to automatically publish errors to an analytics server</p>