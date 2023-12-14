export type RequestTokenResponse = {
  user_id: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export type FigmaUser = {
  id: string;
  handle: string;
  img_url: string;
  email: string;
}

/* figma typings */
export type FigmaFile = {
  document: Document;
  components: ComponentSets;
  componentSets: ComponentSets;
  schemaVersion: number;
  styles: ComponentSets;
  name: string;
  lastModified: Date;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

export type ComponentSets = {
}

export type Document = {
  id: string;
  name: string;
  type: string;
  scrollBehavior: string;
  children: DocumentChild[];
}

export type DocumentChild = {
  id: string;
  name: string;
  type: string;
  scrollBehavior: string;
  blendMode: string;
  children: DocumentChild[];
  absoluteBoundingBox: Absolute;
  absoluteRenderBounds: Absolute;
  constraints: Constraints;
  layoutSizingHorizontal: string;
  layoutSizingVertical: string;
  clipsContent: boolean;
  background: Background[];
  characters: string;
  fills: Background[];
  strokes: any[];
  strokeWeight: number;
  strokeAlign: string;
  backgroundColor: Color;
  cornerRadius: number;
  cornerSmoothing: number;
  layoutMode: string;
  itemSpacing: number;
  counterAxisAlignItems: string;
  primaryAxisAlignItems: string;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  layoutWrap: string;
  effects: any[];
}

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type Absolute = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Background = {
  blendMode: string;
  type: string;
  color: Color;
}

export type Constraints = {
  vertical: string;
  horizontal: string;
}

export type PrototypeDevice = {
  type: string;
  rotation: string;
}
