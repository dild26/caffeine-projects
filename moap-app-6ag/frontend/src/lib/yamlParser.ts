// Enhanced YAML parser for spec.yaml
// Handles the specific structure of our spec.yaml with proper array and object parsing

export function parseYAML(yamlText: string): any {
  const lines = yamlText.split('\n');
  const result: any = {};
  const stack: Array<{ obj: any; indent: number; key?: string; isArray?: boolean }> = [
    { obj: result, indent: -1 },
  ];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      i++;
      continue;
    }

    const indent = line.search(/\S/);
    if (indent === -1) {
      i++;
      continue;
    }

    const trimmed = line.trim();

    // Handle array items
    if (trimmed.startsWith('- ')) {
      const content = trimmed.substring(2).trim();

      // Pop stack to correct level
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];
      const parentKey = parent.key;

      if (content.includes(':')) {
        // Array of objects - create new object
        const newObj: any = {};

        // Ensure parent has an array
        if (parentKey && !Array.isArray(parent.obj[parentKey])) {
          parent.obj[parentKey] = [];
        }

        if (parentKey) {
          parent.obj[parentKey].push(newObj);
        }

        // Parse the first key-value pair
        const colonIndex = content.indexOf(':');
        const key = content.substring(0, colonIndex).trim();
        const value = content.substring(colonIndex + 1).trim();
        newObj[key] = parseValue(value);

        // Push this object onto the stack so subsequent properties can be added to it
        stack.push({ obj: newObj, indent, isArray: true });
      } else {
        // Simple array item
        if (parentKey && !Array.isArray(parent.obj[parentKey])) {
          parent.obj[parentKey] = [];
        }
        if (parentKey) {
          parent.obj[parentKey].push(parseValue(content));
        }
      }
      i++;
      continue;
    }

    // Handle key-value pairs
    if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      // Pop stack to correct level
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];

      // Determine if this is a property of an array item
      if (parent.isArray && parent.obj && typeof parent.obj === 'object' && !Array.isArray(parent.obj)) {
        // Add property to the current array item object
        parent.obj[key] = parseValue(value);
      } else {
        // Regular object property
        if (value === '' || value === '[]' || value === '{}') {
          // Empty value or collection
          if (value === '[]') {
            parent.obj[key] = [];
          } else if (value === '{}') {
            parent.obj[key] = {};
          } else {
            // Check next line to determine if it's an object or array
            const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
            if (nextLine && nextLine.trim().startsWith('- ')) {
              parent.obj[key] = [];
              stack.push({ obj: parent.obj, indent, key });
            } else if (nextLine && nextLine.search(/\S/) > indent) {
              parent.obj[key] = {};
              stack.push({ obj: parent.obj[key], indent, key });
            } else {
              parent.obj[key] = null;
            }
          }
        } else {
          // Has a value
          parent.obj[key] = parseValue(value);
        }
      }
    }

    i++;
  }

  return result;
}

function parseValue(value: string): any {
  // Remove quotes if present
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.substring(1, value.length - 1);
  }

  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Null
  if (value === 'null' || value === '~') return null;

  // Number
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);

  // Date (ISO format)
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value; // Keep as string for now
  }

  // Default: string
  return value;
}
