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

// use this hierarchyStore

// export const updateStateWithUsersApplicationAndGroups = async (
// 	applicationId: string,
// 	set: any,
// ): Promise<void> => {
// 	const res = await axios
// 		.get<ApiResponse<TreeView>>(`applications/${applicationId}`)
// 		.catch((reason: ErrorResponse) => {
// 			set((state: THierarchyState) => {
// 				state.error = reason?.errors?.[0];
// 			});
// 		});
// 	if (res) {
// 		const applicationData = res.data.data;
// 		const childrenLink = getChildrenLink(applicationData?._links || []);
// 		const childrenGroupLink: Link | undefined = childrenLink?.find(
// 			c => c.rel === 'applicationGroups',
// 		);

// 		if (childrenGroupLink) {
// 			const resGroup = await axios.get<ApiResponse<DataPaginated<TreeView>>>(
// 				childrenGroupLink?.href,
// 			);

// 			if (resGroup) {
// 				set((state: THierarchyState) => {
// 					state.loading = false;
// 					state.hierarchyData = [
// 						{
// 							...applicationData,
// 							toggleNewEditor: '',
// 							error: null,
// 							saving: false,
// 							edit: false,
// 							loadingChildren: false,
// 							childrenData: resGroup?.data?.data.items.map(i => ({
// 								...i,
// 								collapsed: true,
// 							})),
// 							collapsed: false, // this needs to be based on default expand
// 						},
// 					];
// 				});
// 			}
// 		}
// 	}
// 	set((state: THierarchyState) => {
// 		state.loading = false;
// 	});
// };
