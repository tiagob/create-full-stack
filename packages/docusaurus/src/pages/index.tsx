/* eslint-disable import/no-unresolved */
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import styles from "./styles.module.css";

const features = [
  {
    title: "Curated libraries and frameworks",
    imageUrl: "img/framework.svg",
    description: (
      <>
        Don&apos;t get stuck in analysis paralysis.
        <br />
        <br />
        <ul>
          <li>
            <a href="/docs/libraries_and_frameworks">
              Libraries and frameworks
            </a>{" "}
            (React, RN, Apollo, Hasura, Pulumi) are chosen for devX and
            performance
          </li>
          <li>
            Provides the glue and ensures{" "}
            <a href="/docs/configuration">consistent configuration</a>
          </li>
          <li>
            <a href="/docs/auth">Authenticates users</a> with Auth0
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Guard rails",
    imageUrl: "img/typescript.svg",
    description: (
      <>
        Have confidence in your changes.
        <br />
        <br />
        <ul>
          <li>Type checking from UI to DB (Postgres)</li>
          <li>
            API uses Apollo GraphQL - TS types are automatically generated
          </li>
          <li>Code linting (Airbnb) and formatting (Prettier)</li>
        </ul>
      </>
    ),
  },
  {
    title: "Production ready",
    imageUrl: "img/rocket.svg",
    description: (
      <>
        Deploy to AWS in minutes.
        <br />
        <br />
        <ul>
          <li>
            Setup is simple with{" "}
            <a href="/docs/cloud">included Pulumi components</a>
          </li>
          <li>
            <a href="/docs/cicd">CI/CD</a> - tests run on GitHub and code
            deploys automatically on push to master
          </li>
          <li>
            <a href="/docs/migrations">Migration support</a> ensures safe DB
            changes
          </li>
        </ul>
      </>
    ),
  },
];

interface FeatureProps {
  imageUrl: string;
  title: string;
  description: JSX.Element;
}

function Feature({ imageUrl, title, description }: FeatureProps) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.heroButton
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className={styles.summary}>
          Like Create React App but for your full stack. Learn more on{" "}
          <i>
            <a href="/docs/why">Why?</a>
          </i>{" "}
          or check out <a href="/blog/create_full_stack_story">the blog post</a>
          .
        </div>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props: FeatureProps) => (
                  <Feature key={props.title} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
