/**
 * Function which returns consistent results when stringify JSON object.
 * 
 * @param {any} x Input value, usually an object or array, to be converted.
 * @param {Function|Array<number>|Array<string>} replacer A function that transforms the results or an array of strings and numbers that acts as an approved list.
 * @param {string|number} space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 * 
 * @returns {string} Consistent JSON string which can be used for hashing.
 */
export function jsonStringify(
    x: any,
    replacer?: (this: any, key: string, value: any) => any | Array<number> | Array<string> | null,
    space?: string | number
): string
{
    const spacing = typeof space === 'number' ? new Array(isFinite(space) ? space + 1 : 0).join(' ') : (space ?? '');
    const separator = spacing ? ': ' : ':';
    const seen = new Set<any>();
    const indents = [''];

    const indentify = (level: number): string =>
    {
        while (indents.length <= level)
        {
            indents.push(indents[indents.length - 1] + spacing);
        }

        return indents[level];
    };

    const stringify = (parent: any, key: string, node: any, level: number): string =>
    {
        if (node && node.toJSON && typeof node.toJSON === 'function')
        {
            node = node.toJSON();
        }

        if (replacer) 
        {
            node = replacer.call(parent, key, node);
        }

        if (node === undefined) 
        {
            return '';
        }

        if (node === null)
        {
            return 'null';
        }

        if (typeof node === 'number') 
        {
            return isFinite(node) ? String(node) : 'null';
        }

        if (typeof node !== 'object')
        {
            return JSON.stringify(node);
        }

        if (seen.has(node)) 
        {
            return 'null';
        }

        seen.add(node);

        const indent = spacing ? '\n' + indentify(level + 1) : '';
        const closingIndent = spacing ? '\n' + indentify(level) : '';
        const parts = new Array<string>();

        if (Array.isArray(node)) 
        {
            for (let i = 0; i < node.length; i++) 
            {
                const value = stringify(node, String(i), node[i], level + 1) || 'null';

                parts.push(`${indent}${value}`);
            }

            const result = `[${parts.join(',')}${closingIndent}]`;

            seen.delete(node);

            return result;
        }

        const nodeKeys = Object.keys(node).sort();

        for (let i = 0; i < nodeKeys.length; i++)
        {
            const nodeKey = nodeKeys[i];
            const value = stringify(node, nodeKey, node[nodeKey], level + 1);

            if (value === '')
            {
                continue;
            }

            parts.push(`${indent}${JSON.stringify(nodeKey)}${separator}${value}`);
        }

        const result = `{${parts.join(',')}${closingIndent}}`;

        seen.delete(node);

        return result;
    };

    return stringify({ '': x }, '', x, 0);
}
