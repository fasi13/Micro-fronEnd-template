import { ReadCultureSuccessAction, ReadAvailableCulturesSuccessAction } from './culture.actions';
import { CultureState, reducer } from './culture.reducers';
describe('CultureReducers', () => {

  it('should return initial state', () => {
    const InitialState: CultureState = {
      currentCulture: 'en-US',
      availableCultures: ['cul1', 'cul2']
    };

    const state = reducer(InitialState, {type: null});

    expect(state).toBe(InitialState);
  });

  it('should update current culture ', () => {
    const state = reducer(undefined, new ReadCultureSuccessAction({cultureCode: 'fr-CA'}));
    expect(state.currentCulture).toBe('fr-CA');
  });

  it('should update available cultures', () => {
    const InitialState: CultureState = {
      currentCulture: 'en-US',
      availableCultures: null
    };

    const state = reducer(InitialState, new ReadAvailableCulturesSuccessAction({availableCultures: ['fr-CA', 'en-CA']}));

    expect(state.availableCultures).toEqual(['fr-CA', 'en-CA']);
  });

});
