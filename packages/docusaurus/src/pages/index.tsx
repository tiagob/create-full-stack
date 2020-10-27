/* eslint-disable import/no-unresolved */
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React, { ReactNode } from "react";

import styles from "./styles.module.css";

interface SelectProps {
  title: string;
  value: string;
  options: {
    name: string;
    value: string;
    description: string | ReactNode;
    imgSrc: string;
  }[];
  setValue: (value: string) => void;
}

function Select({ title, value, options, setValue }: SelectProps) {
  return (
    <>
      <div className={styles.selectTitle}>{title}</div>
      {options.map((option) => (
        <div className={styles.selectOption} key={option.value}>
          <div className={styles.selectButton}>
            <label
              htmlFor={`${title}${option.value}`}
              className={styles.selectLabel}
            >
              <img
                src={option.imgSrc}
                alt={option.name}
                className={styles.selectImg}
              />
              {option.name}
            </label>
            <input
              id={`${title}${option.value}`}
              type="radio"
              name={title}
              value={option.value}
              checked={value === option.value}
              onChange={(event) => setValue(event.target.value)}
              className={styles.selectRadio}
            />
          </div>
          <div className={styles.selectDescription}>{option.description}</div>
        </div>
      ))}
    </>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const [backend, setBackend] = React.useState("hasura");
  const [authentication, setAuthentication] = React.useState("auth0");
  const [cloud, setCloud] = React.useState("aws");
  const [web, setWeb] = React.useState("react");
  const [mobile, setMobile] = React.useState("react-native");
  const [cicd, setCicd] = React.useState("github-actions");
  const generateCommand = `yarn create full-stack --backend ${backend} --authentication ${authentication} --cloud ${cloud} --web ${web} --mobile ${mobile} --cicd ${cicd}`;

  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main>
        <div className={styles.heading}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.08333em",
            }}
          >
            STEP #1
          </div>
          <h3>Choose your stack</h3>
        </div>
        <section className={styles.features}>
          <div className="container">
            <div className="row" style={{ justifyContent: "center" }}>
              <Select
                title="Backend"
                value={backend}
                setValue={setBackend}
                options={[
                  {
                    name: "Hasura",
                    value: "hasura",
                    imgSrc: "/img/hasura.svg",
                    description: (
                      <>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://hasura.io/docs/1.0/graphql/core/index.html"
                        >
                          Hasura
                        </a>{" "}
                        provides a GraphQL API and developer web console on top
                        of Postgres as a service. Configure the database and
                        permissions on the web console.
                      </>
                    ),
                  },
                  {
                    name: "Apollo Server Express",
                    value: "apollo-server-express",
                    imgSrc: "/img/apollo.svg",
                    description: (
                      <>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://www.apollographql.com/docs/apollo-server/"
                        >
                          Apollo Server Express
                        </a>{" "}
                        generates a TypeScript, Express, Node, and TypeORM stack
                        with Apollo Server for resolving GraphQL requests.
                      </>
                    ),
                  },
                ]}
              />

              <Select
                title="Authentication"
                value={authentication}
                setValue={setAuthentication}
                options={[
                  {
                    name: "Auth0",
                    value: "auth0",
                    imgSrc: "/img/auth0.svg",
                    description: (
                      <>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://auth0.com/"
                        >
                          Auth0
                        </a>{" "}
                        provides authentication and user management as a
                        service. It has one-click integrations with every
                        identity provider (Google, Facebook, Twitter etc.).
                      </>
                    ),
                  },
                  {
                    name: "None",
                    value: "none",
                    imgSrc: "/img/block-24px.svg",
                    description: "This won't be included in your code base.",
                  },
                ]}
              />

              <Select
                title="Cloud"
                value={cloud}
                setValue={setCloud}
                options={[
                  {
                    name: "AWS/Pulumi",
                    value: "aws",
                    imgSrc: "/img/aws.svg",
                    description: (
                      <>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://www.pulumi.com/"
                        >
                          Pulumi
                        </a>{" "}
                        is an infrastructure as code (IAC) platform for defining
                        your cloud resources on AWS or Auth0 in TypeScript.
                        Create Full Stack comes with a Pulumi resources library.
                      </>
                    ),
                  },
                  {
                    name: "None",
                    value: "none",
                    imgSrc: "/img/block-24px.svg",
                    description: "This won't be included in your code base.",
                  },
                ]}
              />

              <Select
                title="Web"
                value={web}
                setValue={setWeb}
                options={[
                  {
                    name: "React",
                    value: "react",
                    imgSrc: "/img/react.svg",
                    description: (
                      <>
                        Create Full Stack scaffolds a TypeScript React app with{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://create-react-app.dev/"
                        >
                          Create React App
                        </a>
                        . The stack includes{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://www.apollographql.com/docs/react/"
                        >
                          Apollo Client
                        </a>{" "}
                        ,{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://material-ui.com/"
                        >
                          Material UI
                        </a>{" "}
                        , and{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://reactrouter.com/"
                        >
                          React Router
                        </a>
                        .
                      </>
                    ),
                  },
                  {
                    name: "None",
                    value: "none",
                    imgSrc: "/img/block-24px.svg",
                    description: "This won't be included in your code base.",
                  },
                ]}
              />

              <Select
                title="Mobile"
                value={mobile}
                setValue={setMobile}
                options={[
                  {
                    name: "React Native/Expo",
                    value: "react-native",
                    imgSrc: "/img/expo.svg",
                    description: (
                      <>
                        Create Full Stack scaffolds a TypeScript React Native
                        app with{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="http://expo.io/"
                        >
                          Expo
                        </a>
                        . The stack includes{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://www.apollographql.com/docs/react/"
                        >
                          Apollo Client
                        </a>{" "}
                        ,{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://reactnativeelements.com/"
                        >
                          React Native Elements
                        </a>{" "}
                        , and{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://reactnavigation.org/"
                        >
                          React Navigation
                        </a>
                        .
                      </>
                    ),
                  },
                  {
                    name: "None",
                    value: "none",
                    imgSrc: "/img/block-24px.svg",
                    description: "This won't be included in your code base.",
                  },
                ]}
              />

              <Select
                title="CI/CD"
                value={cicd}
                setValue={setCicd}
                options={[
                  {
                    name: "GitHub Actions",
                    value: "github-actions",
                    imgSrc: "/img/github.svg",
                    description: (
                      <>
                        Includes configuration for continuous integration (CI)
                        and continuous deployment (CD) through{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://docs.github.com/en/actions"
                        >
                          GitHub Actions
                        </a>{" "}
                        which run on any code push to GitHub.
                      </>
                    ),
                  },
                  {
                    name: "None",
                    value: "none",
                    imgSrc: "/img/block-24px.svg",
                    description: "This won't be included in your code base.",
                  },
                ]}
              />
            </div>
            <div className={styles.heading}>
              <div className={styles.headingStep}>STEP #2</div>
              <h3>Check dependencies</h3>
            </div>
            <CodeBlock>yarn --version</CodeBlock>
            <p>
              Must be at or above v1.22 (
              <a
                target="_blank"
                rel="noreferrer"
                href="https://classic.yarnpkg.com/en/docs/install"
              >
                install
              </a>
              ).
            </p>
            <CodeBlock>docker-compose --version</CodeBlock>
            <p>
              Must be at or above v1.25.5 (
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.docker.com/get-docker/"
              >
                install
              </a>
              ). Docker must be running.
            </p>
            <CodeBlock>node --version</CodeBlock>
            <p>
              Must be at or above v12.10 or v14 (excluding non LTS v13 and v15).
              You can use{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/nvm-sh/nvm#installing-and-updating"
              >
                nvm
              </a>{" "}
              to download or upgrade versions.
            </p>
            <div className={styles.heading}>
              <div className={styles.headingStep}>STEP #3</div>
              <h3>Generate codebase</h3>
            </div>
            <CodeBlock>{generateCommand}</CodeBlock>
            <p>
              Run this command in the terminal to generate your codebase based
              on your stack selection above.
            </p>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.heading}>
              <h3>Additional features</h3>
            </div>
            <div className="row" style={{ justifyContent: "center" }}>
              <div className={styles.featureBox}>
                <h4>Open source</h4>
                Create Full Stack is free and open source under the MIT license
              </div>
              <div className={styles.featureBox}>
                <h4>Simple commands</h4>
                Single <a href="/docs/available_scripts#yarn-start">
                  start
                </a>{" "}
                local development command for the full stack
              </div>
              <div className={styles.featureBox}>
                <h4>Monorepo</h4>
                Monorepo with{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://classic.yarnpkg.com/en/docs/workspaces/"
                >
                  workspaces
                </a>{" "}
                set up for code sharing
              </div>
              <div className={styles.featureBox}>
                <h4>Consistent configuration</h4>
                Cross platform <a href="/docs/configuration">
                  configuration
                </a>{" "}
                with .env.
                {"{development|production}"} files
              </div>
              <div className={styles.featureBox}>
                <h4>GraphQL API</h4>
                Automated TypeScript code generation from GraphQL
              </div>
              <div className={styles.featureBox}>
                <h4>Tests included</h4>
                Cross platform Jest testing
              </div>
              <div className={styles.featureBox}>
                <h4>Code formatting and linting</h4>
                Formatting with Prettier and linting with ESLint following the
                Airbnb style guide
              </div>
              <div className={styles.featureBox}>
                <h4>Migration support</h4>
                Postgres <a href="/docs/migrations">migration</a> configuration
                included with Hasura or TypeORM
              </div>
              <div className={styles.featureBox}>
                <h4>VSCode configuration</h4>
                Suggested VSCode extensions with configuration
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
