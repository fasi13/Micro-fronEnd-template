/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress, createStyles, List, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { HierarchyTree, SearchApplication } from '..';
import { detachStore, useHierarchyStore, useSearchStore } from '../../../state';
import { ApplicationPath, TreeView } from '../../../types';


const useStyles = makeStyles(() =>
  createStyles({
    rootList: {
      // zIndex: theme.zIndex.tooltip,
      margin: -16,
      background: "white",
      width: 320,
      "& :hover": {
        background: "#d3d3d3"
      }
    },
    searchContainer: {
      //  zIndex: theme.zIndex.tooltip,
    },
    // searchList: {
    //   display: "flex",
    //   justifyContent: "center",
    //   zIndex: theme.zIndex.tooltip,
    // }
  }),
);


const SidebarContent = () => {

  const classes = useStyles();

  // searchLoading,
	const { setSearchLoading, searchApplication, searchData } = useSearchStore();

  const [inputValue, setInputValue] = useState<string>('');

  const [open, setOpen] = React.useState(false);
  const searchLoading = open && searchData.length === 0;

	const {
		initializeHierarchyState,
		hierarchyData,
		setLoading,
		getHierarchyChildData,
		getUserApplication,
		createApplicationGroup,
		createApplication,
		editApplication,
		editApplicationGroup,
	} = useHierarchyStore();


	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		getUserApplication();
	}, []);

  useEffect(() => {
		const handler = setTimeout(() => {
			if (inputValue) {
				setSearchLoading(true);
				searchApplication(inputValue);
			}
		}, 1000);
		return () => {
			clearTimeout(handler);
		};
	}, [inputValue]);

  const getApplicationName = ({ path }: ApplicationPath): string  =>
		path[path.length - 1].name;

  const searchElement = (keyword: string) =>
  keyword.length < 3 ? null : setInputValue(keyword);

	return (
		<>
			<div className="w-full overflow-visible bg-grayblue">
        <>
          <div className="flex justify-center">
             <Autocomplete
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              //  className={classes.searchContainer}
              freeSolo
              id="combo-box-demo"
              style={{ width: 320, backgroundColor: "#fff", zIndex: 999999, }}
              // getOptionSelected={(option, value) => option.name === value.name}
              options={searchData}
              getOptionLabel = {(x) =>  getApplicationName(x)}
              autoComplete
              fullWidth
              loading={searchLoading}
              renderInput={params => (
                <TextField
                  {...params}
                  onChange={e => searchElement(e.target.value.toString())}
                  label="Search application..."
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
             renderOption={() =>
                searchData.length !== 0 ?
                  <div>
                    <List className={classes.rootList}>
                      {searchData.map((item: ApplicationPath) => (
                          <SearchApplication item={item} />
                      ))}
                    </List>
                  </div> : <p>No results found! </p>
              }
            />
          </div>
          <HierarchyTree
            onSelect={() => {
              console.log('hi');
            }}
            onToggle={async (
              item: TreeView,
              nodeId: number,
              nodePath: number[],
              cb: () => void,
            ) => {
              await getHierarchyChildData(item, nodeId, nodePath);
              cb();
            }}
            onAddGroup={async (
              item: TreeView,
              nodeId: number,
              nodePath: number[],
              name: string,
              cb: (err: any) => void,
            ) => {
              await createApplicationGroup(item, nodeId, nodePath, name);
              cb(null);
            }}
            onAddApplication={async (
              item: TreeView,
              nodeId: number,
              nodePath: number[],
              name: string,
              value: string,
              cb: (err: any) => void,
            ) => {
              await createApplication(item, nodeId, nodePath, name, value);
              cb(null);
            }}
            onEditApplication={async (
              item: TreeView,
              nodeId: number,
              nodePath: number[],
              name: string,
              value: string,
              cb: (err: any) => void,
            ) => {
              await editApplication(item, nodeId, nodePath, name, value);
              cb(null);
            }}
            onEditGroup={async (
              item: TreeView,
              nodeId: number,
              nodePath: number[],
              name: string,
              cb: (err: any) => void,
            ) => {
              await editApplicationGroup(item, nodeId, nodePath, name);
              cb(null);
            }}
            data={hierarchyData}
            expandNodesAtLevel={0}
          />
        </>
			</div>
		</>
	);
};

export const Sidebar = () => {
	const style = {
		display: 'flex',
		alignItems: 'start',
		justifyContent: 'center',
		background: '#31506A',
		// zIndex: 99999,
		zIndex: 1300,
		top: '35px !important',
		left: '35px !important',
		boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
	};
	const dSOpen = detachStore(state => state.setOpen);
	const dSSetDetachSidebar = detachStore(state => state.setDetachSidebar);
	const dSSidebarState = detachStore(state => state.detachSidebar);

	const setOpen = (opn: boolean) => {
		dSOpen(opn);
	};
	const setTearSidebar = (detach: boolean) => {
		setOpen(false);
		dSSetDetachSidebar(detach);
	};
	const handleAttach = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setTearSidebar(false);
	};

	return dSSidebarState ? (
		<Rnd
			style={style}
			default={{
				x: 500,
				y: 0,
				width: 840,
				height: 600,
			}}>
			<div className="w-full h-full m-4 mr-1 overflow-y-auto">
				<SidebarContent />
			</div>
			<div
				onKeyDown={() => handleAttach}
				role="button"
				tabIndex={0}
				aria-label="close-tear"
				style={{
					fontSize: 20,
					background: '#31506A',
					borderRadius: '0px 8px 8px 0px',
					color: 'white',
					boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
				}}
				id="icon"
				onClick={handleAttach}>
				x
			</div>
		</Rnd>
	) : (
		<SidebarContent />
	);
};
