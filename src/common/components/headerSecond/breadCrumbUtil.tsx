
export function getButtonId(index: number) : string{

  return index !== -1 ? index.toString() : '1';
}

// const getButtonId = (index: number) => (
  //     breadCrumbData[index].pathId !== -1
	// 		? breadCrumbData[index].pathId.toString()
	// 		: '1'
  // );
