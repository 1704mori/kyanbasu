import type { DocumentChild } from "./types";
import { RGBAToHex, normalizeRGBA } from "./utils";
import { format } from "prettier";
import parserHtml from "prettier/plugins/html";

const INPUT_NAME_REGEX = /input:(\w+)/;
const BUTTON_NAME_REGEX = /button:?(\w*)/;

export function generateComponent(document: DocumentChild) {
  const { backgroundColor } = document;
  let hex = '#ffffff';
  if (backgroundColor && backgroundColor.r) {
    hex = RGBAToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
  }

  return `<div class="${buildClasses(document)}">\n${buildChildren(document)}</div>`;
}

export function generateComponentFormatted(document: DocumentChild) {
  return format(generateComponent(document), {
    parser: "html",
    plugins: [parserHtml],
    htmlWhitespaceSensitivity: "ignore",
    printWidth: 120,
    tabWidth: 2,
    endOfLine: "lf",
  });
}

function buildChildren(document: DocumentChild) {
  let children = '';

  if (!document.children || !document.children.length) return '';

  document.children.forEach(child => {
    if (!child || !child.name) return;

    const hasInput = child.name.match(INPUT_NAME_REGEX);
    if (hasInput) {
      children += `${generateInputComponent(child)}\n`;
    } else if (child.name.match(BUTTON_NAME_REGEX)) {
      children += `${generateButtonComponent(child)}\n`;
    } else if (child.type === "TEXT") {
      children += `${generateTextComponent(child)}\n`;
    } else {
      children += `${generateComponent(child)}\n`;
    }
  });

  return children;
}

function generateInputComponent(document: DocumentChild) {
  if (!document.name) return;

  const matches = document.name.match(INPUT_NAME_REGEX);
  if (!matches) return;
  const type = matches[1];

  return `<input type="${type}" class="${buildClasses(document)}"/>`;
}

function generateButtonComponent(document: DocumentChild) {
  if (!document.name) return;

  const matches = document.name.match(BUTTON_NAME_REGEX);
  if (!matches) return;
  if (document.type !== "FRAME") return;

  const children = buildChildren(document);

  return `<button class="${buildClasses(document)}">${children ? children : "Button"}</button>`;
}

function generateTextComponent(document: DocumentChild) {
  if (!document.name) return;
  if (document.type !== "TEXT") return;

  return `<p>${document.characters}</p>`;
}


function buildClasses(document: DocumentChild) {
  let className = '';

  const isFlex = document.layoutMode === 'HORIZONTAL' || document.layoutMode === 'VERTICAL';
  const fillWidth = document.layoutSizingHorizontal === 'FILL';

  if (isFlex) {
    className += 'flex';
  }

  if (document.layoutMode === 'VERTICAL') {
    className += ' flex-col';
  }

  if (document.primaryAxisAlignItems === 'CENTER' && document.counterAxisAlignItems === 'CENTER') {
    className += ' items-center justify-center';
  }

  // if (document.name == "container") {
  //   const {width, height} = document.absoluteBoundingBox;
  //   className += ` max-w-[${width}px] max-h-[${height}px]`;
  // }

  if (document.backgroundColor) {
    const { r, g, b, a } = document.backgroundColor;
    const hex = RGBAToHex(r, g, b, a);
    className += ` bg-[${hex}]`;
  }

  if (document.fills.length && document.fills[0].type === 'SOLID' && !document.backgroundColor) {
    const { r, g, b, a } = document.fills[0].color;
    const hex = RGBAToHex(r, g, b, a);
    className += ` bg-[${hex}]`;
  }

  if (document.itemSpacing) {
    className += ` gap-[${document.itemSpacing}px]`;
  }

  if (document.absoluteRenderBounds) {
    const { width, height } = document.absoluteRenderBounds;

    if (isFlex && fillWidth) {
      className += ` w-full h-[${height}px]`
    } else if (fillWidth) {
      className += ` w-full h-[${height}px]`;
    } else {
      className += ` w-[${width}px] h-[${height}px]`;
    }
  }

  if (document.paddingLeft && document.paddingRight && document.paddingTop && document.paddingBottom) {
    className += ` p-[${document.paddingTop}px_${document.paddingRight}px_${document.paddingBottom}px_${document.paddingLeft}px]`;
  }

  if (document.paddingLeft && !document.paddingRight) {
    className += ` pl-[${document.paddingLeft}px]`;
  }

  if (document.paddingRight && !document.paddingLeft) {
    className += ` pr-[${document.paddingRight}px]`;
  }

  if (document.paddingTop && !document.paddingBottom) {
    className += ` pt-[${document.paddingTop}px]`;
  }

  if (document.paddingBottom && !document.paddingTop) {
    className += ` pb-[${document.paddingBottom}px]`;
  }

  if (document.paddingLeft && document.paddingRight && !document.paddingTop && !document.paddingBottom) {
    className += ` px-[${document.paddingLeft}px]`;
  }

  if (document.paddingTop && document.paddingBottom && !document.paddingLeft && !document.paddingRight) {
    className += ` py-[${document.paddingTop}px]`;
  }

  if (document.paddingLeft && document.paddingRight && document.paddingTop && !document.paddingBottom) {
    className += ` pt-[${document.paddingTop}px] px-[${document.paddingLeft}px]`;
  }

  if (document.paddingLeft && document.paddingRight && !document.paddingTop && document.paddingBottom) {
    className += ` pb-[${document.paddingBottom}px] px-[${document.paddingLeft}px]`;
  }

  if (document.paddingLeft && !document.paddingRight && document.paddingTop && document.paddingBottom) {
    className += ` pt-[${document.paddingTop}px] pb-[${document.paddingBottom}px] pl-[${document.paddingLeft}px]`;
  }

  if (!document.paddingLeft && document.paddingRight && document.paddingTop && document.paddingBottom) {
    className += ` pt-[${document.paddingTop}px] pb-[${document.paddingBottom}px] pr-[${document.paddingRight}px]`;
  }

  if (document.cornerRadius) {
    className += ` rounded-[${document.cornerRadius}px]`;
  }

  return className;
}