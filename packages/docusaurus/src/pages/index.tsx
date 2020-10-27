/* eslint-disable import/no-unresolved */
import useBaseUrl from "@docusaurus/useBaseUrl";
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
  const chosenOption = options.find((option) => option.value === value);
  return (
    <div style={{ width: 325, margin: 8 }}>
      <h4 style={{ paddingLeft: 10 }}>{title}</h4>
      <div className="select">
        <img
          src={useBaseUrl(chosenOption.imgSrc)}
          style={{
            padding: 11,
            height: 32,
            width: 32,
            position: "absolute",
          }}
          alt={chosenOption.name}
        />
        <select
          style={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          {options.map((option) => (
            <option value={option.value}>{option.name}</option>
          ))}
        </select>
      </div>
      <div
        style={{
          padding: 8,
          fontSize: 15,
          color: "#595959",
          backgroundColor: "#faf8fc",
          border: "1px solid #eae7ed",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        {chosenOption.description}
      </div>
    </div>
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
        <div className={styles.summary}>
          <h2>Choose your stack</h2>
        </div>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <Select
                title="Backend"
                value={backend}
                setValue={setBackend}
                options={[
                  {
                    name: "Apollo Server Express",
                    value: "apollo-server-express",
                    imgSrc: "img/apollo.svg",
                    description: (
                      <>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://www.apollographql.com/docs/apollo-server/"
                        >
                          Apollo Server Express
                        </a>{" "}
                        generates a TypeScript, Express, and Node stack with
                        Apollo Server for resolving GraphQL requests.
                      </>
                    ),
                  },
                  {
                    name: "Hasura",
                    value: "hasura",
                    imgSrc: "img/hasura.svg",
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
                    imgSrc: "img/auth0.svg",
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
                    imgSrc: "img/block-24px.svg",
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
                    imgSrc: "img/aws.svg",
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
                    imgSrc: "img/block-24px.svg",
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
                    imgSrc: "img/react.svg",
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
                    imgSrc: "img/block-24px.svg",
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
                    imgSrc: "img/expo.svg",
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
                    imgSrc: "img/block-24px.svg",
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
                    imgSrc: "img/github.svg",
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
                    imgSrc: "img/block-24px.svg",
                    description: "This won't be included in your code base.",
                  },
                ]}
              />
            </div>
            <div className={styles.summary}>
              <h2>Check dependencies</h2>
            </div>
            <CodeBlock>yarn --version</CodeBlock>
            <p>
              Must be at or above v1.22. Download or upgrade from their{" "}
              <a href="https://classic.yarnpkg.com/en/docs/install">website</a>.
            </p>
            <CodeBlock>docker-compose --version</CodeBlock>
            <p>
              Must be at or above v1.25.5. Download, install and start Docker
              from their{" "}
              <a href="https://docs.docker.com/get-docker/">website</a>.
            </p>
            <CodeBlock>node --version</CodeBlock>
            <p>
              Must be at or above v12.10 or v14 (excluding non LTS v13 and v15).
              You can use{" "}
              <a href="https://github.com/nvm-sh/nvm#installing-and-updating">
                nvm
              </a>{" "}
              to download or upgrade versions.
            </p>
            <div className={styles.summary}>
              <h2>Generate codebase</h2>
            </div>
            <CodeBlock>{generateCommand}</CodeBlock>
            <p>
              Run this command in the terminal to generate your codebase based
              on your stack selection above.
            </p>

            <div className={styles.summary}>
              <h2>Additional features</h2>
            </div>
            <ul>
              <li>Open source</li>
              <li>Single start local development command for the full stack</li>
              <li>Monorepo with workspaces set up for code sharing</li>
              <li>
                Configuration with .env.{"{development|production}"} files
                across platform
              </li>
              <li>Automated TypeScript code generation from GraphQL</li>
              <li>Cross platform Jest testing</li>
              <li>Code formatting with Prettier</li>
              <li>Code linting with ESLint following the Airbnb style guide</li>
              <li>Suggested VSCode extensions with configuration</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
