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
    title: "Most popular tools in class",
    imageUrl: "img/framework.svg",
    description: (
      <>
        Better support with fewer edge cases - integrating tools like{" "}
        <a href="/docs/libraries_and_frameworks">
          React, Apollo, Hasura, Expo, AWS, Pulumi and Auth0
        </a>
        .
      </>
    ),
  },
  {
    title: "Single statically typed language",
    imageUrl: "img/typescript.svg",
    description: (
      <>
        Using TypeScript everywhere minimizes context switching and prioritizes
        compile time over runtime bugs.
      </>
    ),
  },
  {
    title: "Scales",
    imageUrl: "img/rocket.svg",
    description: (
      <>
        Whether you&apos;re handling millions of requests or building the next
        Facebook, Create Full Stack grows with you and your project.
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
          Focus on building your ideas, not fitting libraries and frameworks
          together. Learn more on{" "}
          <i>
            <a href="/docs/why">Why?</a>
          </i>{" "}
          or check out <a href="/blog/create_full_stack">the blog post</a>.
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
