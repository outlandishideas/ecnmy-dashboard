# Local Cost of Living Dashboard

A 3-Week Project for Economy, a charity with a "vision is of a flourishing and sustainable society in which there is diverse and inclusive public conversation about the economy, and economics is a tool everybody can use to make confident personal choices; articulate their needs, values and priorities; take action to shape the economy and participate in democracy." [Economy website](https://www.ecnmy.org/).

## Project Description

With a week of design and two weeks of build, we put together a website that enables the key user journey: "As a journalist who is not a specialist in economics, I'd like a way to easily access and understand data relevant to the stories I am telling so that my audience find my reporting relevant, trustworthy and helps them engage with the economy". It does so by entering data from several datasets into a database, in a way that standardises its format (up to a poitn). This step means that the data can be presented consistently in the website: on cards with key statistics and with a range of data visualisations that make it easier to interpret the data than working through large tables of unfiltered data. As well as following links to the full datasets, the user can download the specific data used to generate the visualisation. 

## Repositories

With subsequent development being done by Outlandish, [this repo](https://github.com/outlandishideas/ecnmy-dashboard) was forked from [the Founders & Coders one](https://github.com/fac24/ecnmy). However we have "detached" the fork to provide a smoother experience in terms of pull request defaults etc., since we don't expect new code to be merged back to the original demo repo.

## Deployment and CI

* Since Sep '22 Outlandish dev, the Staging environment (the only hosted/internet accessible one)
  is on ECS and the database is Outlandish's shared RDS Postgres. This means no more artificial
  database access limits.
* We use CircleCI to deploy: `develop` automatically deploys to Staging.
* Lint runs on every push in CI.
* Tests don't run in CI for now because only e2e's are written and they need the app running in
  another thread, which is time consuming to set up with automation.
* See [.circleci/config.yml](.circleci/config.yml) for configuration.

## Sanity Studio

We use [Sanity](https://www.sanity.io/) to provide a quick, free, lightweight headless CMS with a hosted editing
interface we don't have to deploy ourselves.

The whole `studio/` file is `.dockerignore`'d so should not appear in built runtime containers.

To run the studio locally, you should be in the team in `.env.docker.local.example`. You'll need to add your own
API key for the main app to load content.

You can natively (no Docker for now) run Studio on a custom port that is CORS-allowed (I was already using 3333),
from the project root directory, with:

  * `npm run sanity-local`

The hosted Studio is live here. You can redeploy it with:

  * `npm run sanity-deploy`

## Running Locally

### With Docker

* `cp .env.docker.local.example .env.docker.local`
* [Get a DataWrappper token](https://developer.datawrapper.de/docs/getting-started)
  choosing
    * chart read + write access,
    * theme read access and
    * visualization read access
* Populate `.env.docker.local`'s `DATAWRAPPER_API_KEY` with that token
* `docker-compose run --rm app ./scripts/populate_db_docker_local`
* `docker-compose up -d app`
* App is running at [localhost:30200](http://localhost:30200)

You can also `docker-compose up -d adminer` to use Adminer on [localhost:30201](http://localhost:30201).

### With native database etc.

This requires a compatible version of Postgres (e.g. 12.x). If you have Docker, it's
probably less work to use Docker.

- clone the repository https://github.com/fac24/ecnmy.git
- cd into the repo ``cd ecnmy``
- run ``npm install`` to install the dependencies
- run ``./scripts/create_db`` to create a local database, also creates a ``.env.development.local`` file with your database url
- run ``./scripts/populate_db`` to populate the local database with your data
- Create a datawrapper account to get an API Access Token
(https://developer.datawrapper.de/docs/getting-started) – see Docker info above for permissions needed.
- Add this token to the ``.env.development.local`` with the name ``DATAWRAPPER_API_KEY='{yourApiAccessToken}'``
- To run the server run ``npm run dev``

## Running in deployment

- The deployed site will need the same API Access Token as an environment variable
- It will also need a database url. It is probably wise not to use your local url here as this will be a live site. We have used elephantSQL for ours and will hand that url over, this will need to be saved as ``DATABASE_URL='{YOUR DATABASE URL}'``
- To easily populate the deployed database, in your repositories ``.env.development.local`` file create a variable ``DEPLOY_DB_URL={YOUR DEPLOYED DATABASE URL}`` then run ``./scripts/populate_db -d``

## API

We have 3 POST api endpoints

- deployedURL/api/dataset-by-indicator
    - This route is a POST request to access the database from the client side
    - It takes in indicator in the body
    - Response 200 json, with the resolved database dataset
- deployedURL/api/datawrapper-proxy
    - This route is a POST request to allow us to create datawrapper charts in the client side, by running a proxy server route
    - It takes in {csv, indicator, location, chartType} in the body
    - Response 200 json, with the resolved chartId and chartUrl for the published chart
- deployedURL/api/location-topic-form
    - This route is a POST request to allow us to redirect to different pages of the site after submitting a form
    - It takes in location and topic in the body
    - Response redirect to a url within the site based on the location and body
    - Redirect routes
        - Location with no topic = /{location}/topic/All
        - Location with topic = /{location}/topic/{topic}
        - No location with or without topic = /

## Tech Stack

- React with Next.JS 
- TailwindCSS
- Cypress testing
- PostgreSQL

## Dependencies

See [`package.json`](package.json).

## Architecture and Design

We used Tailwind CSS for styling components. While some components are reused across the site, which means that styling in those components will affect all instances, others (e.g. the Life Stories card and, to a lesser extent, the dropdown menus on the map page) are not directly related, so changes will have to be made in more places than one if consistency is desired. 


## Datasets

- Personal wellbeing estimates by local authority (ONS) [happiness, anxiety]
- Life Expectancy by local authority (ONS) [male, female]
- Total Claimants (i.e. Jobseeker's Allowance and UC) (ONS, via Nomis) [total JSA and UC claimants]
- Low paid part-time jobs (more complete data than full-time) (ONS via Trust for London)

## Backlog

### Form

As it stands, the only way to update content, style and functionality on the site is through altering the code. In some cases (especially content), this will be easy without a knowledge of code.

### Further finessing of Datawrapper

We are currently getting 3 types of 'chart' from datawrapper
- d3-lines
    - This is good and usable. There is not much to update in terms of view (though there should be the possibility to include social media links etc). When downloading the data, there may be a better way of downloading by adding further metadata to the API call to Datawrapper.
- tables
    - Gives the data in a nice table. There is a similar download issue to d3-lines, but a more major problem of the table is it is rounding fractional numbers. This means that it gives weird data: for example, if locations data is between 2.5 and 3.49 for all the years it will just say 3 for each table entry.
- d3-maps-choropleth
    - Again similar to the others in downloading data. DataWrapper can take a couple of extra seconds to publish the 'chart', but there should now be a wait that only attempts to render when the API reports it's ready.

## Data preparation

While the process for populating the database is in code, it's designed to be run locally and just builds up the .sql files in [database/](./database/), which are then checked in. i.e. no live web/runtime code changes the database or directly uses the contents of [datasets/](./datasets/).

There is code which calls out to e.g. ONS web APIs (e.g. in [lifeExpectancy.mjs](./utils/lifeExpectancy.mjs)), but this is just for collecting metadata about the data that was manually converted. This also doesn't run live since the results are saved to the DB as part of the `json_to_sql` run. (See below for more on this.)

## Maintenance

### location_scraper.mjs 

This was run once to populate the locations table with London boroughs as well as London (in general) and the UK. If you wish to change the locations, you may want to alter it. You will then need to run it using ``node location_scraper.mjs``. 

### json_to_sql.mjs

This converts the JSON files in datasets to SQL. ONS information generally comes in CSV form. We converted this to JSON with a VS Code plugin [JSON to CSV](https://marketplace.visualstudio.com/items?itemName=khaeransori.json2csv). If you want to add datasets, you may need to alter this file. You will then need to run it using ``node json_to_sql.mjs``.

If using Docker and you also need to test the latest data with the frontend:

  * `docker-compose run --rm app node scripts/json_to_sql.mjs`
  * `docker-compose run --rm app ./scripts/populate_db_docker_local`

### datasets_topics.sql

We wrote this file manually. Therefore, if the order of the topics or datasets is ordered in the topics table or the datasets table, this joining table will need to be updated accordingly.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
