declare module "folder-hash" {
  // https://github.com/marc136/node-folder-hash#parameters-for-the-hashelement-function
  export function hashElement(name: string): Promise<{ hash: string }>;
}
