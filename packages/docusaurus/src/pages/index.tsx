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
        Better support with fewer edge cases integrating tools like React,
        Apollo, Hasura, Expo, AWS, Pulumi and Auth0.
      </>
    ),
  },
  {
    title: "Single statically typed language",
    imageUrl: "img/typescript.svg",
    description: (
      <>
        Using TypeScript everywhere, minimizes context switching and prefers
        compile time over runtime bugs.
      </>
    ),
  },
  {
    title: "Scales",
    imageUrl: "img/rocket.svg",
    description: (
      <>
        Whether it&apos;s millions of requests or you&apos;re building the next
        Facebook these tools grow with you while minimizing complexity.
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
      <img src="img/logos.png" alt="Logos" className={styles.logos} />
    </Layout>
  );
}

export default Home;
