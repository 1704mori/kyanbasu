import type { DocumentChild } from "./types";
import { RGBAToHex, normalizeRGBA } from "./utils";

export function generateComponent(document: DocumentChild) {

  const { backgroundColor } = document;

  let hex = '#ffffff';
  if (backgroundColor && backgroundColor.r) {
    hex = RGBAToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
  }

  const isFlex = document.layoutMode === 'HORIZONTAL' || document.layoutMode === 'VERTICAL';

  const buildClassName = () => {
    let className = '';

    if (isFlex) {
      className += 'flex';
    }

    if (document.layoutMode === 'VERTICAL') {
      className += ' flex-col';
    }

    if (backgroundColor) {
      className += ` bg-[${hex}]`;
    }

    if (document.itemSpacing) {
      className += ` gap-[${document.itemSpacing}px]`;
    }

    return className;
  }

  const buildChildren = () => {
    let children = '';

    if (!document.children || !document.children.length) return;

    document.children.forEach(child => {
      if (!child) return;

      if (!child.name) return;

      const matches = child.name.match(INPUT_NAME_REGEX);

      if (matches) {
        children += generateInputComponent(child);
        console.log(children);
        return;
      }


      children += generateComponent(child);
    });

    return children;
  }

  return `<div class="${buildClassName()}">${buildChildren()}</div>`;
}

const INPUT_NAME_REGEX = /input:(\w+)/;

function generateInputComponent(document: DocumentChild) {
  if (!document.name) return;

  const matches = document.name.match(INPUT_NAME_REGEX);
  if (!matches) return;

  const type = matches[1]

  const { backgroundColor } = document;

  let hex = '#ffffff';
  if (backgroundColor && backgroundColor.r) {
    hex = RGBAToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
  }

  const isFlex = document.layoutMode === 'HORIZONTAL' || document.layoutMode === 'VERTICAL';

  const buildClassName = () => {
    let className = '';

    if (isFlex) {
      className += 'flex';
    }

    if (document.layoutMode === 'VERTICAL') {
      className += ' flex-col';
    }

    if (backgroundColor) {
      className += ` bg-[${hex}]`;
    }

    if (document.itemSpacing) {
      className += ` gap-[${document.itemSpacing}px]`;
    }

    if (document.absoluteRenderBounds) {
      const { width, height } = document.absoluteRenderBounds;
      className += ` w-[${width}px] h-[${height}px]`;
    }

    return className;
  }

  return `<input type="${type}" class="${buildClassName()}"/>`;
}