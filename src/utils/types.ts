export type Href = string | URL;

export interface Hyperlink {
  href: Href;
}

export type Target = Href | Hyperlink;
