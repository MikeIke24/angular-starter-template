import {UiStore} from './ui-store';

interface TestingState {
    id: string;
    value: string;
    test?: boolean;
}

const INITIAL_STATE: TestingState = {
    id: '1',
    value: 'test value'
};

describe('UIStore', () => {

    let uiStore: UiStore<TestingState>;

    beforeEach(() => {
        uiStore = new UiStore(INITIAL_STATE);
    });

    it('should create', () => {
        expect(uiStore).toBeTruthy();
    });

    it('should return single state prop value', (done) => {
        uiStore.getStateProp('value').subscribe(val => {
            expect(val).toBe('test value');
            done();
        });
    });

    it('should update ui state value', (done) => {
        spyOn(uiStore, 'dispatchUiState').and.callThrough();
        uiStore.updateUiState({value: 'new value'});
        uiStore.getUiState().subscribe(val => {
            if (!!val && val.value === 'new value') {
                expect(uiStore.dispatchUiState).toHaveBeenCalledTimes(1);
                done();
            }
        });
    });

    it('should reset ui state', (done) => {
        spyOn(uiStore, 'dispatchUiState').and.callThrough();
        uiStore.updateUiState({value: 'new value'});
        uiStore.getUiState().subscribe(val => {
            if (!!val && val.value === 'new value') {
                expect(uiStore.dispatchUiState).toHaveBeenCalledTimes(1);
                uiStore.resetUiState();
                uiStore.getUiState().subscribe(val2 => {
                    if (!!val2 && val2.value === 'test value') {
                        expect(uiStore.dispatchUiState).toHaveBeenCalledTimes(2);
                        done();
                    }
                });
            }
        });
    });

    it('should update ui state value by dispatching new state', (done) => {
        let count = 0;
        uiStore.dispatchUiState({value: 'new value', id: '123'});
        uiStore.getUiState().subscribe(val => {
            if (!!val && val.value === 'new value' && count === 0) {
                count = 1;
                uiStore.dispatchUiState();
            } else if (count === 1) {
                done();
            }
        });
    });
});
