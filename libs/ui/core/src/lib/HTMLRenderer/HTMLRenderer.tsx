import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html-react';
import template from 'lodash.template';
import reactHtmlParser, { processNodes, Transform } from 'react-html-parser';
import { Link, Typography } from '@mui/material';

import { BasicList } from '../BasicList';

/**
 * Transforms DOM-nodes into the corresponding elements known to Material UI (eg. <p> into <Typography>).
 *
 * Return undefined to leave the node as-is.
 *
 * More info: https://github.com/wrakky/react-html-parser/blob/master/src/processNodes.js
 *
 *
 * @TODO: Create proper HTML elements and styles (FLX-134)
 *
 * @param node Object
 * @param index string
 */
export const transformTags: Transform = (node, index) => {
  if (!node.children) {
    return;
  }

  if (node.type === 'tag') {
    switch (node.name) {
      case 'p':
        return (
          <Typography key={index} component="p">
            {processNodes(node.children, transformTags)}
          </Typography>
        );
      case 'li':
        return (
          <Typography
            key={index}
            component="li"
            style={{ display: 'list-item', marginBottom: 0 }}
          >
            {processNodes(node.children, transformTags)}
          </Typography>
        );
      // Treat all links as external links
      case 'a':
        return (
          <Link
            key={index}
            {...node.attribs}
            rel="noopener noreferrer"
            target="_blank"
          >
            {processNodes(node.children, transformTags)}
          </Link>
        );
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return (
          <Typography key={index} variant={node.name} component={node.name}>
            {processNodes(node.children, transformTags)}
          </Typography>
        );
      case 'ul':
      case 'ol':
        return (
          <BasicList
            key={index}
            component={node.name}
            children={processNodes(node.children, transformTags)}
          />
        );
      default:
        return undefined;
    }
  }

  return undefined;
};

export function useHTMLToMaterialUIParser(
  value: string,
  options?: Omit<IHTMLSanitizerOptions, 'value'>,
) {
  const sanitizedHTML = useHTMLSanitizer({ ...options, value });

  return useMemo(
    () => reactHtmlParser(sanitizedHTML, { transform: transformTags }),
    [sanitizedHTML],
  );
}

export interface IHTMLSanitizerOptions {
  value: string;
  allowedTags?: string[];
  allowedAttributes?: {
    [key: string]: string[];
  };
}

interface IImports {
  [key: string]: (value: string) => string;
}

export function useHTMLSanitizer(options: IHTMLSanitizerOptions) {
  const {
    value,
    allowedTags = ['sup', 'sub', 'a', 'strong', 'em'],
    allowedAttributes = { a: ['href', 'name', 'target'] },
  } = options;

  return useMemo(
    () => sanitizeHtml(value, { allowedTags, allowedAttributes }),
    [value, allowedTags, allowedAttributes],
  );
}

const DEFAULT_ALLOWED_TAGS = ['sup', 'sup', 'strong', 'em'];
const DEFAULT_ALLOWED_ATTRIBUTES = {};

export function useBasicHTMLParser({
  value,
  allowedTags = DEFAULT_ALLOWED_TAGS,
  allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
}: {
  value?: React.ReactNode | string;
  allowedTags?: IHTMLSanitizerOptions['allowedTags'];
  allowedAttributes?: IHTMLSanitizerOptions['allowedAttributes'];
}) {
  return useMemo(() => {
    if (!value || typeof value !== 'string') {
      return value;
    }

    return reactHtmlParser(
      sanitizeHtml(value, {
        allowedTags,
        allowedAttributes,
      }),
    );
  }, [value, allowedTags, allowedAttributes]);
}

const superScriptFormatter = (value: string) => `<sup>${value}</sup>`;
const subScriptFormatter = (value: string) => `<sub>${value}</sub>`;

export const defaultImports: IImports = {
  sup: superScriptFormatter,
  sub: subScriptFormatter,
};

export function useFormattedTemplate<
  T extends React.ReactNode = React.ReactNode,
>(value: T, imports: IImports = defaultImports): React.ReactNode {
  const compiled = useMemo(() => {
    if (typeof value === 'string') {
      return template(value, { imports });
    }

    return () => value;
  }, [value, imports]);

  return useMemo(() => compiled(), [compiled]);
}
