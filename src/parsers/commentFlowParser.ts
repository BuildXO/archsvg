import { FlowchartData, FlowchartNode, FlowchartEdge } from '../generators';

/**
 * Parse comment-style flowchart notation into FlowchartData
 * 
 * Supports formats like:
 * // User -> API
 * // API -> Database
 * # A -> B -> C
 * * Start -> End
 */
export function parseCommentToFlowchart(selectedText: string): FlowchartData {
    const lines = selectedText.split('\n');
    const nodes = new Map<string, FlowchartNode>();
    const edges: FlowchartEdge[] = [];
    const edgeSet = new Set<string>(); // For deduplication

    for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) {
            continue;
        }

        // Only process lines with arrows
        if (!line.includes('->')) {
            continue;
        }

        // Remove common comment prefixes
        let cleaned = line.trim();
        cleaned = cleaned.replace(/^\/\/+\s*/, '');  // Remove //
        cleaned = cleaned.replace(/^#+\s*/, '');     // Remove #
        cleaned = cleaned.replace(/^\*+\s*/, '');    // Remove *
        cleaned = cleaned.replace(/^\/\*+\s*/, '');  // Remove /*
        cleaned = cleaned.replace(/\*+\/\s*$/, '');  // Remove */

        // Split by arrow and process chain
        const parts = cleaned.split('->').map(p => p.trim()).filter(p => p.length > 0);

        // Process the chain: A -> B -> C
        for (let i = 0; i < parts.length; i++) {
            const label = parts[i];
            const nodeId = slugify(label);

            // Add node if not exists
            if (!nodes.has(nodeId)) {
                nodes.set(nodeId, { id: nodeId, label });
            }

            // Create edge to next node
            if (i < parts.length - 1) {
                const nextLabel = parts[i + 1];
                const nextNodeId = slugify(nextLabel);
                
                // Add next node if not exists
                if (!nodes.has(nextNodeId)) {
                    nodes.set(nextNodeId, { id: nextNodeId, label: nextLabel });
                }

                // Add edge (deduplicate)
                const edgeKey = `${nodeId}->${nextNodeId}`;
                if (!edgeSet.has(edgeKey)) {
                    edgeSet.add(edgeKey);
                    edges.push({ from: nodeId, to: nextNodeId });
                }
            }
        }
    }

    // Validate we got at least some edges
    if (edges.length === 0) {
        throw new Error('No valid flowchart arrows found. Use format: "A -> B"');
    }

    return {
        nodes: Array.from(nodes.values()),
        edges
    };
}

/**
 * Convert label to a valid node ID
 * Keeps it readable but unique
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove non-word chars (except -)
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}
