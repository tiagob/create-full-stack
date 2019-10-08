export enum Page {
  about = "about",
  signIn = "sign-in"
}

export interface TodoType {
  id: string;
  name: string;
  complete: boolean;
}
