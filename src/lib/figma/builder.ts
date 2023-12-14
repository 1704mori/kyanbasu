import type { DocumentChild } from "./types";
import { RGBAToHex, normalizeRGBA } from "./utils";

export function generateComponent(document: DocumentChild, level = 0) {
  const { backgroundColor } = document;
  let hex = '#ffffff';
  if (backgroundColor && backgroundColor.r) {
    hex = RGBAToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
  }

  const indent = '\t'.repeat(level);
  const childIndent = '\t'.repeat(level + 1);

  const buildChildren = () => {
    let children = '';

    if (!document.children || !document.children.length) return '';

    document.children.forEach(child => {
      if (!child || !child.name) return;

      const matches = child.name.match(INPUT_NAME_REGEX);
      if (matches) {
        children += `${childIndent}${generateInputComponent(child)}\n`;
      } else {
        children += `${childIndent}${generateComponent(child, level + 1)}\n`;
      }
    });

    return children;
  }

  return `${indent}<div class="${buildClasses(document)}">\n${buildChildren()}${indent}</div>`;
}

const INPUT_NAME_REGEX = /input:(\w+)/;

function generateInputComponent(document: DocumentChild) {
  if (!document.name) return;

  const matches = document.name.match(INPUT_NAME_REGEX);
  if (!matches) return;

  const type = matches[1]

  const { backgroundColor } = document;

  return `<input type="${type}" class="${buildClasses(document)}"/>`;
}

function buildClasses(document: DocumentChild) {
  let className = '';

  const isFlex = document.layoutMode === 'HORIZONTAL' || document.layoutMode === 'VERTICAL';

  if (isFlex) {
    className += 'flex';
  }

  if (document.layoutMode === 'VERTICAL') {
    className += ' flex-col';
  }

  if (document.primaryAxisAlignItems === 'CENTER' && document.counterAxisAlignItems === 'CENTER') {
    className += ' items-center justify-center';
  }

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

    if (isFlex) {
      className += ` w-full h-[${height}px]`
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

  if (document.cornerRadius) {
    className += ` rounded-[${document.cornerRadius}px]`;
  }

  return className;
}