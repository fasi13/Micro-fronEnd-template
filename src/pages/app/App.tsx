import React, { useEffect } from 'react';
import { HierarchyTree } from '../../common/components';
import { useHierarchyStore } from '../../state';
import { TreeView } from '../../types';
import './App.css';

const App = () => {
	// const [inputValue, setInputValue] = useState<string>('');
	const {

		loading,
		initializeHierarchyState,
		hierarchyData,
		setLoading,
		getHierarchyChildData,
		getUserApplication,
	} = useHierarchyStore();

	// const { setSearchLoading, searchApplication, searchData } = useSearchStore();

	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		getUserApplication();
	}, []);
	// useEffect(() => {
	// 	const handler = setTimeout(() => {
	// 		if (inputValue) {
	// 			setSearchLoading(true);
	// 			searchApplication(inputValue);
	// 		}
	// 	}, 1000);
	// 	return () => {
	// 		clearTimeout(handler);
	// 	};
	// }, [inputValue]);

	// const setNewGroup = (value: string) => {
	// 	setNewChange(value);
	// };
	// const addApplicationGroup = (item: TreeView, action: string) => {
	// 	createApplicationGroup(item, action, { name: newChange });
	// };

	// const searchElement = (keyword: string) =>
	// 	keyword.length < 3 ? null : setInputValue(keyword);

	// const toggleCollapse = (item: TreeView) => {
	// 	// setLoading(true);
	// 	getHierarchyChildData(item);
	// };

	if (loading) {
		return <p>Loading...</p>;
	}



	return (
		<>
				<div className="">
					<HierarchyTree
						onSelect={() => {
							console.log('hi');
						}}
						onToggle={async (item:TreeView,nodeId: number,nodePath: number[],cb: () => void)=>{
							console.log("---- onToggle");
						  await getHierarchyChildData(item,nodeId,nodePath);
							cb();
						}}
						onEdit={() => {
							console.log('hi');
						}}
						data={hierarchyData}
						expandNodesAtLevel = {0}
					/>
				</div>
			{/* <div className="flex flex-row">{JSON.stringify(hierarchyData, null ,2)}</div> */}
		</>
	);
};

export default App;
