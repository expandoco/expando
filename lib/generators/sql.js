if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}
define(function(){
	var generator = function(tree, configuration){
		var sep = ", ",
		newLine = "\n",
		quote = "'";

		function resolveValue(typeName){
			var resolver = configuration.types[typeName];
			var value = typeName;
			if (resolver !== undefined) {
				value = resolver.resolve();
			}
			return value;
		}



		function generate(){

			var output = "",
			node = tree.nodes[0];

			if (node.isArray) {
				for (var i = 0; i < node.count; i++) {
					output += writeRow(node.alias, node.nodes);
					output += newLine;
				}
			}
			else
			{

					output += writeRow(tree.alias, tree.nodes);
					output += newLine;

			}



			return output;
		}

		function needQuotes(type){
			return (type == "string" || type == "date");
		}

		

		function writeRow(table, nodes){
			var output = "INSERT INTO [" + table + "] (";

			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i],
				isLast = (i == nodes.length - 1);

				output += "[" + node.alias + "]";

				if (!isLast) {
					output += sep;
				}
			}

			output += ") VALUES (";

			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i],
				isLast = (i == nodes.length - 1);

				if (needQuotes(node.baseType)) {
					output += quote;
				}
				output += resolveValue(node.type);

				if (needQuotes(node.baseType)) {
					output += quote;
				}

				if (!isLast) {
					output += sep;
				}

			};

			output += ");";

			return output;
		}


		return {
			generate: generate
		};
	};
	return {
		generator: generator
	}
});
