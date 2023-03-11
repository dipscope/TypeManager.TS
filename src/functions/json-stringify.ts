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
	const seen = new Array<any>();
	
	const stringify = (parent: any, key: any, node: any, level: number): any =>
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
			return;
		}

		if (typeof node === 'number')
		{
			return isFinite(node) ? '' + node : 'null';
		}

		if (typeof node !== 'object')
        {
			return JSON.stringify(node);
		}

		let i = 0;
		let indent = '';
		let out = '';

		if (spacing)
		{
			indent += '\n';

			for (i = 0; i < level + 1; i++)
			{
				indent += spacing;
			}
		}

		if (Array.isArray(node))
        {
			out += '['; 

			for (i = 0; i < node.length; i++)
            {
				if (i) 
				{
					out += ',';
				}

				const value = stringify(node, i, node[i], level + 1) || 'null';

				out += indent + spacing + value;
			}

			out += indent;
			out += ']';

			return out;
		}

		if (node === null)
		{
			return 'null';
		}

		if (seen.indexOf(node) !== -1)
        {
			throw new TypeError('Converting circular structure to JSON.');
		}

		const seenIndex = seen.push(node) - 1;
		const keys = Object.keys(node).sort();

		for (i = 0; i < keys.length; i++)
        {
			const key = keys[i];
			const value = stringify(node, key, node[key], level + 1);

			if (!value) 
            {
                continue; 
            }

			if (out)
			{
				out += ',';
			}

			out += indent + spacing + JSON.stringify(key) + separator + value;
		}

		seen.splice(seenIndex, 1);

		return '{' + out + indent + '}';
	};
	
	return stringify({ '': x }, '', x, 0);
}
