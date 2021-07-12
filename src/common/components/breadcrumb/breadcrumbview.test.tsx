import "@testing-library/jest-dom/extend-expect";
import { render } from '@testing-library/react';
import React from 'react';
import { useBreadcrumbStore } from "../../../state";
import { NodePath } from "../../../types";
import Breadcrumbview from './breadcrumbview';



const pathData: NodePath[] = [
  {pathId: -1, pathName: "E2E Group"},
  {pathId: 15, pathName: "New Application Group"},
  {pathId: 26, pathName: "Application 1"},
  {pathId: 16, pathName: "New Application Group1"},
  {pathId: 30, pathName: "Application 5"}
]

test("Breadcumb renders with correct text", () => {
  const component = render(<Breadcrumbview />)
  const breadcrumbEl = component.getByTestId("breadcrumbtest")
  expect(breadcrumbEl.textContent).toBe("E2E Group")
})


test("Breadcumb renders with with correct text New Application Group ", () => {

// const paw = useBreadcrumbStore.getState().breadCrumbData
// const paw = useBreadcrumbStore.subscribe((state) => state.breadCrumbData)
// console.log("=============4545===============")
// console.log(paw);
// console.log("=============4545===============")
useBreadcrumbStore.setState({ breadCrumbData: pathData})

  const component = render(<Breadcrumbview />)
  const breadcrumbEl = component.getByTestId("breadcrumbtest")
  expect(breadcrumbEl.textContent).toContain("New Application Group")
})


test("Breadcumb renders with / separator", () => {

  useBreadcrumbStore.setState({ breadCrumbData: pathData})

  const component = render(<Breadcrumbview />)
  const breadcrumbEl = component.getByTestId("breadcrumbtest")
  expect(breadcrumbEl.textContent).toContain("/")
})


test("Breadcumb renders E2E Group with disabled paragraph", () => {

  // useBreadcrumbStore.setState({ breadCrumbData: pathData})

  const component = render(<Breadcrumbview />)
  const breadcrumbEl = component.getByTestId("disabledBreadLink")
  expect(breadcrumbEl.closest('p'))
})

test("Breadcumb renders last link with disabled paragraph", () => {

  useBreadcrumbStore.setState({ breadCrumbData: pathData})

  const component = render(<Breadcrumbview />)
  const breadcrumbEl = component.getByTestId("disabledBreadLink")
  expect(breadcrumbEl.closest('p'))
})



