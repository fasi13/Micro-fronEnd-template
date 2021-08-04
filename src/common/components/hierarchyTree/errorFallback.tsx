import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({
	error,
	resetErrorBoundary,
}: FallbackProps): JSX.Element => (
	<div role="alert" className="text-center text-white">
		<p>Something went wrong with loading your Application Hierarchy Tree:</p>
		<pre>{error.message}</pre>
		<button type="button" onClick={resetErrorBoundary}>
			Try again
		</button>
	</div>
);
