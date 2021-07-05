import {
	ApiResponse,
	Application,
	ApplicationResponse,
	DataPaginated,
	Link,
	TreeView
} from '../types';
import { HierarchyClient as axios } from '../util/axios';
import createStore from '../util/immer';

const getSelfLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'self');

const getSelfUpdateLink = (links: Link[], isGroup: boolean): Link | undefined =>
	isGroup
		? links.find(l => l.rel === 'updateApplicationGroup')
		: links.find(l => l.rel === 'updateApplication');

const getCreateGroupLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'createApplicationGroup');

const getCreateApplicationLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'createApplication');

const loadChildren = (links: Link[]): Link[] | undefined =>
	links.filter(l => l.rel === 'applications' || l.rel === 'applicationGroups');

const getAction = (data: TreeView, action: string): any => {
	if (data._links) {
		return data._links.find(item => item.rel === action);
	}
	return null;
};

const updateNodeWithChildren = (node: TreeView, children: TreeView[]) : TreeView[] =>  {
	if (node && node?.childrenData) {
		return [...node?.childrenData, ...children];
	}
		return [...children];
}

interface HierarchyState {
	rootApplication: Application | null;
	loading: boolean;

	activeNodeId: number;
	hierarchyData: TreeView[];
	// childrenData: TreeView[];

	newChange: string;

	setNewChange: (value: string) => void;
	setLoading: (val: boolean) => void;

	loadApplication: (applicationId: string) => void;
	loadGroup: () => void;
	updateApplication: (node: TreeView) => void;
	createItem: (name: string, group: TreeView, isGroup: boolean) => void;
	initializeHierarchyState: () => void;
	updateHierarchyStore: (
		newNode: ApplicationResponse,
		isGroup: boolean,
	) => void;
	createApplicationGroup: (
		data: any,
		actionName: string,
		options?: {
			name?: any;
			params?: {
				[param: string]: string | string[];
			};
		},
	) => void;
	getUserApplication: () => void;
	getHierarchyChildData: (item: TreeView,nodeId: number, nodePath: number[]) => void;
}

const HierarchyStore = (set: any, get: any): HierarchyState => ({
	rootApplication: null,
	loading: false,
	activeNodeId: 0,
	hierarchyData: [],
	// childrenData: [],
	newChange: '',

	setNewChange: (value: string) =>
		set((state: HierarchyState) => {
			state.newChange = value;
		}),
	setLoading: (val: boolean) =>
		set((state: HierarchyState) => {
			state.loading = val;
		}),

	loadApplication: async (applicationId: string) => {
		const res = await axios.get<ApiResponse<TreeView>>(
			`applications/${applicationId}`,
		);

		if (res) {
			const applicationData = res.data.data;

			const childrenLink = loadChildren(applicationData?._links || []);
			const childrenGroupLink: Link | undefined = childrenLink?.find(
				c => c.rel === 'applicationGroups',
			);

			if (childrenGroupLink) {
				const resGroup = await axios.get<ApiResponse<DataPaginated<TreeView>>>(
					childrenGroupLink?.href,
				);

				if (resGroup) {
					set((state: HierarchyState) => {
						state.loading = false;
						state.hierarchyData = [
							{ ...applicationData, childrenData: resGroup?.data?.data.items },
						];
					});
				}
			}
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
	},
	loadGroup: () => {
		console.log('wee');
	},
	updateApplication: (node: TreeView) => {
		console.log('wee', node);
	},
	createItem: async (name: string, group: TreeView, isGroup: boolean) => {
		console.log('wee', name, group, isGroup);
	},
	initializeHierarchyState: () =>
		set((state: HierarchyState) => {
			state.activeNodeId = 1;
		}),
	updateHierarchyStore: (newNode: ApplicationResponse, isGroup: boolean) => {
		if (!newNode.parentApplicationId && !newNode.applicationGroupId) {
			// this is parent
			set((state: HierarchyState) => {
				state.hierarchyData.length = 0;
				state.hierarchyData.push({
					id: newNode.id,
					name: newNode.name,
					value: newNode.value,
					executedFetch: true,
					isGroup: false,
					childrenData: [],
					loading: false,
					selfLink: getSelfLink(newNode._links),
					selfUpdateLink: getSelfUpdateLink(newNode._links, isGroup),
					createGroupLink: getCreateGroupLink(newNode._links),
					createApplicationLink: getCreateApplicationLink(newNode._links),
					loadChildrenLink: loadChildren(newNode._links),
					edit: false,
				});
			});
		}
	},
	createApplicationGroup: (
		data: any,
		actionName: string,
		options?: {
			name?: any;
			params?: {
				[param: string]: string | string[];
			};
		},
	): void => {
		if (data) {
			const link: Link = getAction(data, actionName);

			if (link) {
				const { method, href } = link;
				console.log('options', options);
				axios({
					method: method.method,
					url: href,
					data: options,
				}).then(resp => resp.data);
			}
		}
	},

	getUserApplication: async () => {
		get().setLoading(true);
		// const response = await axios.get<ApiResponse<string>>(`applications`);
		// if (response && response.status === 200){
		// 	 await get().loadApplication(response.data);
		// }
		await get().loadApplication(1);
	},


	// eslint-disable-next-line sonarjs/cognitive-complexity
	getHierarchyChildData: async (data: TreeView, nodeId:   number, nodePath: number[] ) => {
		console.log('---- getHierarchyChildData');

		if (data._links) {
			const links = loadChildren(data._links);
			if(links)
			{
				const resp = await Promise.all(
					links.map(async link => {
						const { method, href } = link;
						return axios({
							method: method.method,
							url: href,
						});
					}),
				);
				if (resp)
				{
					resp.forEach((res)=>{
						if(res.status === 200){
								set((state: HierarchyState) => {
									// we need to flatten it here other wise can not access it.
									// consider something like this [1,0,0,1]. to indicate the full path of the  node.


								const {hierarchyData} = state;
								let i = 1;
								let parentNode: TreeView = hierarchyData[0];
								while(i <= nodePath.length-1 ){
									if(parentNode.childrenData){
										// eslint-disable-next-line no-loop-func
										const p = parentNode?.childrenData.find(pn => pn.id === nodePath[i]);
										if(p)
											parentNode = p;
									 }
									i +=1;
								}

								if(parentNode){
								const childrenData = updateNodeWithChildren(
									parentNode,
									res?.data?.data.items,
								);
								parentNode.childrenData = [...childrenData];
								}
							});
						}
						else
							console.log("Report Error here")
					});
				}

			}
		}
		set((state: HierarchyState) => {
			state.loading = false;
		});
	}
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<HierarchyState>(HierarchyStore);



