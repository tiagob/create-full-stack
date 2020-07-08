declare module "folder-hash" {
  // https://github.com/marc136/node-folder-hash#parameters-for-the-hashelement-function
  // eslint-disable-next-line import/prefer-default-export
  export function hashElement(name: string): Promise<{ hash: string }>;
}
