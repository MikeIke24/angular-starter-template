import {LoadingStore} from './loading-store';

describe('LoadingStore', () => {

    let loadingStore: LoadingStore;

    beforeEach(() => {
        loadingStore = new LoadingStore();
    });

    it('should create', () => {
        expect(loadingStore).toBeTruthy();
    });

    it('should return false for loading', (done) => {
        loadingStore.loading.subscribe(l => {
            expect(l).toBe(false);
            done();
        });
    });

    it('should return true for loading after starting', (done) => {
        loadingStore.startLoading();
        loadingStore.loading.subscribe(l => {
            if (l === true) {
                done();
            }
        });
    });

    it('should return false for loading after stopping', (done) => {
        loadingStore.startLoading();
        loadingStore.loading.subscribe(l => {
            if (l === true) {
                loadingStore.doneLoading();
                loadingStore.loading.subscribe(l2 => {
                    if (l2 === false) {
                        done();
                    }
                });
            }
        });
    });
});
