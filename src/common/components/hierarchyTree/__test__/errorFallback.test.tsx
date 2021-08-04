import { render } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../errorFallback';

let Bomb: React.FunctionComponent<{ shouldThrow: boolean }>;
let App: React.FunctionComponent<{ shouldThrow: boolean }>;
describe('ErrorBoundary and Fallback', () => {
	beforeEach(() => {
		Bomb = ({ shouldThrow }) => {
			if (shouldThrow) throw new Error('dummy error I made up');
			return <div>BOMB HERE</div>;
			return null;
		};

		App = (props: { shouldThrow: boolean }) => {
			const { shouldThrow } = props;
			return (
				<div>
					Testing errorboundary
					<div>
						<ErrorBoundary FallbackComponent={ErrorFallback}>
							<Bomb shouldThrow={shouldThrow} />
						</ErrorBoundary>
					</div>
				</div>
			);
		};
	});
	it('renders error boundary and reports error if thrown', () => {
		const { getByRole } = render(<App shouldThrow />);
		expect(getByRole('alert')).toBeInTheDocument();
		expect(getByRole('alert')).toMatchSnapshot();
	});

	it('dose not render error boundary if no error is thrown', () => {
		const { queryByRole } = render(<App shouldThrow={false} />);
		expect(queryByRole('alert')).not.toBeInTheDocument();
	});
});
