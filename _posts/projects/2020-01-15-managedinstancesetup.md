---
layout: project
permalink: /:title/
category: projects

meta:
  keywords: "Machine Learning, Backend, Managed"

project:
  title: "Managed Instance Setup"
  type: "Infrastructure"
  url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-compute-instance"
  logo: "/assets/images/projects/managedinstancesetup/logo.jpg"
  tech: "Golang, Azure, Azure Batch, Linux"

agency:
  title: "Microsoft"
  url: "https://azure.microsoft.com/en-us/services/machine-learning/"
  year: "2020"

images:
  - image:
    url: "/assets/images/projects/managedinstancesetup/workspace.png"
    alt: "The AzureML workspace where users can create and manage ML services"
  - image:
    url: "/assets/images/projects/managedinstancesetup/compute-page.png"
    alt: "UI for creating a compute instance"
  - image:
    url: "/assets/images/projects/managedinstancesetup/secure-training-environment.png"
    alt: "Architectural diagram for compute instance within AzureML"

---
<p>
Hosttools 
- I migrated our existing compute set up to run as part of the Azure Batch job. Script is run in an environment where we don't have direct access to the customer's machine
- Unix systemd services
- Monitor mount operations. We give them a storage account with a fileshare and for a bug we didn't yet understand it was disconnecting. Work was to create a service that would remotely detect these errors and provide logging
Testing - writing mock tests, create a testing directory, make sure it has the correct structure</p>