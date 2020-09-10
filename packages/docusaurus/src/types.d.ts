// Remove when https://github.com/facebook/docusaurus/issues/3424
// is addressed.
declare module "@docusaurus/*";

declare module "@docusaurus/Head" {
  const helmet: typeof import("react-helmet").Helmet;
  export default helmet;
}

declare module "@docusaurus/Link" {
  type RRLinkProps = Partial<import("react-router-dom").LinkProps>;
  type LinkProps = RRLinkProps & {
    to?: string;
    activeClassName?: string;
    isNavLink?: boolean;
  };
  const Link: (props: LinkProps) => JSX.Element;
  export default Link;
}

declare module "@docusaurus/router" {
  export const Redirect: (props: { to: string }) => import("react").Component;
  export function matchPath(
    pathname: string,
    opts: { path?: string; exact?: boolean; strict?: boolean }
  ): boolean;
  export function useLocation(): Location;
}

declare module "@docusaurus/useDocusaurusContext" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default function (): any;
}

declare module "@docusaurus/useBaseUrl" {
  export default function (
    relativePath: string | undefined,
    opts?: { absolute?: true; forcePrependBaseUrl?: true }
  ): string;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.css" {
  const src: string;
  export default src;
}
