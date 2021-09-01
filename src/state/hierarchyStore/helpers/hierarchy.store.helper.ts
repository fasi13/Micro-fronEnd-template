import { ErrorResponse, NodePath, TreeView } from '../../../types';
import { THierarchyState } from '../type';
import {
	getNodeToUpdate,
	nodeErrorHandler,
	updateChildrenHandler,
} from './util.help';

export const nodeUpdateState = (
	set: any,
	nodePath: NodePath[],
	err: ErrorResponse | null,
	children: TreeView[],
): void => {
	set((state: THierarchyState) => {
		const node = getNodeToUpdate(state.hierarchyData, nodePath);

		if (node) {
			if (err) {
				nodeErrorHandler(err, node);
			} else {
				updateChildrenHandler(node, children);
			}
		}
	});
};
