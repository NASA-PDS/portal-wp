# Traditional CMS vs Headless CMS

## Background

The Planetary Data System (PDS) is undergoing a Web Modernization effort to address the needs of multiple user groups and to address guidelines set forth in the [21st Century Integrated Digital Experience Act](https://digital.gov/resources/21st-century-integrated-digital-experience-act/) which applies to all government funded, publicly accessible websites. 

One of the technical solutions needed by the PDS to achieve this goal is the implementation of a Content Management System (CMS). There are two major types of CMS offerings, a Traditional CMS or Headless CMS. Each offering a unique set of capabilities to empower content publishers with the design and technical features they would need to create an engaging user experience  of the website.

## PDS CMS Selections

### Type: <span style="color:green; font-weight:800">_Headless CMS_</span>
### CMS: <span style="color:green; font-weight:800">_WordPress_</span>

## Selection Rationale

Traditional and Headless CMS solutions provide similar capabilities, the benefits afforded by a Headless CMS align closely with the needs of the PDS as its infrastructure moves into a distributed set of services in the Cloud.

- Separation of concerns — Decoupling the presentation layer and the content management layer provides greater flexibility, scalability, and extensibility.
  - With each layer being decoupled, limitations typically imposed by monolithic traditional CMSes aren't blockers to innovating new user experiences.
- Increased Creativity — Adopting the paradigm of disseminating information through an Application Programming Interface (API) allows content curators to distribute content across multiple platforms. This will provide benefits in the development and curation of PDS tools and applications.
- Improved Efficiency
  - Enhanced load times and website performance — A traditional content request lifecycle is replaced with the presentation layer accessing content through APIs. This reduces the time needed by the presentation layer to render and rerender content as the user interacts with the site, thereby improving its performance.
  - The aforementioned rationale also improves the user experience. The presentation layer can provide realtime insights about the state of the system during user interaction when performing various tasks (e.g. searching, form validation/submission, site/service health checks).
  - Each layer's technology stack can be scaled independently, allowing for tine tuning of individual services that keep infrastrucutre costs to a minimum.
  - Content updates are managed through a set of templates incorporating a predfined set of web components, thus streamlining content updates and reducing the potential of introducing errors at the presentation layer.
- Enhanced Security
  - Lower attack surface area — Traditional CMSs have a larger attack surface due to their monolithic structure than a headless CMS, where the separated presentation and content management layers reduces exposure an attacker may exploit.
- WordPress CMS was selected for the PDS because it aligns with NASA's decision to implement a WordPress solution to manage NASA's global web presence. In doing so, it provides the PDS an opportunity to build upon NASA's Web Modernization efforts and provide a consistent, unified experience for PDS users.

## CMS Type Feature Comparison

||Traditional CMS|Headless CMS|
|--|--|--|
|Architecture|Monolithic|Modular|
|Setup|Usually easy to setup as there is a single technology stack|Requires additional development and integration|
|Scalability|Difficult to efficiently scale because it acts as a single unit|Modularity promotes scalability|
|Plugins|Can extend functionality, but has the potential of bringing the entire system down if not built and maintened well.|Plugins for each respective layer are simpler to integrate and test because each layer acts independently|
|Security|More difficult to secure because it acts as a single unit|The modularity allows for enhanced security measures to reduce exposure footprint to would be attacker|

## CMS Platforms

Within the context of how NASA and JPL operates when it comes to funding, contracts, and IT support, here is a candidate list of CMS Platforms

|Name|Type|Open Source?|Cost|Backend Language Support|
|--|--|--|--|--|
|[WordPress](https://wordpress.org/)|Hybrid|Yes|Free|PHP|
|[Strapi](https://strapi.io/)|Headless|Yes|Free|Node.js|
|[Wagtail](https://wagtail.org/)|Hybrid|Yes|Free|Python|
|[django CMS](https://www.django-cms.org/en/)|Hybrid|Yes|Free|Python|
|[Drupal](https://www.drupal.org/)|Hybrid|Yes|Free|PHP|
|[Brightspot](https://www.brightspot.com/)|Hybrid|Yes|Paid|Java|
|[Joomla](https://www.joomla.org/)|Hybrid|Yes|Free|PHP|
|[Umbraco](https://umbraco.com/)|Traditional (Umbraco CMS)<br />Headless (Umbraco HeartCore)|Yes|Free|.NET|

A _Hybrid_ CMS indicates that it is built to works as a traditional CMS, but provides an API layer so it can also be used as a headless CMS.

## References
1. https://www.storyblok.com/mp/headless-vs-traditional-ecommerce-cms
2. https://medium.com/tribalscale/headless-vs-traditional-cms-which-is-better-3388bd6311b1
3. https://www.linkedin.com/advice/0/what-key-differences-between-headless
4. https://www.contentstack.com/cms-guides/headless-cms-vs-traditional-cms
5. https://www.sanity.io/headless-cms/headless-vs-traditional-cms
6. https://www.udig.com/digging-in/traditional-cms-vs-headless-cms/
7. https://strapi.io/blog/traditional-vs-headless-cms-a-comparison
8. https://www.searchenginejournal.com/traditional-vs-headless-cms/464252/
9. https://ultracommerce.co/blog/headless-cms-vs-traditional-cms/
