import sanitizeHtml from 'sanitize-html';

export const sanitize = (value: string) => {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
